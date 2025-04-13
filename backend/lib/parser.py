import re
from typing import Dict, List
from uuid import uuid4

from .utils import logger, reverse_string


def extract_schedule_entries(raw_data):
    """
    Extracts schedule entries from the raw data.
    Each entry is a dictionary with 'entryNumber' and 'entryText'.
    """
    entries = []
    for data_block in raw_data:
        items = data_block.get("leaseschedule", {}).get("scheduleEntry", [])
        for item in items:
            # Skip cancelled items
            if item["entryType"] == "Cancelled Item - Schedule of Notices of Leases":
                continue

            entry = {
                "entryNumber": item.get("entryNumber"),
                "entryText": item.get("entryText", []),
            }

            entries.append(entry)
    return entries


def parse_schedule_entries(entries: List[Dict[str, List[str]]]) -> List[Dict[str, str]]:
    # Regex pattern to extract fields from a reversed, fixed-width line of text.
    # Each field is expected at a specific distance from the *end* of the line,
    # so we reverse the line first and match fields left-to-right.
    regex_entry = re.compile(
        r"^(?:\s{0,11}(?P<registration>\w{0,9})(?=.{62}))?"  # registration (ends 62 chars before end)
        r"(?:\s{0,16}(?P<description>.{0,14})(?=.{46}))?"  # description (ends 46 chars before end)
        r"(?:\s{0,30}(?P<term>.{0,28})(?=.{16}))?"  # lease term (ends 16 chars before end)
        r"(?:\s{0,16}(?P<title>.{0,14}))(?:\b|$)"  # lessee title (last field, no lookahead)
    )

    parsed_entries = []

    for entry in entries:
        entry_text = entry.get("entryText", [])

        # Ensure entry_text is a list of strings (fallback if it's not)
        if not isinstance(entry_text, list):
            logger.warning(f"Invalid entry text format: {entry_text}")
            entry_text = [entry_text] if isinstance(entry_text, str) else []

        # Initialize 4 field buckets (registration, description, term, title)
        entry_columns = [[] for _ in range(4)]

        # Look for first line that starts with "Note" (case insensitive)
        has_notes = -1
        for i, row in enumerate(entry_text):
            if isinstance(row, str) and row.strip().lower().startswith("note"):
                has_notes = i
                break

        # Split entry into structured part and notes
        if has_notes != -1:
            entry_array = entry_text[:has_notes]
            notes_array = entry_text[has_notes:]
        else:
            entry_array = entry_text
            notes_array = []

        # Process each row of the main entry data
        for row in entry_array:
            if row:
                reversed_row = reverse_string(row)

                match = regex_entry.match(reversed_row)
                if match:
                    # Extract and re-reverse each matched group (in column order: title, term, description, registration)
                    segments = [
                        reverse_string(match.group(g)) if match.group(g) else ""
                        for g in ["title", "term", "description", "registration"]
                    ]
                    # Append non-empty values to corresponding columns
                    for idx, val in enumerate(segments):
                        if val:
                            entry_columns[idx].append(val)
                else:
                    logger.warning(f"Failed to match entry text: {row}")

        # Construct final structured record
        entry_data = {
            "id": str(uuid4()),  # Generate a unique ID for each parsed entry
            "registrationDateAndPlanReference": " ".join(entry_columns[0]).strip(),
            "description": " ".join(entry_columns[1]).strip(),
            "leaseDateAndTerm": " ".join(entry_columns[2]).strip(),
            "lesseeTitle": " ".join(entry_columns[3]).strip(),
            "notes": [note.strip() for note in notes_array if isinstance(note, str)],
        }

        parsed_entries.append(entry_data)

    return parsed_entries
