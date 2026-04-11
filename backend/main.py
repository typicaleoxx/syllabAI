from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.chat import router as chat_router
import os

app = FastAPI(title="SyllabAI", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip()
allow_origins = [frontend_origin] if frontend_origin else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):\d+|https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {"status": "SyllabAI backend is running"}
