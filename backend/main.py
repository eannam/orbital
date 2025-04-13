from pathlib import Path
from typing import List

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from lib import parser
from lib.utils import logger, read_json_file, write_json_file

app = FastAPI()


# CORS settings (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")


# File paths
RAW_DATA_PATH = Path("data/raw-data.json")
PARSED_DATA_PATH = Path("data/parsed-data.json")


# Pydantic model for parsed items
class ParsedItem(BaseModel):
    id: str
    registrationDateAndPlanReference: str
    description: str
    leaseDateAndTerm: str
    lesseeTitle: str
    notes: List[str]


# Routes
@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.get("/data/raw")
def get_raw_data():
    logger.info("GET /data/raw")
    try:
        data = read_json_file(RAW_DATA_PATH)
        return data
    except Exception as e:
        logger.error(f"Failed to read raw data: {e}")
        raise HTTPException(status_code=500, detail="Something went wrong.")


@router.get("/data/parsed", response_model=List[ParsedItem])
def get_parsed_data():
    logger.info("GET /data/parsed")
    try:
        data = read_json_file(PARSED_DATA_PATH)
        if not isinstance(data, list):
            logger.warning("Parsed data is not a list. Returning empty list.")
            return []
        return data
    except Exception as e:
        if "Invalid JSON" in e.detail:
            raise e
        logger.warning(f"Returning empty list due to error: {e}")
        return []


@router.post("/data/parsed")
def parse_data():
    logger.info("POST /data/parsed")
    try:
        raw_data = read_json_file(RAW_DATA_PATH)
        entries = parser.extract_schedule_entries(raw_data)
        parsed_entries = parser.parse_schedule_entries(entries)
        write_json_file(PARSED_DATA_PATH, parsed_entries)
        return {"message": "OK"}
    except Exception as e:
        if "Invalid JSON" in e.detail:
            raise e
        logger.error(f"Failed to parse data: {e}")
        raise HTTPException(status_code=500, detail="Something went wrong.")


@router.delete("/data/parsed")
def delete_all_parsed_data():
    logger.info("DELETE /data/parsed")
    try:
        write_json_file(PARSED_DATA_PATH, [])
        return {"message": "OK"}
    except Exception as e:
        logger.error(f"Failed to delete parsed data: {e}")
        raise HTTPException(status_code=500, detail="Something went wrong.")


@router.post("/data/parsed/{id}/report_issue")
def report_issue(id: str):
    logger.info(f"POST /data/parsed/{id}/report_issue")
    # TODO: Here we might flag to a human admin for review or send to a LLM for cleaning.
    return {"message": "OK"}


app.include_router(router)
