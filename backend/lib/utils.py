import json
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)


def read_json_file(path: Path):
    try:
        if not path.exists():
            logger.warning(f"{path} not found, returning empty list.")
            return []
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {path}: {e}")
        raise Exception("Invalid JSON format.")
    except Exception:
        logger.exception(f"Failed to read from {path}")
        raise Exception("Error reading data.")


def write_json_file(path: Path, data):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception:
        logger.exception(f"Failed to write to {path}")
        raise Exception("Error writing data.")


def reverse_string(s):
    return s[::-1]
