from fastapi import APIRouter, UploadFile, File
from models.schema import UploadResponse

router = APIRouter()

MOCK_RESPONSE = UploadResponse(
    assignments=[
        {"name": "Homework 1",   "due": "2026-04-20", "risk": "HIGH"},
        {"name": "Midterm Exam", "due": "2026-05-01", "risk": "HIGH"},
        {"name": "Quiz 1",       "due": "2026-05-10", "risk": "MEDIUM"},
        {"name": "Final Project","due": "2026-05-25", "risk": "LOW"},
    ]
)


@router.post("/upload", response_model=UploadResponse)
async def upload_syllabus(file: UploadFile = File(...)):
    # Phase 1: return mock data so the frontend can be built and tested.
    # Parser + AI will replace this in Phase 4-5.
    return MOCK_RESPONSE
