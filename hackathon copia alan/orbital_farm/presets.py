"""Curated global agricultural presets and offline-resilient NASA POWER telemetry baselines.

Each preset represents a real agricultural region facing distinct climate, water,
and soil degradation pressures. When online, the app fetches live multi-year
NASA POWER observations; if offline or rate-limited, these physically coherent
monthly climatology & extreme-weather baselines ensure uninterrupted operation.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Dict, List


@dataclass(frozen=True)
class FarmPreset:
    id: str
    name_en: str
    name_es: str
    region_en: str
    region_es: str
    latitude: float
    longitude: float
    elevation_m: float
    hemisphere: str  # "N" or "S"
    default_soil: Dict[str, object]
    challenge_summary_en: str
    challenge_summary_es: str
    # 12-month representative NASA POWER baseline arrays (Jan..Dec)
    t2m: List[float]
    t2m_max: List[float]
    t2m_min: List[float]
    prectotcorr_mm_day: List[float]
    sw_dwn_mj_m2_day: List[float]
    rh2m: List[float]
    ws2m: List[float]
    gwetroot: List[float]
    gwettop: List[float]
    gwetprof: List[float]
    warming_trend_c_decade: float
    heat_stress_days_yr: int
    frost_days_yr: int
    longest_dry_spell_days: int
    heavy_rain_days_yr: int


FARM_PRESETS: Dict[str, FarmPreset] = {
    "bajio_mx": FarmPreset(
        id="bajio_mx",
        name_en="Bajío Highlands (Guanajuato, Mexico)",
        name_es="Altiplano del Bajío (Guanajuato, México)",
        region_en="Semi-arid subtropical highland — aquifer stress & erratic monsoon",
        region_es="Altiplano semiárido — estrés hídrico y monzón errático",
        latitude=20.60,
        longitude=-101.20,
        elevation_m=1864.0,
        hemisphere="N",
        default_soil={
            "texture": "clay_loam",
            "som_pct": 1.8,
            "ph": 7.3,
            "initial_n_kg_ha": 42.0,
            "slope_pct": 2.5,
            "irrigation_mode": "deficit",
        },
        challenge_summary_en=(
            "Groundwater overdraft, delayed June rains, and winter frost pockets "
            "require drought-buffered rotations with N-fixing pulses."
        ),
        challenge_summary_es=(
            "Sobreexplotación de acuíferos, retraso de lluvias en junio y heladas "
            "invernales exigen rotaciones resilientes con leguminosas."
        ),
        t2m=[14.3, 16.4, 18.9, 22.0, 23.3, 21.9, 19.7, 19.3, 18.6, 17.7, 15.7, 14.7],
        t2m_max=[22.4, 24.8, 27.6, 30.2, 31.4, 28.9, 25.8, 25.5, 24.8, 24.5, 23.2, 22.2],
        t2m_min=[6.4, 8.1, 10.3, 13.4, 15.1, 15.5, 14.2, 13.8, 13.1, 11.1, 8.3, 6.9],
        prectotcorr_mm_day=[0.42, 0.31, 0.28, 0.45, 1.35, 4.10, 5.25, 4.65, 3.85, 1.32, 0.44, 0.35],
        sw_dwn_mj_m2_day=[17.2, 20.1, 23.4, 24.8, 24.5, 21.8, 20.4, 20.5, 19.1, 18.9, 17.8, 16.5],
        rh2m=[51.0, 44.0, 38.0, 37.0, 44.0, 62.0, 72.0, 73.0, 74.0, 64.0, 56.0, 54.0],
        ws2m=[2.1, 2.4, 2.7, 2.6, 2.5, 2.4, 2.1, 2.0, 2.0, 2.1, 2.0, 2.0],
        gwetroot=[0.44, 0.39, 0.34, 0.31, 0.35, 0.56, 0.72, 0.75, 0.74, 0.62, 0.51, 0.46],
        gwettop=[0.33, 0.27, 0.22, 0.21, 0.29, 0.58, 0.74, 0.76, 0.73, 0.54, 0.40, 0.35],
        gwetprof=[0.50, 0.47, 0.43, 0.40, 0.41, 0.55, 0.69, 0.73, 0.73, 0.66, 0.57, 0.52],
        warming_trend_c_decade=0.38,
        heat_stress_days_yr=24,
        frost_days_yr=11,
        longest_dry_spell_days=46,
        heavy_rain_days_yr=8,
    ),
    "iowa_us": FarmPreset(
        id="iowa_us",
        name_en="Central Corn Belt (Iowa, USA)",
        name_es="Cinturón Maicero Central (Iowa, EE. UU.)",
        region_en="Temperate continental — spring waterlogging & summer heat domes",
        region_es="Continental templado — exceso hídrico primaveral y olas de calor",
        latitude=42.03,
        longitude=-93.62,
        elevation_m=290.0,
        hemisphere="N",
        default_soil={
            "texture": "loam",
            "som_pct": 3.4,
            "ph": 6.4,
            "initial_n_kg_ha": 62.0,
            "slope_pct": 2.0,
            "irrigation_mode": "rainfed",
        },
        challenge_summary_en=(
            "Maize-soybean dualism leaves soils bare in winter, accelerating nitrate "
            "leaching and topsoil erosion during intense spring storms."
        ),
        challenge_summary_es=(
            "El bicúltivo maíz-soya deja el suelo desnudo en invierno, aumentando "
            "lixiviación de nitratos y erosión por tormentas primaverales."
        ),
        t2m=[-6.8, -4.1, 2.8, 10.1, 16.5, 21.8, 23.6, 22.3, 18.0, 10.8, 2.9, -4.2],
        t2m_max=[-1.8, 1.0, 8.2, 16.2, 22.3, 27.3, 29.0, 27.8, 24.1, 16.8, 8.0, 0.6],
        t2m_min=[-11.6, -9.1, -2.5, 4.1, 10.6, 16.2, 18.2, 16.9, 12.1, 5.2, -1.9, -8.8],
        prectotcorr_mm_day=[0.85, 1.02, 1.78, 3.05, 3.95, 4.25, 3.45, 3.30, 2.65, 2.05, 1.45, 0.98],
        sw_dwn_mj_m2_day=[6.8, 10.2, 14.5, 18.2, 21.4, 23.5, 23.2, 20.1, 16.2, 11.4, 7.2, 5.7],
        rh2m=[76.0, 75.0, 71.0, 66.0, 68.0, 71.0, 74.0, 76.0, 73.0, 69.0, 73.0, 77.0],
        ws2m=[4.2, 4.1, 4.3, 4.4, 3.8, 3.4, 3.0, 2.9, 3.2, 3.7, 4.1, 4.1],
        gwetroot=[0.68, 0.69, 0.74, 0.78, 0.79, 0.76, 0.69, 0.65, 0.64, 0.66, 0.69, 0.68],
        gwettop=[0.70, 0.72, 0.77, 0.76, 0.74, 0.71, 0.63, 0.61, 0.62, 0.65, 0.70, 0.71],
        gwetprof=[0.69, 0.70, 0.74, 0.78, 0.79, 0.77, 0.72, 0.68, 0.67, 0.68, 0.70, 0.69],
        warming_trend_c_decade=0.31,
        heat_stress_days_yr=14,
        frost_days_yr=124,
        longest_dry_spell_days=19,
        heavy_rain_days_yr=14,
    ),
    "nakuru_ke": FarmPreset(
        id="nakuru_ke",
        name_en="Rift Valley Highlands (Nakuru, Kenya)",
        name_es="Tierras Altas del Rift (Nakuru, Kenia)",
        region_en="Equatorial highland — bimodal rains & smallholder soil fatigue",
        region_es="Altiplano ecuatorial — lluvias bimodales y fatiga del suelo",
        latitude=-0.30,
        longitude=36.08,
        elevation_m=1850.0,
        hemisphere="S",
        default_soil={
            "texture": "sandy_loam",
            "som_pct": 1.9,
            "ph": 5.9,
            "initial_n_kg_ha": 35.0,
            "slope_pct": 4.5,
            "irrigation_mode": "rainfed",
        },
        challenge_summary_en=(
            "Continuous maize cultivation depletes nitrogen and organic matter while "
            "bimodal March-May and Oct-Nov rains become increasingly unpredictable."
        ),
        challenge_summary_es=(
            "El monocultivo continuo de maíz agota el nitrógeno y materia orgánica "
            "mientras las lluvias bimodales se vuelven más impredecibles."
        ),
        t2m=[18.6, 19.3, 19.4, 18.6, 18.0, 17.3, 16.8, 17.0, 17.6, 18.1, 17.8, 18.0],
        t2m_max=[25.8, 26.7, 26.4, 24.6, 23.8, 23.2, 22.5, 22.9, 24.2, 24.7, 23.9, 24.6],
        t2m_min=[11.4, 11.9, 12.6, 13.1, 12.6, 11.7, 11.3, 11.3, 11.2, 11.8, 12.1, 11.6],
        prectotcorr_mm_day=[1.10, 1.35, 2.75, 4.85, 4.15, 2.40, 2.85, 3.20, 2.35, 2.65, 2.90, 1.65],
        sw_dwn_mj_m2_day=[22.4, 23.1, 21.8, 19.2, 18.8, 18.6, 17.9, 18.9, 20.8, 20.6, 19.4, 21.1],
        rh2m=[58.0, 55.0, 62.0, 74.0, 76.0, 74.0, 75.0, 74.0, 69.0, 70.0, 73.0, 65.0],
        ws2m=[2.5, 2.6, 2.5, 2.1, 1.9, 1.9, 1.9, 2.0, 2.1, 2.3, 2.3, 2.4],
        gwetroot=[0.46, 0.43, 0.51, 0.69, 0.74, 0.67, 0.64, 0.66, 0.61, 0.60, 0.64, 0.54],
        gwettop=[0.39, 0.36, 0.49, 0.71, 0.73, 0.62, 0.61, 0.63, 0.56, 0.57, 0.62, 0.47],
        gwetprof=[0.50, 0.47, 0.52, 0.66, 0.72, 0.68, 0.65, 0.66, 0.62, 0.61, 0.63, 0.56],
        warming_trend_c_decade=0.29,
        heat_stress_days_yr=4,
        frost_days_yr=0,
        longest_dry_spell_days=28,
        heavy_rain_days_yr=10,
    ),
    "punjab_in": FarmPreset(
        id="punjab_in",
        name_en="Indo-Gangetic Plain (Ludhiana, India)",
        name_es="Llanura Indogangética (Ludhiana, India)",
        region_en="Subtropical alluvial — extreme heatwaves & falling water tables",
        region_es="Aluvial subtropical — olas de calor extremas y caída freática",
        latitude=30.90,
        longitude=75.85,
        elevation_m=247.0,
        hemisphere="N",
        default_soil={
            "texture": "loam",
            "som_pct": 1.4,
            "ph": 7.6,
            "initial_n_kg_ha": 45.0,
            "slope_pct": 1.0,
            "irrigation_mode": "deficit",
        },
        challenge_summary_en=(
            "Pre-monsoon heat spikes (>40 C) threaten wheat grain filling, while "
            "water-intensive cereal cycles strain aquifers and deplete organic carbon."
        ),
        challenge_summary_es=(
            "Picos de calor pre-monzónicos (>40 C) afectan al trigo, mientras los "
            "cereales intensivos agotan los acuíferos y el carbono del suelo."
        ),
        t2m=[12.4, 15.6, 21.1, 27.6, 32.5, 34.1, 31.2, 29.9, 28.5, 24.4, 18.6, 13.7],
        t2m_max=[18.8, 22.3, 28.4, 35.6, 40.4, 40.8, 35.7, 34.2, 33.8, 31.4, 26.1, 20.6],
        t2m_min=[6.4, 9.1, 13.9, 19.5, 24.6, 27.5, 27.1, 26.0, 23.4, 17.6, 11.4, 7.1],
        prectotcorr_mm_day=[0.85, 1.05, 0.80, 0.55, 0.72, 2.35, 6.45, 5.80, 3.10, 0.45, 0.22, 0.48],
        sw_dwn_mj_m2_day=[12.2, 15.8, 20.4, 24.2, 26.1, 24.6, 20.5, 19.6, 19.4, 17.2, 13.9, 11.5],
        rh2m=[71.0, 64.0, 53.0, 36.0, 31.0, 44.0, 72.0, 78.0, 71.0, 56.0, 58.0, 67.0],
        ws2m=[2.0, 2.3, 2.5, 2.6, 2.8, 3.0, 2.6, 2.2, 1.9, 1.7, 1.7, 1.8],
        gwetroot=[0.52, 0.50, 0.43, 0.33, 0.27, 0.34, 0.64, 0.74, 0.67, 0.52, 0.46, 0.48],
        gwettop=[0.46, 0.42, 0.33, 0.22, 0.17, 0.31, 0.68, 0.75, 0.62, 0.41, 0.35, 0.40],
        gwetprof=[0.54, 0.52, 0.46, 0.38, 0.32, 0.36, 0.60, 0.71, 0.68, 0.56, 0.50, 0.51],
        warming_trend_c_decade=0.41,
        heat_stress_days_yr=68,
        frost_days_yr=2,
        longest_dry_spell_days=52,
        heavy_rain_days_yr=12,
    ),
    "andalucia_es": FarmPreset(
        id="andalucia_es",
        name_en="Guadalquivir Basin (Córdoba, Spain)",
        name_es="Valle del Guadalquivir (Córdoba, España)",
        region_en="Mediterranean dryland — acute summer drought & topsoil crusting",
        region_es="Secano mediterráneo — sequía estival severa y pérdida orgánica",
        latitude=37.88,
        longitude=-4.78,
        elevation_m=120.0,
        hemisphere="N",
        default_soil={
            "texture": "silty_clay",
            "som_pct": 1.3,
            "ph": 7.8,
            "initial_n_kg_ha": 34.0,
            "slope_pct": 5.0,
            "irrigation_mode": "rainfed",
        },
        challenge_summary_en=(
            "Severe June-September aridity (<10 mm/month) and low organic matter "
            "demand autumn-winter drought-hardy rotations with cover crops."
        ),
        challenge_summary_es=(
            "Aridez extrema de junio a septiembre y baja materia orgánica exigen "
            "rotaciones otoño-invierno tolerantes a sequía con cubiertas."
        ),
        t2m=[9.4, 11.1, 14.0, 16.5, 20.6, 25.4, 28.7, 28.4, 24.3, 19.0, 13.4, 10.1],
        t2m_max=[14.8, 17.0, 20.5, 23.1, 27.6, 33.1, 37.0, 36.6, 31.6, 25.1, 18.8, 15.1],
        t2m_min=[4.6, 5.7, 7.9, 10.1, 13.5, 17.6, 20.4, 20.5, 17.4, 13.3, 8.5, 5.6],
        prectotcorr_mm_day=[1.95, 1.75, 1.55, 1.65, 1.05, 0.35, 0.08, 0.12, 0.78, 2.25, 2.45, 2.35],
        sw_dwn_mj_m2_day=[9.6, 13.1, 17.6, 21.8, 25.6, 28.2, 28.7, 25.8, 20.5, 14.7, 10.5, 8.5],
        rh2m=[77.0, 71.0, 64.0, 60.0, 52.0, 42.0, 36.0, 38.0, 48.0, 63.0, 73.0, 78.0],
        ws2m=[2.2, 2.4, 2.6, 2.6, 2.5, 2.6, 2.7, 2.6, 2.3, 2.2, 2.2, 2.2],
        gwetroot=[0.66, 0.67, 0.64, 0.59, 0.48, 0.35, 0.25, 0.22, 0.26, 0.41, 0.56, 0.64],
        gwettop=[0.68, 0.66, 0.58, 0.51, 0.36, 0.22, 0.14, 0.14, 0.23, 0.45, 0.62, 0.68],
        gwetprof=[0.65, 0.66, 0.64, 0.60, 0.52, 0.41, 0.32, 0.28, 0.30, 0.42, 0.54, 0.62],
        warming_trend_c_decade=0.44,
        heat_stress_days_yr=54,
        frost_days_yr=6,
        longest_dry_spell_days=68,
        heavy_rain_days_yr=6,
    ),
}


def list_presets_summary() -> List[Dict[str, object]]:
    """Return lightweight metadata list for the UI selector."""
    return [
        {
            "id": p.id,
            "name_en": p.name_en,
            "name_es": p.name_es,
            "region_en": p.region_en,
            "region_es": p.region_es,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "elevation_m": p.elevation_m,
            "hemisphere": p.hemisphere,
            "default_soil": p.default_soil,
            "challenge_summary_en": p.challenge_summary_en,
            "challenge_summary_es": p.challenge_summary_es,
        }
        for p in FARM_PRESETS.values()
    ]


def preset_to_dict(preset_id: str) -> Dict[str, object]:
    return asdict(FARM_PRESETS[preset_id])
