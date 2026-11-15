"""Zero-external-dependency HTTP server and JSON API for Orbital Farm."""

from __future__ import annotations

import csv
import io
import json
import mimetypes
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse

from .crops import list_crops_payload
from .nasa_power import fetch_climate_profile, query_nasa_power_viewer
from .optimizer import (
    SCENARIO_CATALOG,
    FarmerPriorities,
    optimize_rotations,
    simulate_all_scenarios,
)
from .presets import list_presets_summary
from .soil_water import SOIL_TEXTURES, LocalSoilConfig, simulate_local_soil_profile
from .translator import translate_dictionary

WEB_DIR = Path(__file__).resolve().parent.parent / "web"


class OrbitalFarmHandler(BaseHTTPRequestHandler):
    """Serve static frontend assets and Orbital Farm agro-climatic REST endpoints."""

    server_version = "OrbitalFarm/1.1"

    def log_message(self, format: str, *args: Any) -> None:
        pass

    def _send_json(self, payload: Any, status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path) -> None:
        if not path.exists() or not path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return
        mime, _ = mimetypes.guess_type(str(path))
        content = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", f"{mime or 'application/octet-stream'}; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def _read_json_body(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8"))

    def _parse_soil(self, s_in: Dict[str, Any]) -> LocalSoilConfig:
        return LocalSoilConfig(
            texture=str(s_in.get("texture", "loam")),
            som_pct=float(s_in.get("som_pct", 2.2)),
            ph=float(s_in.get("ph", 6.6)),
            initial_n_kg_ha=float(s_in.get("initial_n_kg_ha", 45.0)),
            slope_pct=float(s_in.get("slope_pct", 3.0)),
            irrigation_mode=str(s_in.get("irrigation_mode", "rainfed")),
        )

    def _parse_priorities(self, p_in: Dict[str, Any]) -> FarmerPriorities:
        return FarmerPriorities(
            soil_health=float(p_in.get("soil_health", 30.0)),
            water_conservation=float(p_in.get("water_conservation", 30.0)),
            climate_resilience=float(p_in.get("climate_resilience", 20.0)),
            profit_food=float(p_in.get("profit_food", 20.0)),
        )

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._send_json({"status": "ok", "service": "orbital-farm", "version": "1.1.0"})
            return

        if path == "/api/bootstrap":
            textures = [
                {
                    "code": t.code,
                    "label_en": t.label_en,
                    "label_es": t.label_es,
                    "base_awc_mm_m": t.base_awc_mm_m,
                    "infiltration_rate": t.infiltration_rate,
                }
                for t in SOIL_TEXTURES.values()
            ]
            self._send_json(
                {
                    "presets": list_presets_summary(),
                    "soil_textures": textures,
                    "crops": list_crops_payload(),
                    "scenarios": SCENARIO_CATALOG,
                }
            )
            return

        if path == "/" or path == "/index.html":
            self._send_file(WEB_DIR / "index.html")
            return

        safe_rel = path.lstrip("/")
        candidate = (WEB_DIR / safe_rel).resolve()
        if WEB_DIR.resolve() in candidate.parents and candidate.exists():
            self._send_file(candidate)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        try:
            data = self._read_json_body()
        except json.JSONDecodeError as exc:
            self._send_json({"error": f"Invalid JSON: {exc}"}, status=HTTPStatus.BAD_REQUEST)
            return

        if path == "/api/climate":
            try:
                lat = float(data.get("latitude", 20.60))
                lon = float(data.get("longitude", -101.20))
                preset_id = data.get("preset_id") or None
                prefer_live = bool(data.get("prefer_live", True))
                label = data.get("location_label") or None
                profile = fetch_climate_profile(
                    latitude=lat,
                    longitude=lon,
                    preset_id=preset_id,
                    prefer_live=prefer_live,
                    location_label=label,
                )
                self._send_json(profile)
            except Exception as exc:
                self._send_json({"error": str(exc)}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/nasa-viewer":
            try:
                res = query_nasa_power_viewer(
                    latitude=float(data.get("latitude", 20.60)),
                    longitude=float(data.get("longitude", -101.20)),
                    community=str(data.get("community", "AG")),
                    temporal=str(data.get("temporal", "monthly")),
                    parameters=data.get("parameters"),
                    start=str(data.get("start", "2023")),
                    end=str(data.get("end", "2025")),
                    fmt=str(data.get("format", "JSON")),
                )
                if res.get("format") == "CSV" and "csv" in res:
                    csv_bytes = res["csv"].encode("utf-8")
                    self.send_response(HTTPStatus.OK)
                    self.send_header("Content-Type", "text/csv; charset=utf-8")
                    self.send_header(
                        "Content-Disposition",
                        'attachment; filename="nasa_power_viewer_data.csv"',
                    )
                    self.send_header("Content-Length", str(len(csv_bytes)))
                    self.end_headers()
                    self.wfile.write(csv_bytes)
                    return
                self._send_json(res)
            except Exception as exc:
                self._send_json({"error": str(exc)}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/optimize":
            try:
                climate = data.get("climate")
                if not climate:
                    loc = data.get("location", {})
                    climate = fetch_climate_profile(
                        latitude=float(loc.get("latitude", 20.60)),
                        longitude=float(loc.get("longitude", -101.20)),
                        preset_id=loc.get("preset_id"),
                        prefer_live=bool(loc.get("prefer_live", True)),
                        location_label=loc.get("location_label"),
                    )

                soil = self._parse_soil(data.get("soil", {}))
                priorities = self._parse_priorities(data.get("priorities", {}))
                scenario = str(data.get("scenario", "baseline"))
                num_years = int(data.get("num_years", 3))
                current_crop_id = data.get("current_crop_id") or None
                result = optimize_rotations(
                    climate_profile=climate,
                    soil=soil,
                    priorities=priorities,
                    scenario=scenario,
                    num_years=num_years,
                    top_k=3,
                    current_crop_id=current_crop_id,
                )
                result["local_soil_months"] = simulate_local_soil_profile(
                    result["climate"]["months"], soil
                )
                self._send_json(result)
            except Exception as exc:
                self._send_json({"error": str(exc)}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/scenarios-matrix":
            try:
                climate = data.get("climate")
                if not climate:
                    loc = data.get("location", {})
                    climate = fetch_climate_profile(
                        latitude=float(loc.get("latitude", 20.60)),
                        longitude=float(loc.get("longitude", -101.20)),
                        preset_id=loc.get("preset_id"),
                        prefer_live=bool(loc.get("prefer_live", True)),
                    )
                soil = self._parse_soil(data.get("soil", {}))
                priorities = self._parse_priorities(data.get("priorities", {}))
                num_years = int(data.get("num_years", 3))
                current_crop_id = data.get("current_crop_id") or None
                matrix = simulate_all_scenarios(
                    climate_profile=climate,
                    soil=soil,
                    priorities=priorities,
                    num_years=num_years,
                    current_crop_id=current_crop_id,
                )
                self._send_json(matrix)
            except Exception as exc:
                self._send_json({"error": str(exc)}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/translate":
            try:
                target_lang = str(data.get("target_lang", "en"))
                source_lang = str(data.get("source_lang", "es"))
                texts = data.get("texts", {})
                if not isinstance(texts, dict):
                    self._send_json({"error": "texts must be a dict"}, status=HTTPStatus.BAD_REQUEST)
                    return
                res = translate_dictionary(
                    {str(k): str(v) for k, v in texts.items()},
                    target_lang=target_lang,
                    source_lang=source_lang,
                )
                self._send_json(res)
            except Exception as exc:
                self._send_json({"error": str(exc)}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/export-csv":
            strategy = data.get("strategy", {})
            seasons = strategy.get("seasons", [])
            buf = io.StringIO()
            writer = csv.writer(buf)
            writer.writerow(
                [
                    "Season_Index",
                    "Year",
                    "Season_Window",
                    "Crop_Name",
                    "Scientific_Name",
                    "Botanical_Family",
                    "Root_Depth_m",
                    "GDD_Accumulated",
                    "ETc_mm",
                    "Effective_Rain_mm",
                    "Irrigation_mm",
                    "Water_Stress_Ks",
                    "Yield_Resilience_Pct",
                    "Pest_Risk_Pct",
                    "End_SOM_Pct",
                    "End_Available_N_kg_ha",
                ]
            )
            for s in seasons:
                writer.writerow(
                    [
                        s.get("season_index"),
                        s.get("year"),
                        s.get("season_label"),
                        s.get("crop_name_es") or s.get("crop_name_en"),
                        s.get("scientific_name"),
                        s.get("family"),
                        s.get("root_depth_m"),
                        s.get("gdd_accumulated"),
                        s.get("etc_mm"),
                        s.get("effective_rain_mm"),
                        s.get("irrigation_mm"),
                        s.get("water_stress_ks"),
                        s.get("yield_resilience_pct"),
                        s.get("pest_risk_pct"),
                        s.get("som_end_pct"),
                        s.get("n_balance_end_kg_ha"),
                    ]
                )
            csv_bytes = buf.getvalue().encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header(
                "Content-Disposition", 'attachment; filename="orbital_farm_rotation_plan.csv"'
            )
            self.send_header("Content-Length", str(len(csv_bytes)))
            self.end_headers()
            self.wfile.write(csv_bytes)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Unknown API endpoint")


def run_server(host: str = "127.0.0.1", port: int = 8765, open_browser: bool = True) -> None:
    server = ThreadingHTTPServer((host, port), OrbitalFarmHandler)
    url = f"http://{host}:{port}"
    print(f"Orbital Farm decision-support server running at {url}")
    print("Press Ctrl+C to stop.")
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Orbital Farm server...")
        server.server_close()
