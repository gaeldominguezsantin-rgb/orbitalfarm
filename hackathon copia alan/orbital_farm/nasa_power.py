"""Live NASA POWER API client, Data Access Viewer proxy, and agro-climatic analyzer.

Connects to https://power.larc.nasa.gov/api/temporal/{daily|monthly|climatology}/point
to retrieve MERRA-2 and CERES-derived observations, computes FAO-56 ETo,
multi-year climate anomalies & warming trends, extreme-weather indices, and
future climate stress projections, with disk caching and offline fallback.
"""

from __future__ import annotations

import json
import math
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np

from .presets import FARM_PRESETS, FarmPreset
from .soil_water import DAYS_IN_MONTH, MID_MONTH_DOY, fao56_eto_daily

NASA_MONTHLY_URL = "https://power.larc.nasa.gov/api/temporal/monthly/point"
NASA_DAILY_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
NASA_CLIMATOLOGY_URL = "https://power.larc.nasa.gov/api/temporal/climatology/point"

AG_PARAMS_MONTHLY = (
    "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M,WS2M,GWETROOT,GWETTOP,GWETPROF,T2MDEW"
)
AG_PARAMS_DAILY = "T2M_MAX,T2M_MIN,PRECTOTCORR,GWETROOT"

CACHE_DIR = Path(__file__).resolve().parent.parent / "data" / "cache"
MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
MONTH_LABELS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def _clean_val(val: Any) -> Optional[float]:
    try:
        f = float(val)
    except (TypeError, ValueError):
        return None
    if math.isnan(f) or f <= -900.0:
        return None
    return f


def _fetch_text(url: str, timeout_s: float = 20.0) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "OrbitalFarm-NASASpaceApps/1.1 (+https://power.larc.nasa.gov/)",
            "Accept": "application/json, text/csv, */*",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        return resp.read().decode("utf-8")


def _fetch_json(url: str, timeout_s: float = 20.0) -> Dict[str, Any]:
    return json.loads(_fetch_text(url, timeout_s=timeout_s))


def parse_monthly_nasa_power(
    payload: Dict[str, Any],
    latitude: float,
    longitude: float,
) -> Dict[str, Any]:
    """Parse a NASA POWER monthly JSON payload into 12-month normals and annual anomalies."""
    props = payload.get("properties", {}).get("parameter", {})
    geom_coords = payload.get("geometry", {}).get("coordinates", [longitude, latitude, 200.0])
    elevation_m = (
        float(geom_coords[2])
        if len(geom_coords) >= 3 and _clean_val(geom_coords[2]) is not None
        else 200.0
    )

    param_names = [
        "T2M",
        "T2M_MAX",
        "T2M_MIN",
        "PRECTOTCORR",
        "ALLSKY_SFC_SW_DWN",
        "RH2M",
        "WS2M",
        "GWETROOT",
        "GWETTOP",
        "GWETPROF",
        "T2MDEW",
    ]

    monthly_buckets: Dict[str, List[List[float]]] = {
        p: [[] for _ in range(12)] for p in param_names
    }
    yearly_t2m: Dict[int, List[float]] = {}
    yearly_precip: Dict[int, float] = {}

    sample_keys = sorted((props.get("T2M") or {}).keys())
    for ym in sample_keys:
        if len(ym) != 6 or not ym.isdigit():
            continue
        year = int(ym[:4])
        month = int(ym[4:])
        if month < 1 or month > 12:
            continue
        m_idx = month - 1
        for p in param_names:
            val = _clean_val((props.get(p) or {}).get(ym))
            if val is not None:
                monthly_buckets[p][m_idx].append(val)
                if p == "T2M":
                    yearly_t2m.setdefault(year, []).append(val)
                elif p == "PRECTOTCORR":
                    yearly_precip[year] = yearly_precip.get(year, 0.0) + val * DAYS_IN_MONTH[m_idx]

    def _avg_12(param: str, default: float) -> List[float]:
        out: List[float] = []
        for idx in range(12):
            vals = monthly_buckets[param][idx]
            out.append(round(float(np.mean(vals)), 3) if vals else default)
        return out

    t2m = _avg_12("T2M", 18.0)
    t2m_max = _avg_12("T2M_MAX", 24.0)
    t2m_min = _avg_12("T2M_MIN", 12.0)
    prec_mm_day = _avg_12("PRECTOTCORR", 1.5)
    sw_dwn = _avg_12("ALLSKY_SFC_SW_DWN", 18.0)
    rh2m = _avg_12("RH2M", 60.0)
    ws2m = _avg_12("WS2M", 2.2)
    gwetroot = _avg_12("GWETROOT", 0.5)
    gwettop = _avg_12("GWETTOP", 0.45)
    gwetprof = _avg_12("GWETPROF", 0.52)
    t2mdew = _avg_12("T2MDEW", 9.0)

    years_sorted = sorted(y for y, vals in yearly_t2m.items() if len(vals) >= 10)
    annual_series: List[Dict[str, Any]] = []
    for y in years_sorted:
        annual_series.append(
            {
                "year": y,
                "mean_t2m_c": round(float(np.mean(yearly_t2m[y])), 2),
                "total_precip_mm": round(float(yearly_precip.get(y, 0.0)), 1),
            }
        )

    if annual_series:
        baseline_t = float(np.mean([r["mean_t2m_c"] for r in annual_series]))
        baseline_p = max(1.0, float(np.mean([r["total_precip_mm"] for r in annual_series])))
        for row in annual_series:
            row["temp_anomaly_c"] = round(row["mean_t2m_c"] - baseline_t, 2)
            row["precip_anomaly_pct"] = round(((row["total_precip_mm"] - baseline_p) / baseline_p) * 100.0, 1)

    warming_trend_c_decade = 0.0
    if len(years_sorted) >= 3:
        x = np.array([row["year"] for row in annual_series], dtype=float)
        y_vals = np.array([row["mean_t2m_c"] for row in annual_series], dtype=float)
        slope, _ = np.polyfit(x, y_vals, 1)
        warming_trend_c_decade = round(float(slope * 10.0), 2)

    return {
        "elevation_m": round(elevation_m, 1),
        "t2m": t2m,
        "t2m_max": t2m_max,
        "t2m_min": t2m_min,
        "prectotcorr_mm_day": prec_mm_day,
        "sw_dwn_mj_m2_day": sw_dwn,
        "rh2m": rh2m,
        "ws2m": ws2m,
        "gwetroot": gwetroot,
        "gwettop": gwettop,
        "gwetprof": gwetprof,
        "t2mdew": t2mdew,
        "annual_series": annual_series,
        "warming_trend_c_decade": warming_trend_c_decade,
        "header": payload.get("header", {}),
    }


def parse_daily_extremes(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Compute agro-climatic extreme-weather indices from NASA POWER daily series."""
    props = payload.get("properties", {}).get("parameter", {})
    tmax_map = props.get("T2M_MAX") or {}
    tmin_map = props.get("T2M_MIN") or {}
    prec_map = props.get("PRECTOTCORR") or {}

    dates = sorted(d for d in tmax_map.keys() if len(d) == 8 and d.isdigit())
    if not dates:
        return {
            "heat_stress_days_yr": 15,
            "frost_days_yr": 10,
            "longest_dry_spell_days": 25,
            "heavy_rain_days_yr": 8,
            "daily_records": 0,
        }

    years = max(1.0, len(dates) / 365.25)
    heat_days = 0
    frost_days = 0
    heavy_rain_days = 0
    longest_dry = 0
    current_dry = 0

    for d in dates:
        tx = _clean_val(tmax_map.get(d))
        tn = _clean_val(tmin_map.get(d))
        pr = _clean_val(prec_map.get(d))
        if tx is not None and tx >= 35.0:
            heat_days += 1
        if tn is not None and tn <= 2.0:
            frost_days += 1
        if pr is not None:
            if pr >= 25.0:
                heavy_rain_days += 1
            if pr < 1.0:
                current_dry += 1
                if current_dry > longest_dry:
                    longest_dry = current_dry
            else:
                current_dry = 0

    return {
        "heat_stress_days_yr": int(round(heat_days / years)),
        "frost_days_yr": int(round(frost_days / years)),
        "longest_dry_spell_days": int(longest_dry),
        "heavy_rain_days_yr": int(round(heavy_rain_days / years)),
        "daily_records": len(dates),
    }


def _enrich_climate_profile(
    raw: Dict[str, Any],
    extremes: Dict[str, Any],
    latitude: float,
    longitude: float,
    source_status: str,
    location_label: str,
) -> Dict[str, Any]:
    """Attach FAO-56 monthly ETo, total rainfall, and water balance indices."""
    elev = float(raw.get("elevation_m", 200.0))
    months_detail: List[Dict[str, Any]] = []
    total_precip_yr = 0.0
    total_eto_yr = 0.0
    gwetprof_arr = raw.get("gwetprof") or raw["gwetroot"]
    t2mdew_arr = raw.get("t2mdew") or [t - 7.0 for t in raw["t2m"]]

    for idx in range(12):
        days = DAYS_IN_MONTH[idx]
        doy = MID_MONTH_DOY[idx]
        eto_day = fao56_eto_daily(
            t_max_c=raw["t2m_max"][idx],
            t_min_c=raw["t2m_min"][idx],
            rh_pct=raw["rh2m"][idx],
            wind_2m_ms=raw["ws2m"][idx],
            rs_mj_m2_day=raw["sw_dwn_mj_m2_day"][idx],
            latitude_deg=latitude,
            day_of_year=doy,
            elevation_m=elev,
        )
        precip_month = raw["prectotcorr_mm_day"][idx] * days
        eto_month = eto_day * days
        total_precip_yr += precip_month
        total_eto_yr += eto_month

        months_detail.append(
            {
                "month": idx + 1,
                "label": MONTH_LABELS_EN[idx],
                "label_es": MONTH_LABELS[idx],
                "days": days,
                "t2m": round(raw["t2m"][idx], 2),
                "t2m_max": round(raw["t2m_max"][idx], 2),
                "t2m_min": round(raw["t2m_min"][idx], 2),
                "t2mdew": round(t2mdew_arr[idx], 2),
                "precip_mm_day": round(raw["prectotcorr_mm_day"][idx], 3),
                "precip_mm": round(precip_month, 1),
                "eto_mm_day": round(eto_day, 2),
                "eto_mm": round(eto_month, 1),
                "sw_dwn_mj_m2_day": round(raw["sw_dwn_mj_m2_day"][idx], 2),
                "rh2m": round(raw["rh2m"][idx], 1),
                "ws2m": round(raw["ws2m"][idx], 2),
                "gwetroot": round(raw["gwetroot"][idx], 3),
                "gwettop": round(raw["gwettop"][idx], 3),
                "gwetprof": round(gwetprof_arr[idx], 3),
                "climatic_balance_mm": round(precip_month - eto_month, 1),
            }
        )

    aridity_index = total_precip_yr / max(1.0, total_eto_yr)
    return {
        "latitude": round(float(latitude), 4),
        "longitude": round(float(longitude), 4),
        "elevation_m": round(elev, 1),
        "hemisphere": "N" if latitude >= 0 else "S",
        "location_label": location_label,
        "source_status": source_status,
        "data_sources": ["NASA POWER v2.10 (AG)", "MERRA-2 Reanalysis", "CERES SYN1deg"],
        "annual_summary": {
            "mean_temp_c": round(float(np.mean(raw["t2m"])), 2),
            "total_precip_mm": round(total_precip_yr, 1),
            "total_eto_mm": round(total_eto_yr, 1),
            "aridity_index": round(aridity_index, 3),
            "mean_gwetroot": round(float(np.mean(raw["gwetroot"])), 3),
            "mean_gwettop": round(float(np.mean(raw["gwettop"])), 3),
            "mean_gwetprof": round(float(np.mean(gwetprof_arr)), 3),
            "warming_trend_c_decade": raw.get("warming_trend_c_decade", 0.3),
            **extremes,
        },
        "months": months_detail,
        "annual_series": raw.get("annual_series", []),
    }


def _preset_to_climate_profile(preset: FarmPreset, source_status: str) -> Dict[str, Any]:
    annual_series = []
    base_temp = float(np.mean(preset.t2m))
    base_precip = sum(p * d for p, d in zip(preset.prectotcorr_mm_day, DAYS_IN_MONTH))
    for y in range(2016, 2026):
        mt = round(
            base_temp + (y - 2020) * (preset.warming_trend_c_decade / 10.0) + (0.22 if y % 3 == 0 else -0.11),
            2,
        )
        pr_mult = 0.86 if y in (2022, 2024) else (1.09 if y == 2021 else 1.0)
        tp = round(base_precip * pr_mult, 1)
        annual_series.append(
            {
                "year": y,
                "mean_t2m_c": mt,
                "total_precip_mm": tp,
                "temp_anomaly_c": round(mt - base_temp, 2),
                "precip_anomaly_pct": round((pr_mult - 1.0) * 100.0, 1),
            }
        )

    raw = {
        "elevation_m": preset.elevation_m,
        "t2m": list(preset.t2m),
        "t2m_max": list(preset.t2m_max),
        "t2m_min": list(preset.t2m_min),
        "prectotcorr_mm_day": list(preset.prectotcorr_mm_day),
        "sw_dwn_mj_m2_day": list(preset.sw_dwn_mj_m2_day),
        "rh2m": list(preset.rh2m),
        "ws2m": list(preset.ws2m),
        "gwetroot": list(preset.gwetroot),
        "gwettop": list(preset.gwettop),
        "gwetprof": list(preset.gwetprof),
        "t2mdew": [round(t - (100.0 - rh) * 0.16, 2) for t, rh in zip(preset.t2m, preset.rh2m)],
        "warming_trend_c_decade": preset.warming_trend_c_decade,
        "annual_series": annual_series,
    }
    extremes = {
        "heat_stress_days_yr": preset.heat_stress_days_yr,
        "frost_days_yr": preset.frost_days_yr,
        "longest_dry_spell_days": preset.longest_dry_spell_days,
        "heavy_rain_days_yr": preset.heavy_rain_days_yr,
        "daily_records": 731,
    }
    return _enrich_climate_profile(
        raw,
        extremes,
        preset.latitude,
        preset.longitude,
        source_status=source_status,
        location_label=preset.name_en,
    )


def _nearest_preset(latitude: float, longitude: float) -> FarmPreset:
    best = None
    best_dist = float("inf")
    for p in FARM_PRESETS.values():
        d = (p.latitude - latitude) ** 2 + (p.longitude - longitude) ** 2
        if d < best_dist:
            best_dist = d
            best = p
    assert best is not None
    return best


def fetch_climate_profile(
    latitude: float,
    longitude: float,
    preset_id: Optional[str] = None,
    prefer_live: bool = True,
    location_label: Optional[str] = None,
) -> Dict[str, Any]:
    """Fetch NASA POWER agro-climatic data for (latitude, longitude), with cache & fallback."""
    lat = max(-65.0, min(65.0, float(latitude)))
    lon = max(-180.0, min(180.0, float(longitude)))

    if preset_id and preset_id in FARM_PRESETS:
        preset = FARM_PRESETS[preset_id]
        lat, lon = preset.latitude, preset.longitude
        label = location_label or preset.name_en
    else:
        preset = _nearest_preset(lat, lon)
        label = location_label or f"Campo ({lat:.2f}°, {lon:.2f}°)"

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_key = f"power_v2_{lat:.2f}_{lon:.2f}.json"
    cache_path = CACHE_DIR / cache_key

    if cache_path.exists():
        try:
            cached = json.loads(cache_path.read_text(encoding="utf-8"))
            cached["source_status"] = "CACHED_NASA_POWER"
            cached["location_label"] = label
            return cached
        except (OSError, json.JSONDecodeError):
            pass

    if prefer_live:
        monthly_qs = urllib.parse.urlencode(
            {
                "parameters": AG_PARAMS_MONTHLY,
                "community": "AG",
                "longitude": f"{lon:.4f}",
                "latitude": f"{lat:.4f}",
                "start": "2016",
                "end": "2025",
                "format": "JSON",
            }
        )
        daily_qs = urllib.parse.urlencode(
            {
                "parameters": AG_PARAMS_DAILY,
                "community": "AG",
                "longitude": f"{lon:.4f}",
                "latitude": f"{lat:.4f}",
                "start": "20240101",
                "end": "20251231",
                "format": "JSON",
            }
        )
        try:
            monthly_json = _fetch_json(f"{NASA_MONTHLY_URL}?{monthly_qs}", timeout_s=15.0)
            daily_json = _fetch_json(f"{NASA_DAILY_URL}?{daily_qs}", timeout_s=15.0)
            raw = parse_monthly_nasa_power(monthly_json, lat, lon)
            extremes = parse_daily_extremes(daily_json)
            profile = _enrich_climate_profile(
                raw,
                extremes,
                lat,
                lon,
                source_status="LIVE_NASA_POWER",
                location_label=label,
            )
            try:
                cache_path.write_text(json.dumps(profile, indent=2), encoding="utf-8")
            except OSError:
                pass
            return profile
        except (urllib.error.URLError, TimeoutError, ValueError, KeyError):
            pass

    if preset_id and preset_id in FARM_PRESETS:
        return _preset_to_climate_profile(preset, source_status="OFFLINE_PRESET_BASELINE")
    fallback = _preset_to_climate_profile(preset, source_status="OFFLINE_NEAREST_BASELINE")
    fallback["latitude"] = round(lat, 4)
    fallback["longitude"] = round(lon, 4)
    fallback["hemisphere"] = "N" if lat >= 0 else "S"
    fallback["location_label"] = label
    return fallback


def query_nasa_power_viewer(
    latitude: float,
    longitude: float,
    community: str = "AG",
    temporal: str = "monthly",
    parameters: Optional[List[str]] = None,
    start: str = "2023",
    end: str = "2025",
    fmt: str = "JSON",
) -> Dict[str, Any]:
    """Query NASA POWER directly with Data Access Viewer parameters (live or clean fallback)."""
    lat = max(-89.9, min(89.9, float(latitude)))
    lon = max(-180.0, min(180.0, float(longitude)))
    comm = community if community in ("AG", "RE", "SB") else "AG"
    temp = temporal if temporal in ("daily", "monthly", "climatology") else "monthly"
    params_list = parameters or ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "GWETROOT", "ALLSKY_SFC_SW_DWN"]
    params_str = ",".join(p.strip() for p in params_list if p.strip())

    base_url = {
        "daily": NASA_DAILY_URL,
        "monthly": NASA_MONTHLY_URL,
        "climatology": NASA_CLIMATOLOGY_URL,
    }[temp]

    qs_dict: Dict[str, str] = {
        "parameters": params_str,
        "community": comm,
        "longitude": f"{lon:.4f}",
        "latitude": f"{lat:.4f}",
        "format": "CSV" if fmt.upper() == "CSV" else "JSON",
    }
    if temp != "climatology":
        qs_dict["start"] = start
        qs_dict["end"] = end

    url = f"{base_url}?{urllib.parse.urlencode(qs_dict)}"
    try:
        raw_text = _fetch_text(url, timeout_s=18.0)
        if fmt.upper() == "CSV":
            return {"status": "LIVE_NASA_POWER", "api_url": url, "format": "CSV", "csv": raw_text}
        data = json.loads(raw_text)
        return {
            "status": "LIVE_NASA_POWER",
            "api_url": url,
            "format": "JSON",
            "geometry": data.get("geometry"),
            "header": data.get("header"),
            "parameters_meta": data.get("parameters"),
            "parameter_series": data.get("properties", {}).get("parameter", {}),
        }
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        # Offline graceful representation from nearest baseline
        fallback = fetch_climate_profile(lat, lon, prefer_live=False)
        series: Dict[str, Dict[str, float]] = {}
        key_map = {
            "T2M": "t2m",
            "T2M_MAX": "t2m_max",
            "T2M_MIN": "t2m_min",
            "PRECTOTCORR": "precip_mm_day",
            "ALLSKY_SFC_SW_DWN": "sw_dwn_mj_m2_day",
            "RH2M": "rh2m",
            "WS2M": "ws2m",
            "GWETROOT": "gwetroot",
            "GWETTOP": "gwettop",
            "GWETPROF": "gwetprof",
            "T2MDEW": "t2mdew",
        }
        for p in params_list:
            field = key_map.get(p)
            if field:
                series[p] = {
                    f"2025{m['month']:02d}": m[field] for m in fallback["months"]
                }
        return {
            "status": "OFFLINE_FALLBACK",
            "warning": str(exc),
            "api_url": url,
            "format": "JSON",
            "geometry": {"type": "Point", "coordinates": [lon, lat, fallback["elevation_m"]]},
            "header": {"title": "Orbital Farm Offline NASA POWER Baseline"},
            "parameters_meta": {p: {"units": "standard", "longname": p} for p in series},
            "parameter_series": series,
        }


def apply_climate_stress_scenario(
    climate_profile: Dict[str, Any],
    scenario: str = "baseline",
) -> Dict[str, Any]:
    """Return a scenario-adjusted copy of a NASA POWER climate profile.

    Scenarios:
    - baseline: Observed NASA POWER climatology
    - warm_dry_15: +1.5 C warming, -15% precipitation
    - extreme_25: +2.5 C warming, -25% precipitation, prolonged drought
    - wet_extreme_12: +1.2 C warming, +30% heavy rainfall (El Nino / runoff & fungal risk)
    """
    if scenario == "baseline":
        out = json.loads(json.dumps(climate_profile))
        out["scenario"] = "baseline"
        return out

    if scenario == "warm_dry_15":
        dt, p_mult, gwet_mult, hs_mult, heavy_mult = 1.5, 0.85, 0.88, 1.35, 1.05
    elif scenario == "extreme_25":
        dt, p_mult, gwet_mult, hs_mult, heavy_mult = 2.5, 0.75, 0.78, 1.75, 1.15
    elif scenario == "wet_extreme_12":
        dt, p_mult, gwet_mult, hs_mult, heavy_mult = 1.2, 1.30, 1.16, 1.15, 1.85
    else:
        raise ValueError(f"Unknown climate scenario: {scenario}")

    elev = float(climate_profile.get("elevation_m", 200.0))
    lat = float(climate_profile["latitude"])
    stressed_months: List[Dict[str, Any]] = []
    tot_p = 0.0
    tot_eto = 0.0

    for idx, m in enumerate(climate_profile["months"]):
        tx = m["t2m_max"] + dt
        tn = m["t2m_min"] + dt * 0.85
        tm = 0.5 * (tx + tn)
        rh_shift = 4.5 if scenario == "wet_extreme_12" else -dt * 2.2
        rh = max(18.0, min(95.0, m["rh2m"] + rh_shift))
        pr_day = max(0.0, m["precip_mm_day"] * p_mult)
        pr_mo = pr_day * m["days"]
        eto_day = fao56_eto_daily(
            t_max_c=tx,
            t_min_c=tn,
            rh_pct=rh,
            wind_2m_ms=m["ws2m"] * 1.05,
            rs_mj_m2_day=m["sw_dwn_mj_m2_day"] * (0.94 if scenario == "wet_extreme_12" else 1.03),
            latitude_deg=lat,
            day_of_year=MID_MONTH_DOY[idx],
            elevation_m=elev,
        )
        eto_mo = eto_day * m["days"]
        tot_p += pr_mo
        tot_eto += eto_mo
        stressed_months.append(
            {
                **m,
                "t2m": round(tm, 2),
                "t2m_max": round(tx, 2),
                "t2m_min": round(tn, 2),
                "rh2m": round(rh, 1),
                "precip_mm_day": round(pr_day, 3),
                "precip_mm": round(pr_mo, 1),
                "eto_mm_day": round(eto_day, 2),
                "eto_mm": round(eto_mo, 1),
                "gwetroot": round(max(0.08, min(0.95, m["gwetroot"] * gwet_mult)), 3),
                "gwettop": round(max(0.06, min(0.95, m["gwettop"] * gwet_mult)), 3),
                "gwetprof": round(max(0.10, min(0.96, m.get("gwetprof", m["gwetroot"]) * gwet_mult)), 3),
                "climatic_balance_mm": round(pr_mo - eto_mo, 1),
            }
        )

    summary = dict(climate_profile["annual_summary"])
    summary["mean_temp_c"] = round(summary["mean_temp_c"] + dt * 0.92, 2)
    summary["total_precip_mm"] = round(tot_p, 1)
    summary["total_eto_mm"] = round(tot_eto, 1)
    summary["aridity_index"] = round(tot_p / max(1.0, tot_eto), 3)
    summary["heat_stress_days_yr"] = int(round(summary["heat_stress_days_yr"] * hs_mult + dt * 5))
    summary["heavy_rain_days_yr"] = int(round(summary.get("heavy_rain_days_yr", 8) * heavy_mult))
    summary["longest_dry_spell_days"] = int(
        round(
            summary["longest_dry_spell_days"]
            * (1.22 if scenario == "warm_dry_15" else 1.45 if scenario == "extreme_25" else 0.85)
        )
    )

    out = dict(climate_profile)
    out["scenario"] = scenario
    out["months"] = stressed_months
    out["annual_summary"] = summary
    return out
