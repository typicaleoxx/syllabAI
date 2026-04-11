from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schema import UploadResponse
from services.parser import extract_text
from services.ai_parser import extract_assignments, AIServiceError

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
PDF_MAGIC_BYTES = b"%PDF"


@router.post("/upload", response_model=UploadResponse)
async def upload_syllabus(file: UploadFile = File(...)):
    # 1. Validate filename
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()

    # 2. Validate file size
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10 MB")

    # 3. Validate it's actually a PDF (magic bytes — not just the extension)
    if not file_bytes.startswith(PDF_MAGIC_BYTES):
        raise HTTPException(
            status_code=400, detail="Invalid file. Please upload a real PDF"
        )

    # 4. Extract text
    text = extract_text(file_bytes)
    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from this PDF. It may be scanned or image-based",
        )

    # 5. AI extraction
    try:
        assignments = extract_assignments(text)
    except AIServiceError as exc:
        message = str(exc)
        status_code = 429 if "limit reached" in message.lower() else 502
        raise HTTPException(status_code=status_code, detail=message)

    if not assignments:
        raise HTTPException(
            status_code=422, detail="No deadlines found in this syllabus"
        )

    return UploadResponse(assignments=assignments)
