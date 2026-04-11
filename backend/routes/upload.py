from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schema import UploadResponse
from services.parser import extract_text

router = APIRouter()

MOCK_RESPONSE = UploadResponse(
    assignments=[
        {"name": "Homework 1",    "due": "2026-04-20", "risk": "HIGH"},
        {"name": "Midterm Exam",  "due": "2026-05-01", "risk": "HIGH"},
        {"name": "Quiz 1",        "due": "2026-05-10", "risk": "MEDIUM"},
        {"name": "Final Project", "due": "2026-05-25", "risk": "LOW"},
    ]
)


@router.post("/upload", response_model=UploadResponse)
async def upload_syllabus(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    text = extract_text(file_bytes)

    # Log extracted text so we can verify it's working
    print(f"\n--- Extracted {len(text)} characters from {file.filename} ---")
    print(text[:500])
    print("---\n")

    # Phase 3: parser works — still returning mock response until AI is wired up
    return MOCK_RESPONSE
