from pathlib import Path

from lib import parser
from lib.utils import logger, read_json_file, write_json_file

RAW_DATA_PATH = Path("data/raw-data.json")
PARSED_DATA_PATH = Path("data/parsed-data.json")

try:
    logger.info("Starting data parsing...")

    raw_data = read_json_file(RAW_DATA_PATH)

    logger.info("Extracting schedule entries from raw data...")

    entries = parser.extract_schedule_entries(raw_data)

    logger.info("Parsing schedule entries...")

    parsed_entries = parser.parse_schedule_entries(entries)

    logger.info("Writing parsed data to file...")

    write_json_file(PARSED_DATA_PATH, parsed_entries)

    logger.info("Data parsing completed successfully.")

except Exception as e:
    logger.error(f"An error occurred during data parsing: {e}")
    raise Exception("Data parsing failed.")
