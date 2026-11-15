"""FAO-56 Penman-Monteith evapotranspiration and local soil hydrology models.

References:
- Allen, R.G., Pereira, L.S., Raes, D., Smith, M. (1998). Crop evapotranspiration:
  Guidelines for computing crop water requirements. FAO Irrigation and Drainage Paper 56.
- Saxton, K.E., Rawls, W.J. (2006). Soil water characteristic estimates by texture
  and organic matter for hydrologic solutions. Soil Sci. Soc. Am. J. 70:1569-1578.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Dict

STEFAN_BOLTZMANN = 4.903e-9  # MJ K^-4 m^-2 day^-1
MID_MONTH_DOY = (15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349)
DAYS_IN_MONTH = (31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)


@dataclass(frozen=True)
class SoilTextureProfile:
    """Hydraulic and physical properties of a soil textural class."""

    code: str
    label_en: str
    label_es: str
    theta_fc: float       # Field capacity (m3/m3)
    theta_pwp: float      # Permanent wilting point (m3/m3)
    theta_sat: float      # Saturation porosity (m3/m3)
    base_awc_mm_m: float  # Base available water capacity (mm/m)
    infiltration_rate: float  # Relative infiltration efficiency (0-1)
    erodibility: float    # Relative erosion vulnerability (0-1)
    n_retention: float    # Nitrate retention capacity vs leaching (0-1)


SOIL_TEXTURES: Dict[str, SoilTextureProfile] = {
    "loamy_sand": SoilTextureProfile(
        code="loamy_sand",
        label_en="Loamy Sand (Light / Fast-draining)",
        label_es="Franco Arenoso Ligero (Drenaje rápido)",
        theta_fc=0.16,
        theta_pwp=0.07,
        theta_sat=0.41,
        base_awc_mm_m=90.0,
        infiltration_rate=0.94,
        erodibility=0.52,
        n_retention=0.48,
    ),
    "sandy_loam": SoilTextureProfile(
        code="sandy_loam",
        label_en="Sandy Loam (Balanced-Light)",
        label_es="Franco Arenoso (Equilibrado ligero)",
        theta_fc=0.22,
        theta_pwp=0.10,
        theta_sat=0.44,
        base_awc_mm_m=120.0,
        infiltration_rate=0.88,
        erodibility=0.45,
        n_retention=0.64,
    ),
    "loam": SoilTextureProfile(
        code="loam",
        label_en="Loam (Ideal Agricultural)",
        label_es="Franco (Agrícola ideal)",
        theta_fc=0.28,
        theta_pwp=0.13,
        theta_sat=0.46,
        base_awc_mm_m=150.0,
        infiltration_rate=0.82,
        erodibility=0.40,
        n_retention=0.78,
    ),
    "clay_loam": SoilTextureProfile(
        code="clay_loam",
        label_en="Clay Loam (High Water Holding)",
        label_es="Franco Arcilloso (Alta retención)",
        theta_fc=0.34,
        theta_pwp=0.18,
        theta_sat=0.48,
        base_awc_mm_m=160.0,
        infiltration_rate=0.68,
        erodibility=0.36,
        n_retention=0.86,
    ),
    "silty_clay": SoilTextureProfile(
        code="silty_clay",
        label_en="Silty Clay (Heavy / Runoff Prone)",
        label_es="Arcillo Limoso (Pesado / propenso a escorrentía)",
        theta_fc=0.38,
        theta_pwp=0.23,
        theta_sat=0.50,
        base_awc_mm_m=150.0,
        infiltration_rate=0.55,
        erodibility=0.58,
        n_retention=0.88,
    ),
}


@dataclass
class LocalSoilConfig:
    """Farmer-provided local soil and field management parameters."""

    texture: str = "loam"
    som_pct: float = 2.2          # Soil organic matter (%)
    ph: float = 6.6               # Soil pH
    initial_n_kg_ha: float = 48.0 # Available mineral N (kg/ha)
    slope_pct: float = 3.0        # Field slope (%)
    irrigation_mode: str = "rainfed"  # rainfed | deficit | full

    def profile(self) -> SoilTextureProfile:
        return SOIL_TEXTURES.get(self.texture, SOIL_TEXTURES["loam"])

    def effective_awc_mm_per_m(self) -> float:
        """Compute Available Water Capacity (mm/m) adjusted by Soil Organic Matter.

        Conservative empirical adjustment (~12 mm/m per 1% SOM change relative to 2.0%),
        bounded to physically plausible bounds.
        """
        prof = self.profile()
        som_delta = max(-1.5, min(4.0, self.som_pct - 2.0))
        return max(65.0, min(230.0, prof.base_awc_mm_m + som_delta * 12.0))

    def ph_suitability(self, ph_min: float, ph_max: float) -> float:
        """Return 0.35-1.0 suitability score for crop pH tolerance."""
        if ph_min <= self.ph <= ph_max:
            return 1.0
        dist = min(abs(self.ph - ph_min), abs(self.ph - ph_max))
        return max(0.35, 1.0 - 0.28 * dist)


def fao56_eto_daily(
    t_max_c: float,
    t_min_c: float,
    rh_pct: float,
    wind_2m_ms: float,
    rs_mj_m2_day: float,
    latitude_deg: float,
    day_of_year: int,
    elevation_m: float = 200.0,
) -> float:
    """Compute FAO-56 Penman-Monteith reference evapotranspiration ETo (mm/day)."""
    t_max = max(-30.0, min(55.0, float(t_max_c)))
    t_min = max(-40.0, min(t_max, float(t_min_c)))
    t_mean = 0.5 * (t_max + t_min)
    rh = max(5.0, min(100.0, float(rh_pct)))
    u2 = max(0.2, min(15.0, float(wind_2m_ms)))
    rs = max(0.5, min(40.0, float(rs_mj_m2_day)))
    elev = max(-50.0, min(5000.0, float(elevation_m)))

    # Atmospheric pressure (kPa) and psychrometric constant (kPa/C)
    pressure_kpa = 101.3 * (((293.0 - 0.0065 * elev) / 293.0) ** 5.26)
    gamma = 0.000665 * pressure_kpa

    # Saturation & actual vapor pressure (kPa)
    es_tmax = 0.6108 * math.exp((17.27 * t_max) / (t_max + 237.3))
    es_tmin = 0.6108 * math.exp((17.27 * t_min) / (t_min + 237.3))
    es = 0.5 * (es_tmax + es_tmin)
    ea = min(es, es * (rh / 100.0))

    # Slope of saturation vapor pressure curve (kPa/C)
    es_tmean = 0.6108 * math.exp((17.27 * t_mean) / (t_mean + 237.3))
    delta = (4098.0 * es_tmean) / ((t_mean + 237.3) ** 2)

    # Extraterrestrial radiation Ra (MJ/m2/day)
    lat_rad = math.radians(max(-66.0, min(66.0, float(latitude_deg))))
    dr = 1.0 + 0.033 * math.cos((2.0 * math.pi / 365.0) * day_of_year)
    declination = 0.409 * math.sin((2.0 * math.pi / 365.0) * day_of_year - 1.39)
    tan_prod = -math.tan(lat_rad) * math.tan(declination)
    tan_prod = max(-0.999, min(0.999, tan_prod))
    ws = math.acos(tan_prod)
    ra = (
        (24.0 * 60.0 / math.pi)
        * 0.0820
        * dr
        * (
            ws * math.sin(lat_rad) * math.sin(declination)
            + math.cos(lat_rad) * math.cos(declination) * math.sin(ws)
        )
    )
    ra = max(1.0, ra)

    # Clear-sky radiation Rso and net radiation Rn
    rso = max(1.0, (0.75 + 2e-5 * elev) * ra)
    rns = 0.77 * rs
    rel_rad = max(0.25, min(1.0, rs / rso))
    tmax_k4 = (t_max + 273.16) ** 4
    tmin_k4 = (t_min + 273.16) ** 4
    rnl = (
        STEFAN_BOLTZMANN
        * (0.5 * (tmax_k4 + tmin_k4))
        * (0.34 - 0.14 * math.sqrt(max(0.0, ea)))
        * (1.35 * rel_rad - 0.35)
    )
    rn = rns - rnl

    numerator = 0.408 * delta * rn + gamma * (900.0 / (t_mean + 273.0)) * u2 * (es - ea)
    denominator = delta + gamma * (1.0 + 0.34 * u2)
    return max(0.1, numerator / denominator)


def effective_rainfall_mm(
    precip_mm: float,
    soil: LocalSoilConfig,
    residue_cover_bonus: float = 0.0,
) -> float:
    """Estimate effective infiltrated rainfall (mm) accounting for texture, slope, and SOM."""
    if precip_mm <= 0.0:
        return 0.0
    prof = soil.profile()
    slope_penalty = max(0.65, 1.0 - 0.018 * max(0.0, soil.slope_pct))
    som_bonus = min(0.12, max(-0.06, (soil.som_pct - 2.0) * 0.03))
    infiltration_factor = min(
        0.96,
        max(0.45, prof.infiltration_rate * slope_penalty + som_bonus + residue_cover_bonus),
    )
    # High-intensity monthly totals incur diminishing infiltration returns
    if precip_mm > 140.0:
        excess = precip_mm - 140.0
        return 140.0 * infiltration_factor + excess * infiltration_factor * 0.65
    return precip_mm * infiltration_factor


def simulate_local_soil_profile(
    months: list,
    soil: LocalSoilConfig,
) -> list:
    """Compute monthly local soil moisture (%) and water deficit (mm) driven by user soil config."""
    awc_mm = soil.effective_awc_mm_per_m()  # 1m reference root profile
    raw_mm = 0.55 * awc_mm
    sw_mm = awc_mm * float(months[0].get("gwetroot", 0.5))
    profile_out = []

    for m in months:
        peff = effective_rainfall_mm(float(m["precip_mm"]), soil)
        eto_m = float(m["eto_mm"])
        avail = sw_mm + peff
        deficit_to_raw = max(0.0, raw_mm - (avail - eto_m))
        irrig = 0.0
        if soil.irrigation_mode == "deficit":
            irrig = 0.55 * deficit_to_raw
        elif soil.irrigation_mode == "full":
            irrig = 0.95 * deficit_to_raw

        end_sw = min(awc_mm, max(0.0, avail + irrig - eto_m))
        moisture_pct = round((end_sw / max(1.0, awc_mm)) * 100.0, 1)
        water_deficit_mm = round(max(0.0, eto_m - (peff + irrig + sw_mm * 0.35)), 1)
        sw_mm = end_sw

        profile_out.append(
            {
                "month": m["month"],
                "effective_rain_mm": round(peff, 1),
                "irrigation_mm": round(irrig, 1),
                "local_moisture_pct": moisture_pct,
                "local_available_mm": round(end_sw, 1),
                "water_deficit_mm": water_deficit_mm,
            }
        )
    return profile_out
