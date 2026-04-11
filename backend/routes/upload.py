from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schema import UploadResponse
from services.parser import extract_text
from services.ai_parser import extract_assignments, AIServiceError

router = APIRouter()

MAX_FILE_SIZE    = 10 * 1024 * 1024  # 10 MB
PDF_MAGIC_BYTES  = b"%PDF"


@router.post("/upload", response_model=UploadResponse)
async def upload_syllabus(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10 MB")

    if not file_bytes.startswith(PDF_MAGIC_BYTES):
        raise HTTPException(status_code=400, detail="Invalid file. Please upload a real PDF")

    text = extract_text(file_bytes)
    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from this PDF. It may be scanned or image-based",
        )

    try:
        assignments, contacts = extract_assignments(text)
    except AIServiceError as exc:
        msg = str(exc)
        raise HTTPException(status_code=429 if "wait" in msg.lower() else 502, detail=msg)

    if not assignments:
        raise HTTPException(status_code=422, detail="No deadlines found in this syllabus")

    return UploadResponse(assignments=assignments, contacts=contacts)
