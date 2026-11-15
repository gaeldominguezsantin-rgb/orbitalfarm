"""Multi-objective crop rotation simulation and Beam Search optimization engine.

Integrates NASA POWER climate telemetry, FAO-56 soil-water balance, GDD thermal
viability, nitrogen cycling, soil organic matter (SOM) trajectory, and botanical
family pest-break rules weighted by farmer priorities.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

from .crops import CROPS, CropSpec
from .nasa_power import apply_climate_stress_scenario
from .soil_water import LocalSoilConfig, effective_rainfall_mm


@dataclass
class FarmerPriorities:
    """Normalized or unnormalized farmer priority weights (0-100 scale in UI)."""

    soil_health: float = 30.0
    water_conservation: float = 30.0
    climate_resilience: float = 20.0
    profit_food: float = 20.0

    def normalized(self) -> Tuple[float, float, float, float]:
        total = max(
            1e-6,
            self.soil_health
            + self.water_conservation
            + self.climate_resilience
            + self.profit_food,
        )
        return (
            self.soil_health / total,
            self.water_conservation / total,
            self.climate_resilience / total,
            self.profit_food / total,
        )


def _season_month_indices(latitude: float) -> Tuple[List[int], List[int], str, str]:
    """Return (season_a_indices, season_b_indices, label_a, label_b) 0-based."""
    if abs(latitude) < 12.0:
        # Equatorial bimodal: Long Rains (Mar-Aug), Short Rains (Sep-Feb)
        return (
            [2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 0, 1],
            "Season A (Mar-Aug)",
            "Season B (Sep-Feb)",
        )
    if latitude >= 12.0:
        return (
            [4, 5, 6, 7, 8, 9],
            [10, 11, 0, 1, 2, 3],
            "Warm Season (May-Oct)",
            "Cool Season (Nov-Apr)",
        )
    return (
        [10, 11, 0, 1, 2, 3],
        [4, 5, 6, 7, 8, 9],
        "Warm Season (Nov-Apr)",
        "Cool Season (May-Oct)",
    )


def _kc_curve_6m(crop: CropSpec) -> List[float]:
    return [
        crop.kc_ini,
        0.5 * (crop.kc_ini + crop.kc_mid),
        crop.kc_mid,
        crop.kc_mid,
        0.6 * crop.kc_mid + 0.4 * crop.kc_end,
        crop.kc_end,
    ]


def simulate_season(
    crop: CropSpec,
    months_slice: List[Dict[str, Any]],
    soil: LocalSoilConfig,
    som_pct: float,
    avail_n_kg_ha: float,
    soil_water_frac: float,
    residue_cover: float,
    family_history: List[str],
    annual_heat_days: int,
) -> Dict[str, Any]:
    """Simulate one 6-month growing season for `crop` under NASA POWER climate."""
    # 1. Thermal / GDD feasibility
    gdd_acc = 0.0
    heat_months = 0
    frost_months = 0
    t_means: List[float] = []
    for m in months_slice:
        tm = float(m["t2m"])
        tx = float(m["t2m_max"])
        tn = float(m["t2m_min"])
        t_means.append(tm)
        gdd_acc += max(0.0, tm - crop.gdd_base_c) * float(m["days"])
        if tx > crop.t_heat_limit_c:
            heat_months += 1
        if tn < crop.t_frost_limit_c:
            frost_months += 1

    gdd_ratio = min(1.0, gdd_acc / max(1.0, crop.gdd_required))
    mean_season_t = sum(t_means) / max(1, len(t_means))

    # Optimal thermal match
    if crop.t_opt_min_c <= mean_season_t <= crop.t_opt_max_c:
        temp_suit = 1.0
    else:
        dist_t = min(
            abs(mean_season_t - crop.t_opt_min_c),
            abs(mean_season_t - crop.t_opt_max_c),
        )
        temp_suit = max(0.25, 1.0 - 0.065 * dist_t)

    heat_penalty = min(0.55, heat_months * 0.14 + (annual_heat_days / 120.0) * (1.0 - crop.drought_tolerance) * 0.15)
    frost_penalty = min(0.75, frost_months * 0.24)
    thermal_score = max(0.10, gdd_ratio * temp_suit * (1.0 - heat_penalty) * (1.0 - frost_penalty))

    # 2. Root-zone soil water balance (6 months)
    soil_cfg_now = LocalSoilConfig(
        texture=soil.texture,
        som_pct=som_pct,
        ph=soil.ph,
        initial_n_kg_ha=avail_n_kg_ha,
        slope_pct=soil.slope_pct,
        irrigation_mode=soil.irrigation_mode,
    )
    awc_mm_m = soil_cfg_now.effective_awc_mm_per_m()
    taw_mm = max(45.0, awc_mm_m * crop.root_depth_m)
    raw_mm = 0.55 * taw_mm

    # Blend carried-over moisture with NASA MERRA-2 initial planting month root wetness
    nasa_init_wet = float(months_slice[0]["gwetroot"])
    sw_mm = taw_mm * (0.55 * soil_water_frac + 0.45 * nasa_init_wet)
    kc_seq = _kc_curve_6m(crop)

    total_etc = 0.0
    total_peff = 0.0
    total_irrig = 0.0
    ks_values: List[float] = []

    for m, kc in zip(months_slice, kc_seq):
        etc_m = float(m["eto_mm"]) * kc
        peff_m = effective_rainfall_mm(
            float(m["precip_mm"]),
            soil_cfg_now,
            residue_cover_bonus=residue_cover * 0.09,
        )
        total_etc += etc_m
        total_peff += peff_m

        # Update soil water
        sw_avail = sw_mm + peff_m
        deficit_to_raw = max(0.0, raw_mm - (sw_avail - etc_m))
        irrig_m = 0.0
        if soil.irrigation_mode == "deficit":
            irrig_m = 0.55 * deficit_to_raw
        elif soil.irrigation_mode == "full":
            irrig_m = 0.95 * deficit_to_raw
        total_irrig += irrig_m

        sw_end = sw_avail + irrig_m - etc_m
        if sw_end < 0.0:
            actual_et = sw_avail + irrig_m
            sw_end = 0.0
        else:
            actual_et = etc_m

        if sw_end >= raw_mm:
            ks_m = 1.0
        else:
            raw_ratio = max(0.0, sw_end / max(1.0, raw_mm))
            ks_m = min(1.0, raw_ratio + crop.drought_tolerance * 0.30 * (1.0 - raw_ratio))

        ks_values.append(max(0.20, ks_m))
        # Drain excess above TAW
        sw_mm = min(taw_mm, sw_end)

    mean_ks = sum(ks_values) / len(ks_values)
    final_water_frac = max(0.15, min(0.95, sw_mm / taw_mm))
    water_efficiency = min(1.0, (total_peff / max(1.0, total_etc)) + (0.25 if crop.drought_tolerance >= 0.75 else 0.0))

    # 3. Soil pH, Nitrogen & Botanical Family Rotation Rules
    ph_suit = soil_cfg_now.ph_suitability(crop.ph_min, crop.ph_max)
    mineralized_n = som_pct * 11.0
    n_pool = avail_n_kg_ha + mineralized_n

    n_synergy_bonus = 0.0
    if crop.n_net_kg_ha < 0:
        n_demand = abs(crop.n_net_kg_ha)
        n_adequacy = min(1.0, max(0.42, n_pool / max(1.0, n_demand)))
        # Leaching & uptake update
        leach_factor = 1.0 - (1.0 - soil_cfg_now.profile().n_retention) * 0.25
        next_n = max(14.0, (avail_n_kg_ha + mineralized_n * 0.4 + crop.n_net_kg_ha * 0.55) * leach_factor)
    else:
        n_adequacy = 1.0
        n_fix = crop.n_net_kg_ha * (0.65 + 0.35 * mean_ks)
        next_n = min(145.0, avail_n_kg_ha + n_fix * 0.78)
        n_synergy_bonus = 0.06

    # Botanical family carryover rules
    pest_risk = 0.08
    pest_yield_factor = 1.0
    if family_history:
        last_fam = family_history[-1]
        if last_fam == crop.family:
            pest_risk += 0.42
            pest_yield_factor *= 0.72
        elif crop.family in family_history[-2:]:
            pest_risk += 0.18
            pest_yield_factor *= 0.89
        if crop.family == "Solanaceae" and "Solanaceae" in family_history[-4:]:
            pest_risk += 0.35
            pest_yield_factor *= 0.74
        # Biofumigation & N-break synergies
        if last_fam == "Brassicaceae" and crop.group == "cereal":
            pest_risk = max(0.04, pest_risk - 0.05)
            pest_yield_factor = min(1.08, pest_yield_factor + 0.06)
        if last_fam in ("Fabaceae", "Cover_Legume") and crop.n_net_kg_ha < -40:
            pest_yield_factor = min(1.08, pest_yield_factor + 0.07)

    pest_risk = min(0.95, pest_risk)

    # SOM dynamics (residue cover from previous crop slows oxidation)
    som_residue_buffer = 0.03 if residue_cover >= 0.6 else 0.0
    next_som = max(0.6, min(7.5, som_pct + crop.som_delta_pct + som_residue_buffer))

    # Composite yield resilience (0-1)
    yield_resilience = max(
        0.12,
        min(
            1.05,
            thermal_score * mean_ks * ph_suit * n_adequacy * pest_yield_factor,
        ),
    )

    # Component sub-scores (0-100 scale)
    soil_score = max(
        0.0,
        min(
            100.0,
            50.0
            + (crop.som_delta_pct * 220.0)
            + (22.0 if crop.n_net_kg_ha > 0 else -8.0)
            + (crop.residue_cover * 18.0)
            - pest_risk * 35.0,
        ),
    )
    water_score = max(
        0.0,
        min(
            100.0,
            mean_ks * 45.0
            + crop.drought_tolerance * 30.0
            + water_efficiency * 25.0
            - min(25.0, total_irrig / 18.0),
        ),
    )
    climate_score = max(
        0.0,
        min(
            100.0,
            thermal_score * 60.0 + crop.drought_tolerance * 25.0 + (1.0 - pest_risk) * 15.0,
        ),
    )
    profit_food_score = max(
        0.0,
        min(
            100.0,
            yield_resilience * (55.0 * crop.economic_index + 45.0 * crop.food_security_score),
        ),
    )

    return {
        "crop_id": crop.id,
        "crop_name_en": crop.name_en,
        "crop_name_es": crop.name_es,
        "scientific_name": crop.scientific_name,
        "family": crop.family,
        "group": crop.group,
        "color_hex": crop.color_hex,
        "root_morphology": crop.root_morphology,
        "root_depth_m": crop.root_depth_m,
        "gdd_accumulated": round(gdd_acc, 0),
        "gdd_ratio": round(gdd_ratio, 2),
        "thermal_score": round(thermal_score, 3),
        "water_stress_ks": round(mean_ks, 3),
        "etc_mm": round(total_etc, 1),
        "effective_rain_mm": round(total_peff, 1),
        "irrigation_mm": round(total_irrig, 1),
        "yield_resilience_pct": round(min(100.0, yield_resilience * 100.0), 1),
        "pest_risk_pct": round(pest_risk * 100.0, 1),
        "n_balance_end_kg_ha": round(next_n, 1),
        "som_end_pct": round(next_som, 3),
        "final_water_frac": round(final_water_frac, 3),
        "residue_cover_out": crop.residue_cover,
        "subscores": {
            "soil": round(soil_score, 1),
            "water": round(water_score, 1),
            "climate": round(climate_score, 1),
            "profit_food": round(profit_food_score, 1),
        },
        "n_synergy_bonus": n_synergy_bonus,
    }


def _candidate_crops_for_window(
    months_slice: List[Dict[str, Any]],
    is_warm_window: bool,
    equatorial: bool,
) -> List[CropSpec]:
    """Pre-filter crops that have basic thermal viability for a 6-month window."""
    candidates: List[CropSpec] = []
    mean_t = sum(float(m["t2m"]) for m in months_slice) / len(months_slice)
    min_t = min(float(m["t2m_min"]) for m in months_slice)

    for crop in CROPS.values():
        if not equatorial:
            if is_warm_window and crop.season_affinity == "cool":
                # Allow flexible or warm; skip strict cool crops in peak summer
                continue
            if not is_warm_window and crop.season_affinity == "warm":
                continue
        # Basic GDD & hard-freeze sanity filter
        gdd = sum(max(0.0, float(m["t2m"]) - crop.gdd_base_c) * float(m["days"]) for m in months_slice)
        if gdd < crop.gdd_required * 0.55:
            continue
        if min_t < crop.t_frost_limit_c - 4.0 and crop.season_affinity != "cool":
            continue
        if mean_t > crop.t_heat_limit_c + 1.0:
            continue
        candidates.append(crop)

    if not candidates:
        # Fallback to hardiest crops if extreme location
        return [CROPS["barley"], CROPS["vetch_cover"], CROPS["sorghum"]]
    return candidates


def evaluate_sequence(
    crop_ids: List[str],
    climate_profile: Dict[str, Any],
    soil: LocalSoilConfig,
    priorities: FarmerPriorities,
) -> Dict[str, Any]:
    """Simulate a full multi-season crop rotation sequence and compute aggregate metrics."""
    lat = float(climate_profile["latitude"])
    equatorial = abs(lat) < 12.0
    idx_a, idx_b, label_a, label_b = _season_month_indices(lat)
    months = climate_profile["months"]
    heat_days = int(climate_profile["annual_summary"]["heat_stress_days_yr"])

    w_soil, w_water, w_clim, w_prof = priorities.normalized()
    som = soil.som_pct
    avail_n = soil.initial_n_kg_ha
    sw_frac = float(months[idx_a[0]]["gwetroot"])
    residue = 0.30
    fam_hist: List[str] = []

    seasons_out: List[Dict[str, Any]] = []
    tot_etc = 0.0
    tot_irrig = 0.0
    tot_n_fixed = 0.0

    for step, cid in enumerate(crop_ids):
        crop = CROPS[cid]
        year_num = (step // 2) + 1
        is_a = (step % 2) == 0
        m_indices = idx_a if is_a else idx_b
        m_slice = [months[i] for i in m_indices]
        s_label = f"Y{year_num} · {label_a if is_a else label_b}"
        if equatorial:
            s_label = f"Y{year_num} · {label_a if is_a else label_b}"

        sim = simulate_season(
            crop=crop,
            months_slice=m_slice,
            soil=soil,
            som_pct=som,
            avail_n_kg_ha=avail_n,
            soil_water_frac=sw_frac,
            residue_cover=residue,
            family_history=fam_hist,
            annual_heat_days=heat_days,
        )
        sim["season_index"] = step + 1
        sim["year"] = year_num
        sim["season_label"] = s_label
        sim["month_indices"] = m_indices
        seasons_out.append(sim)

        som = sim["som_end_pct"]
        avail_n = sim["n_balance_end_kg_ha"]
        sw_frac = sim["final_water_frac"]
        residue = sim["residue_cover_out"]
        fam_hist.append(crop.family)

        tot_etc += sim["etc_mm"]
        tot_irrig += sim["irrigation_mm"]
        if crop.n_net_kg_ha > 0:
            tot_n_fixed += crop.n_net_kg_ha

    n_seasons = len(seasons_out)
    avg_soil = sum(s["subscores"]["soil"] for s in seasons_out) / n_seasons
    avg_water = sum(s["subscores"]["water"] for s in seasons_out) / n_seasons
    avg_clim = sum(s["subscores"]["climate"] for s in seasons_out) / n_seasons
    avg_prof = sum(s["subscores"]["profit_food"] for s in seasons_out) / n_seasons
    avg_yield = sum(s["yield_resilience_pct"] for s in seasons_out) / n_seasons
    avg_pest = sum(s["pest_risk_pct"] for s in seasons_out) / n_seasons

    unique_families = len(set(CROPS[cid].family for cid in crop_ids))
    unique_crops = len(set(crop_ids))
    has_legume_or_cover = any(CROPS[cid].group in ("legume", "cover") for cid in crop_ids)

    diversity_bonus = (unique_families - 1) * 3.2 + (unique_crops - 1) * 1.4
    if has_legume_or_cover:
        diversity_bonus += 3.5

    composite_score = (
        w_soil * avg_soil
        + w_water * avg_water
        + w_clim * avg_clim
        + w_prof * avg_prof
        + diversity_bonus
        - avg_pest * 0.25
    )

    return {
        "crop_ids": crop_ids,
        "composite_score": round(composite_score, 1),
        "metrics": {
            "soil_health_score": round(avg_soil, 1),
            "water_conservation_score": round(avg_water, 1),
            "climate_resilience_score": round(avg_clim, 1),
            "profit_food_score": round(avg_prof, 1),
            "mean_yield_resilience_pct": round(avg_yield, 1),
            "mean_pest_risk_pct": round(avg_pest, 1),
            "som_start_pct": round(soil.som_pct, 2),
            "som_end_pct": round(som, 2),
            "som_delta_pct": round(som - soil.som_pct, 2),
            "total_etc_mm": round(tot_etc, 1),
            "total_irrigation_mm": round(tot_irrig, 1),
            "biological_n_fixed_kg_ha": round(tot_n_fixed, 1),
            "unique_families": unique_families,
            "unique_crops": unique_crops,
        },
        "seasons": seasons_out,
    }


def _baseline_monoculture_sequence(
    climate_profile: Dict[str, Any],
    num_seasons: int = 6,
    current_crop_id: Optional[str] = None,
) -> List[str]:
    """Construct a conventional baseline using the farmer's current crop or regional cereal."""
    if current_crop_id and current_crop_id in CROPS:
        return [current_crop_id for _ in range(num_seasons)]

    lat = float(climate_profile["latitude"])
    equatorial = abs(lat) < 12.0
    idx_a, idx_b, _, _ = _season_month_indices(lat)
    months = climate_profile["months"]

    warm_cands = _candidate_crops_for_window([months[i] for i in idx_a], True, equatorial)
    cool_cands = _candidate_crops_for_window([months[i] for i in idx_b], False, equatorial)

    warm_ids = {c.id for c in warm_cands}
    cool_ids = {c.id for c in cool_cands}

    warm_choice = "maize" if "maize" in warm_ids else ("sorghum" if "sorghum" in warm_ids else warm_cands[0].id)
    if equatorial:
        cool_choice = warm_choice
    else:
        cool_choice = "winter_wheat" if "winter_wheat" in cool_ids else ("barley" if "barley" in cool_ids else cool_cands[0].id)

    seq: List[str] = []
    for s in range(num_seasons):
        seq.append(warm_choice if s % 2 == 0 else cool_choice)
    return seq


def optimize_rotations(
    climate_profile: Dict[str, Any],
    soil: LocalSoilConfig,
    priorities: FarmerPriorities,
    scenario: str = "baseline",
    num_years: int = 3,
    top_k: int = 3,
    current_crop_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Run Beam Search optimization over `num_years * 2` seasons and compare to monoculture."""
    stressed_climate = apply_climate_stress_scenario(climate_profile, scenario=scenario)
    num_seasons = max(2, min(4, int(num_years))) * 2
    lat = float(stressed_climate["latitude"])
    equatorial = abs(lat) < 12.0
    idx_a, idx_b, _, _ = _season_month_indices(lat)
    months = stressed_climate["months"]
    heat_days = int(stressed_climate["annual_summary"]["heat_stress_days_yr"])

    w_soil, w_water, w_clim, w_prof = priorities.normalized()

    # Beam state: (cumulative_score, crop_ids, som, avail_n, sw_frac, residue, fam_hist)
    init_sw = float(months[idx_a[0]]["gwetroot"])
    beam: List[Tuple[float, List[str], float, float, float, float, List[str]]] = [
        (0.0, [], soil.som_pct, soil.initial_n_kg_ha, init_sw, 0.30, [])
    ]
    beam_width = 48

    for step in range(num_seasons):
        is_a = (step % 2) == 0
        m_slice = [months[i] for i in (idx_a if is_a else idx_b)]
        cands = _candidate_crops_for_window(m_slice, is_warm_window=is_a, equatorial=equatorial)

        next_beam: List[Tuple[float, List[str], float, float, float, float, List[str]]] = []
        for cum_score, seq, som, avail_n, sw_frac, residue, fam_hist in beam:
            for crop in cands:
                # Enforce rotational family break unless no non-same-family alternatives exist
                if fam_hist and fam_hist[-1] == crop.family and len(cands) > 2:
                    continue
                # Prevent 100% cover-crop sequences with zero harvestable crop
                if crop.group == "cover" and sum(1 for c in seq if CROPS[c].group == "cover") >= (num_seasons // 2):
                    continue

                sim = simulate_season(
                    crop=crop,
                    months_slice=m_slice,
                    soil=soil,
                    som_pct=som,
                    avail_n_kg_ha=avail_n,
                    soil_water_frac=sw_frac,
                    residue_cover=residue,
                    family_history=fam_hist,
                    annual_heat_days=heat_days,
                )
                sub = sim["subscores"]
                step_score = (
                    w_soil * sub["soil"]
                    + w_water * sub["water"]
                    + w_clim * sub["climate"]
                    + w_prof * sub["profit_food"]
                    - sim["pest_risk_pct"] * 0.25
                )
                # Novelty bonus during search to encourage multi-family diversity
                if crop.family not in fam_hist:
                    step_score += 4.0
                if crop.id not in seq:
                    step_score += 1.5
                if w_prof >= 0.45 and crop.group == "cover":
                    step_score -= 6.0

                next_beam.append(
                    (
                        cum_score + step_score,
                        seq + [crop.id],
                        sim["som_end_pct"],
                        sim["n_balance_end_kg_ha"],
                        sim["final_water_frac"],
                        sim["residue_cover_out"],
                        fam_hist + [crop.family],
                    )
                )

        next_beam.sort(key=lambda item: item[0], reverse=True)
        beam = next_beam[:beam_width]

    # Re-score beam candidates cleanly with exact evaluate_sequence and pick diverse top_k
    evaluated = [
        evaluate_sequence(item[1], stressed_climate, soil, priorities)
        for item in beam
    ]
    evaluated.sort(key=lambda r: r["composite_score"], reverse=True)

    selected: List[Dict[str, Any]] = []
    for cand in evaluated:
        if not selected:
            cand["rank"] = 1
            cand["strategy_tag"] = _classify_strategy(cand["crop_ids"])
            selected.append(cand)
        else:
            # Ensure structural diversity from already-selected strategies
            too_similar = any(
                sum(1 for a, b in zip(cand["crop_ids"], s["crop_ids"]) if a == b) >= len(cand["crop_ids"]) - 2
                for s in selected
            )
            if not too_similar:
                cand["rank"] = len(selected) + 1
                cand["strategy_tag"] = _classify_strategy(cand["crop_ids"])
                selected.append(cand)
        if len(selected) >= top_k:
            break

    # If still fewer than top_k, fill from top evaluated
    for cand in evaluated:
        if len(selected) >= top_k:
            break
        if cand not in selected:
            cand["rank"] = len(selected) + 1
            cand["strategy_tag"] = _classify_strategy(cand["crop_ids"])
            selected.append(cand)

    # Monoculture baseline comparison
    baseline_seq = _baseline_monoculture_sequence(
        stressed_climate, num_seasons=num_seasons, current_crop_id=current_crop_id
    )
    baseline = evaluate_sequence(baseline_seq, stressed_climate, soil, priorities)
    baseline["strategy_tag"] = (
        f"Current Crop ({CROPS[current_crop_id].name_en})"
        if current_crop_id and current_crop_id in CROPS
        else "Conventional Cereal Baseline"
    )

    for strat in selected:
        m = strat["metrics"]
        bm = baseline["metrics"]
        strat["vs_baseline"] = {
            "som_gain_pct": round(m["som_end_pct"] - bm["som_end_pct"], 2),
            "water_saved_mm": round(bm["total_etc_mm"] - m["total_etc_mm"], 1),
            "irrigation_saved_mm": round(bm["total_irrigation_mm"] - m["total_irrigation_mm"], 1),
            "yield_stability_gain_pct": round(
                m["mean_yield_resilience_pct"] - bm["mean_yield_resilience_pct"], 1
            ),
            "pest_risk_reduction_pct": round(
                bm["mean_pest_risk_pct"] - m["mean_pest_risk_pct"], 1
            ),
            "n_fixed_gain_kg_ha": round(
                m["biological_n_fixed_kg_ha"] - bm["biological_n_fixed_kg_ha"], 1
            ),
        }

    return {
        "scenario": scenario,
        "climate": stressed_climate,
        "soil": {
            "texture": soil.texture,
            "som_pct": soil.som_pct,
            "ph": soil.ph,
            "initial_n_kg_ha": soil.initial_n_kg_ha,
            "slope_pct": soil.slope_pct,
            "irrigation_mode": soil.irrigation_mode,
            "effective_awc_mm_m": round(soil.effective_awc_mm_per_m(), 1),
        },
        "strategies": selected,
        "baseline": baseline,
    }


def _classify_strategy(crop_ids: List[str]) -> str:
    groups = [CROPS[c].group for c in crop_ids]
    if groups.count("cover") >= 2:
        return "Regenerative Cover & Soil-Builder"
    if any(c in ("sorghum", "pearl_millet", "chickpea", "barley") for c in crop_ids):
        return "Drought-Shield Resilient Mix"
    if "legume" in groups and "oilseed" in groups:
        return "Multi-Family Bio-Diverse Rotation"
    if "legume" in groups:
        return "Nitrogen-Cycling Balanced Rotation"
    return "Adaptive Diversified Strategy"


SCENARIO_CATALOG = [
    {
        "id": "baseline",
        "label_en": "Observed NASA Baseline",
        "label_es": "Línea Base NASA Observada",
        "desc_es": "Condiciones climáticas recientes 2016–2025 observadas por NASA POWER.",
        "desc_en": "Observed 2016–2025 NASA POWER agroclimatology.",
    },
    {
        "id": "warm_dry_15",
        "label_en": "Warm & Dry (+1.5°C / -15% Rain)",
        "label_es": "Calor y Sequía Moderada (+1.5°C / -15% Lluvia)",
        "desc_es": "Incremento térmico moderado y déficit de lluvias en ciclos clave.",
        "desc_en": "Moderate warming with reduced seasonal rainfall.",
    },
    {
        "id": "extreme_25",
        "label_en": "Extreme Drought (+2.5°C / -25% Rain)",
        "label_es": "Choque Extremo de Sequía (+2.5°C / -25% Lluvia)",
        "desc_es": "Olas de calor severas, sequías prolongadas y alta demanda evaporativa.",
        "desc_en": "Severe heatwaves, prolonged dry spells, and high ETo.",
    },
    {
        "id": "wet_extreme_12",
        "label_en": "El Niño Heavy Rain (+1.2°C / +30% Rain)",
        "label_es": "El Niño / Lluvias Torrenciales (+1.2°C / +30% Lluvia)",
        "desc_es": "Exceso hídrico, riesgo de escorrentía, erosión y enfermedades fúngicas.",
        "desc_en": "Intense precipitation increasing runoff, erosion, and fungal risk.",
    },
]


def simulate_all_scenarios(
    climate_profile: Dict[str, Any],
    soil: LocalSoilConfig,
    priorities: FarmerPriorities,
    num_years: int = 3,
    current_crop_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Compare current crop baseline vs. optimized rotation across all 4 future climate scenarios."""
    rows: List[Dict[str, Any]] = []
    for meta in SCENARIO_CATALOG:
        sc_id = meta["id"]
        res = optimize_rotations(
            climate_profile=climate_profile,
            soil=soil,
            priorities=priorities,
            scenario=sc_id,
            num_years=num_years,
            top_k=1,
            current_crop_id=current_crop_id,
        )
        top = res["strategies"][0]
        base = res["baseline"]
        ann = res["climate"]["annual_summary"]
        rows.append(
            {
                "scenario_id": sc_id,
                "label_en": meta["label_en"],
                "label_es": meta["label_es"],
                "desc_es": meta["desc_es"],
                "desc_en": meta["desc_en"],
                "climate_summary": {
                    "mean_temp_c": ann["mean_temp_c"],
                    "total_precip_mm": ann["total_precip_mm"],
                    "total_eto_mm": ann["total_eto_mm"],
                    "aridity_index": ann["aridity_index"],
                    "heat_stress_days_yr": ann["heat_stress_days_yr"],
                    "longest_dry_spell_days": ann["longest_dry_spell_days"],
                    "heavy_rain_days_yr": ann.get("heavy_rain_days_yr", 8),
                },
                "optimal_strategy": {
                    "strategy_tag": top["strategy_tag"],
                    "crop_ids": top["crop_ids"],
                    "seasons": top["seasons"],
                    "composite_score": top["composite_score"],
                    "metrics": top["metrics"],
                    "vs_baseline": top["vs_baseline"],
                },
                "baseline": {
                    "strategy_tag": base["strategy_tag"],
                    "crop_ids": base["crop_ids"],
                    "composite_score": base["composite_score"],
                    "metrics": base["metrics"],
                },
            }
        )
    return {"scenarios": rows}
