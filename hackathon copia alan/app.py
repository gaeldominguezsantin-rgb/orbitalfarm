"""CLI entry point for the Orbital Farm prototype (local & public cloud ready)."""

from __future__ import annotations

import argparse
import os

from orbital_farm.server import run_server


def main() -> None:
    env_port = os.environ.get("PORT")
    default_port = int(env_port) if env_port else 8765
    default_host = os.environ.get("HOST", "0.0.0.0" if env_port else "127.0.0.1")

    parser = argparse.ArgumentParser(
        description="Orbital Farm: NASA POWER Crop Rotation Decision-Support App"
    )
    parser.add_argument(
        "--host",
        default=default_host,
        help="Bind host (default: 127.0.0.1 locally, or 0.0.0.0 when PORT env is set)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=default_port,
        help="Port number (default: $PORT or 8765)",
    )
    parser.add_argument(
        "--public",
        action="store_true",
        help="Bind to 0.0.0.0 so the app is reachable from other devices on the network",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Do not automatically open the web browser on launch",
    )
    args = parser.parse_args()
    host = "0.0.0.0" if args.public else args.host
    open_browser = not args.no_browser and not bool(env_port) and not args.public
    run_server(host=host, port=args.port, open_browser=open_browser)


if __name__ == "__main__":
    main()
