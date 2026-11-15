"""Dynamic multi-language translation helper with disk caching."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Dict

CACHE_DIR = Path(__file__).resolve().parent.parent / "data" / "cache"

# Map friendly language names or common tags to ISO 639-1 codes
LANGUAGE_ALIASES: Dict[str, str] = {
    "spanish": "es",
    "español": "es",
    "english": "en",
    "inglés": "en",
    "french": "fr",
    "francés": "fr",
    "portuguese": "pt",
    "portugués": "pt",
    "italian": "it",
    "italiano": "it",
    "german": "de",
    "alemán": "de",
    "arabic": "ar",
    "árabe": "ar",
    "hindi": "hi",
    "swahili": "sw",
    "kiswahili": "sw",
    "chinese": "zh-CN",
    "chino": "zh-CN",
    "japanese": "ja",
    "japonés": "ja",
    "korean": "ko",
    "coreano": "ko",
    "russian": "ru",
    "ruso": "ru",
    "dutch": "nl",
    "quechua": "qu",
    "guarani": "gn",
    "catalan": "ca",
    "catalán": "ca",
}


def normalize_lang_code(lang: str) -> str:
    cleaned = (lang or "es").strip()
    low = cleaned.lower()
    if low in LANGUAGE_ALIASES:
        return LANGUAGE_ALIASES[low]
    return cleaned


def _translate_batch_online(texts: Dict[str, str], source_lang: str, target_lang: str) -> Dict[str, str]:
    keys = list(texts.keys())
    values = [texts[k].replace("\n", " ") for k in keys]
    delimiter = "\n|||\n"
    joined = delimiter.join(values)

    # Split into chunks <= 3500 chars to respect URL limits safely
    result: Dict[str, str] = {}
    idx = 0
    while idx < len(keys):
        chunk_keys = []
        chunk_vals = []
        char_count = 0
        while idx < len(keys) and (char_count + len(values[idx]) + 8 < 3200 or not chunk_keys):
            chunk_keys.append(keys[idx])
            chunk_vals.append(values[idx])
            char_count += len(values[idx]) + 8
            idx += 1

        payload_str = delimiter.join(chunk_vals)
        qs = urllib.parse.urlencode(
            {
                "client": "gtx",
                "sl": source_lang,
                "tl": target_lang,
                "dt": "t",
                "q": payload_str,
            }
        )
        url = f"https://translate.googleapis.com/translate_a/single?{qs}"
        req = urllib.request.Request(url, headers={"User-Agent": "OrbitalFarm/1.1"})
        with urllib.request.urlopen(req, timeout=12.0) as resp:
            raw = json.loads(resp.read().decode("utf-8"))

        translated_full = "".join(seg[0] for seg in raw[0] if seg and seg[0])
        parts = [p.strip() for p in translated_full.split("|||")]
        for i, k in enumerate(chunk_keys):
            result[k] = parts[i] if i < len(parts) and parts[i] else texts[k]
    return result


def translate_dictionary(
    texts: Dict[str, str],
    target_lang: str,
    source_lang: str = "es",
) -> Dict[str, object]:
    """Translate a key->string dictionary to any target language with caching."""
    tl = normalize_lang_code(target_lang)
    if tl.lower() == source_lang.lower():
        return {"target_lang": tl, "status": "NATIVE", "translations": texts}

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    safe_tl = tl.replace("/", "_").replace("\\", "_")
    cache_path = CACHE_DIR / f"i18n_{safe_tl}.json"
    cached: Dict[str, str] = {}
    if cache_path.exists():
        try:
            cached = json.loads(cache_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            cached = {}

    missing = {k: v for k, v in texts.items() if k not in cached}
    if not missing:
        return {
            "target_lang": tl,
            "status": "CACHED",
            "translations": {k: cached.get(k, v) for k, v in texts.items()},
        }

    try:
        newly_translated = _translate_batch_online(missing, source_lang=source_lang, target_lang=tl)
        cached.update(newly_translated)
        try:
            cache_path.write_text(json.dumps(cached, ensure_ascii=False, indent=2), encoding="utf-8")
        except OSError:
            pass
        return {
            "target_lang": tl,
            "status": "LIVE_TRANSLATED",
            "translations": {k: cached.get(k, v) for k, v in texts.items()},
        }
    except (urllib.error.URLError, TimeoutError, ValueError, IndexError) as exc:
        return {
            "target_lang": tl,
            "status": "OFFLINE_FALLBACK",
            "error": str(exc),
            "translations": {k: cached.get(k, v) for k, v in texts.items()},
        }
