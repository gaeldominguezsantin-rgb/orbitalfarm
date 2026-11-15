"""Unit and integration tests for the Orbital Farm decision-support prototype."""

from __future__ import annotations

import json
import threading
import unittest
import urllib.request
from http.server import ThreadingHTTPServer

from orbital_farm.crops import CROPS
from orbital_farm.nasa_power import (
    apply_climate_stress_scenario,
    fetch_climate_profile,
    parse_daily_extremes,
    parse_monthly_nasa_power,
)
from orbital_farm.optimizer import FarmerPriorities, optimize_rotations, simulate_all_scenarios
from orbital_farm.server import OrbitalFarmHandler
from orbital_farm.soil_water import (
    LocalSoilConfig,
    effective_rainfall_mm,
    fao56_eto_daily,
    simulate_local_soil_profile,
)
from orbital_farm.translator import normalize_lang_code


class TestSoilAndETo(unittest.TestCase):
    def test_fao56_eto_physical_bounds(self) -> None:
        eto_cool = fao56_eto_daily(
            t_max_c=14.0,
            t_min_c=4.0,
            rh_pct=78.0,
            wind_2m_ms=1.8,
            rs_mj_m2_day=10.0,
            latitude_deg=42.0,
            day_of_year=15,
            elevation_m=250.0,
        )
        eto_hot = fao56_eto_daily(
            t_max_c=38.0,
            t_min_c=22.0,
            rh_pct=28.0,
            wind_2m_ms=3.2,
            rs_mj_m2_day=27.0,
            latitude_deg=30.0,
            day_of_year=166,
            elevation_m=200.0,
        )
        self.assertGreater(eto_cool, 0.2)
        self.assertLess(eto_cool, 2.5)
        self.assertGreater(eto_hot, 5.5)
        self.assertLess(eto_hot, 12.0)
        self.assertGreater(eto_hot, eto_cool)

    def test_som_increases_awc_and_slope_reduces_effective_rain(self) -> None:
        low_som = LocalSoilConfig(texture="loam", som_pct=1.0, slope_pct=1.0)
        high_som = LocalSoilConfig(texture="loam", som_pct=4.0, slope_pct=1.0)
        self.assertGreater(high_som.effective_awc_mm_per_m(), low_som.effective_awc_mm_per_m())

        steep = LocalSoilConfig(texture="silty_clay", som_pct=2.0, slope_pct=14.0)
        flat = LocalSoilConfig(texture="silty_clay", som_pct=2.0, slope_pct=1.0)
        self.assertLess(effective_rainfall_mm(80.0, steep), effective_rainfall_mm(80.0, flat))

    def test_local_soil_profile_responds_to_irrigation_and_som(self) -> None:
        climate = fetch_climate_profile(20.60, -101.20, preset_id="bajio_mx", prefer_live=False)
        rainfed = simulate_local_soil_profile(
            climate["months"], LocalSoilConfig(texture="loamy_sand", som_pct=1.0, irrigation_mode="rainfed")
        )
        irrigated = simulate_local_soil_profile(
            climate["months"], LocalSoilConfig(texture="clay_loam", som_pct=4.0, irrigation_mode="full")
        )
        self.assertEqual(len(rainfed), 12)
        avg_rainfed = sum(m["local_moisture_pct"] for m in rainfed) / 12.0
        avg_irrig = sum(m["local_moisture_pct"] for m in irrigated) / 12.0
        self.assertGreater(avg_irrig, avg_rainfed)


class TestNasaPowerParsing(unittest.TestCase):
    def test_parse_monthly_skips_month_13_and_fill_values(self) -> None:
        payload = {
            "geometry": {"type": "Point", "coordinates": [-101.2, 20.6, 1864.0]},
            "header": {"api": {"version": "v2.10.0"}},
            "properties": {
                "parameter": {
                    "T2M": {
                        "202001": 14.0,
                        "202002": 16.0,
                        "202013": 99.0,  # Annual aggregate must be ignored
                        "202101": -999.0,  # Fill value must be ignored
                        "202102": 18.0,
                    },
                    "T2M_MAX": {"202001": 22.0, "202002": 24.0},
                    "T2M_MIN": {"202001": 6.0, "202002": 8.0},
                    "PRECTOTCORR": {"202001": 0.5, "202002": 0.4},
                    "ALLSKY_SFC_SW_DWN": {"202001": 17.0, "202002": 20.0},
                    "RH2M": {"202001": 50.0, "202002": 45.0},
                    "WS2M": {"202001": 2.0, "202002": 2.2},
                    "GWETROOT": {"202001": 0.44, "202002": 0.40},
                    "GWETTOP": {"202001": 0.32, "202002": 0.28},
                }
            },
        }
        parsed = parse_monthly_nasa_power(payload, 20.6, -101.2)
        self.assertEqual(parsed["elevation_m"], 1864.0)
        self.assertAlmostEqual(parsed["t2m"][0], 14.0, places=2)
        self.assertAlmostEqual(parsed["t2m"][1], 17.0, places=2)

    def test_parse_daily_extremes(self) -> None:
        payload = {
            "properties": {
                "parameter": {
                    "T2M_MAX": {f"202401{d:02d}": 36.0 if d <= 5 else 25.0 for d in range(1, 21)},
                    "T2M_MIN": {f"202401{d:02d}": 1.0 if d == 1 else 12.0 for d in range(1, 21)},
                    "PRECTOTCORR": {
                        f"202401{d:02d}": 30.0 if d == 1 else (0.0 if d <= 12 else 3.0)
                        for d in range(1, 21)
                    },
                }
            }
        }
        ext = parse_daily_extremes(payload)
        self.assertEqual(ext["longest_dry_spell_days"], 11)
        self.assertGreaterEqual(ext["heat_stress_days_yr"], 5)
        self.assertGreaterEqual(ext["frost_days_yr"], 1)
        self.assertGreaterEqual(ext["heavy_rain_days_yr"], 1)


class TestOptimizerAndScenarios(unittest.TestCase):
    def test_optimize_rotations_diverse_and_beats_baseline(self) -> None:
        climate = fetch_climate_profile(
            latitude=20.60, longitude=-101.20, preset_id="bajio_mx", prefer_live=False
        )
        soil = LocalSoilConfig(
            texture="clay_loam",
            som_pct=1.8,
            ph=7.3,
            initial_n_kg_ha=42.0,
            slope_pct=2.5,
            irrigation_mode="deficit",
        )
        prios = FarmerPriorities(
            soil_health=40.0,
            water_conservation=30.0,
            climate_resilience=20.0,
            profit_food=10.0,
        )
        res = optimize_rotations(climate, soil, prios, scenario="baseline", num_years=3, top_k=3)
        self.assertEqual(len(res["strategies"]), 3)
        top = res["strategies"][0]
        self.assertEqual(len(top["seasons"]), 6)
        # Top strategy should diversify botanical families and improve SOM over monoculture
        self.assertGreaterEqual(top["metrics"]["unique_families"], 2)
        self.assertGreater(top["vs_baseline"]["som_gain_pct"], 0.0)

        # Ensure consecutive seasons do not repeat the same botanical family
        families = [CROPS[cid].family for cid in top["crop_ids"]]
        for i in range(1, len(families)):
            self.assertNotEqual(families[i], families[i - 1])

    def test_extreme_climate_stress_increases_eto_and_aridity(self) -> None:
        base = fetch_climate_profile(
            latitude=37.88, longitude=-4.78, preset_id="andalucia_es", prefer_live=False
        )
        stressed = apply_climate_stress_scenario(base, scenario="extreme_25")
        self.assertGreater(
            stressed["annual_summary"]["total_eto_mm"],
            base["annual_summary"]["total_eto_mm"],
        )
        self.assertLess(
            stressed["annual_summary"]["aridity_index"],
            base["annual_summary"]["aridity_index"],
        )

    def test_simulate_all_scenarios_and_current_crop(self) -> None:
        climate = fetch_climate_profile(
            latitude=20.60, longitude=-101.20, preset_id="bajio_mx", prefer_live=False
        )
        soil = LocalSoilConfig(texture="clay_loam", som_pct=1.8, ph=7.3)
        prios = FarmerPriorities(35, 35, 15, 15)
        matrix = simulate_all_scenarios(
            climate_profile=climate,
            soil=soil,
            priorities=prios,
            num_years=3,
            current_crop_id="maize",
        )
        self.assertEqual(len(matrix["scenarios"]), 4)
        ids = [row["scenario_id"] for row in matrix["scenarios"]]
        self.assertEqual(ids, ["baseline", "warm_dry_15", "extreme_25", "wet_extreme_12"])
        self.assertEqual(matrix["scenarios"][0]["baseline"]["crop_ids"], ["maize"] * 6)

    def test_language_alias_normalization(self) -> None:
        self.assertEqual(normalize_lang_code("Francés"), "fr")
        self.assertEqual(normalize_lang_code("Japanese"), "ja")
        self.assertEqual(normalize_lang_code("pt"), "pt")


class TestHttpServerIntegration(unittest.TestCase):
    def test_api_endpoints_roundtrip(self) -> None:
        server = ThreadingHTTPServer(("127.0.0.1", 0), OrbitalFarmHandler)
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/health", timeout=5) as r:
                health = json.loads(r.read().decode("utf-8"))
                self.assertEqual(health["status"], "ok")

            with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/bootstrap", timeout=5) as r:
                boot = json.loads(r.read().decode("utf-8"))
                self.assertEqual(len(boot["presets"]), 5)
                self.assertGreaterEqual(len(boot["crops"]), 14)

            req = urllib.request.Request(
                f"http://127.0.0.1:{port}/api/optimize",
                data=json.dumps(
                    {
                        "location": {
                            "latitude": -0.30,
                            "longitude": 36.08,
                            "preset_id": "nakuru_ke",
                            "prefer_live": False,
                        },
                        "soil": {"texture": "sandy_loam", "som_pct": 1.9, "ph": 5.9},
                        "priorities": {
                            "soil_health": 35,
                            "water_conservation": 35,
                            "climate_resilience": 15,
                            "profit_food": 15,
                        },
                        "scenario": "warm_dry_15",
                    }
                ).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as r:
                opt = json.loads(r.read().decode("utf-8"))
                self.assertEqual(opt["scenario"], "warm_dry_15")
                self.assertEqual(len(opt["strategies"]), 3)

            req_matrix = urllib.request.Request(
                f"http://127.0.0.1:{port}/api/scenarios-matrix",
                data=json.dumps(
                    {
                        "location": {
                            "latitude": 20.60,
                            "longitude": -101.20,
                            "preset_id": "bajio_mx",
                            "prefer_live": False,
                        },
                        "soil": {"texture": "clay_loam", "som_pct": 1.8, "ph": 7.3},
                        "priorities": {"soil_health": 30, "water_conservation": 30, "climate_resilience": 20, "profit_food": 20},
                        "current_crop_id": "maize",
                    }
                ).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req_matrix, timeout=10) as r:
                mat = json.loads(r.read().decode("utf-8"))
                self.assertEqual(len(mat["scenarios"]), 4)
        finally:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
