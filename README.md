# SyllabAI

SyllabAI is an AI-powered planner that turns syllabus PDFs or pasted syllabus text into structured deadlines, risk levels, weekly study plans, and calendar exports.

## What The Project Does

- Upload a syllabus PDF or paste syllabus text.
- Extract assignments, exams, deadlines, course codes, and instructor contacts.
- Calculate risk level per item (HIGH, MEDIUM, LOW) using due date and weight.
- Show a dashboard with today focus, weekly plan, and upcoming items.
- Open dedicated Syllabi and Calendar pages.
- Add manual calendar tasks and quick-add tasks from chat.
- Export deadlines as ICS for Google Calendar / Apple Calendar / Outlook.

## Why It Exists

Syllabus documents are dense and unstructured. Students miss high-impact deadlines because the information is scattered. SyllabAI converts that raw text into an action-oriented schedule.

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Pydantic
- Uvicorn

### AI And Parsing

- Groq API (LLM extraction)
- PyPDF2 (PDF text extraction)

### Storage

- Browser localStorage for saved courses and calendar tasks

## Architecture

1. User uploads PDF or pastes text in frontend.
2. Frontend calls backend endpoints.
3. Backend extracts PDF text (or uses pasted text).
4. Backend sends sanitized text to Groq with structured extraction prompt.
5. Backend validates and normalizes output into Assignment and Contact schema.
6. Risk level is computed and response is returned to frontend.
7. Frontend renders dashboard, weekly plan, calendar view, and ICS export.

## Current Features

- PDF upload endpoint and text-parse endpoint
- Chat endpoint with configurable tone
- Multi-syllabus merge on dashboard
- Risk-aware UI (color-coded urgency)
- Weekly planner with suggested start times
- Calendar page with manual and chat-added tasks
- Syllabi page with saved course summaries and contacts
- ICS generation and download

## Project Structure

```text
syllabAI/
  backend/
    main.py
    requirements.txt
    models/
      schema.py
    routes/
      upload.py
      chat.py
    services/
      parser.py
      ai_parser.py

  frontend/
    app/
      page.tsx
      layout.tsx
      calendar/page.tsx
      syllabi/page.tsx
      components/
        Dropzone.tsx
        Loader.tsx
        StatusCard.tsx
        TodayFocus.tsx
        WeeklyPlan.tsx
        WhatsComing.tsx
        Timeline.tsx
        RiskPanel.tsx
        Chat.tsx
        ContactCards.tsx
    lib/
      api.ts
      ics.ts
      storage.ts
      tone.ts
    types/
      index.ts
```

## API Endpoints

### `GET /`

Health check.

### `POST /upload`

Accepts PDF file upload and returns parsed assignments + contacts.

Request:

- multipart/form-data
- `file`: PDF

### `POST /parse-text`

Accepts raw syllabus text and returns parsed assignments + contacts.

Request body:

```json
{
  "text": "..."
}
```

### `POST /chat`

Chat assistant for planning help.

Request body:

```json
{
  "message": "what should i do first?",
  "tone": "genz"
}
```

## Environment Variables

### Backend (`backend/.env`)

Required:

- `GROQ_API_KEY=your_groq_key`

Optional:

- `FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app`

### Frontend (Vercel project env)

Required for production:

- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain`

Local fallback is `http://localhost:8000`.

## Run Locally

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3003`

## Deployment Guide

### Backend (Render or Railway)

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Env vars:
  - `GROQ_API_KEY`
  - `FRONTEND_ORIGIN` (your frontend URL)

### Frontend (Vercel)

- Root directory: `frontend`
- Framework preset: Next.js
- Env var:
  - `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain`

## Validation Checklist

- `http://localhost:8000/docs` opens
- Upload PDF returns parsed JSON
- Paste text mode returns parsed JSON
- Dashboard shows assignments and risk levels
- Chat replies successfully
- Calendar adds manual tasks
- Chat quick-add command updates calendar
- ICS file downloads correctly

## Known Limitations

- OCR is not implemented for fully image-based scanned PDFs.
- Browser localStorage is device/browser-specific.
- AI extraction quality depends on syllabus formatting and text quality.

## Security Notes

- Never commit API keys.
- If a key was exposed during testing, revoke and rotate it immediately.

## Hackathon Summary

SyllabAI demonstrates a full pipeline:

`PDF/Text -> Parser -> LLM Structuring -> Risk Scoring -> Planner UI -> Calendar Export`

It combines practical student workflow design with production-style API and frontend integration.
