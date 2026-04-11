# SyllabAI — AI-Powered Syllabus Intelligence System

## 1. Overview

SyllabAI is a full-stack hackathon project that analyzes syllabus PDFs and converts them into structured, actionable insights.

Core idea:
Students struggle to track deadlines hidden in long syllabus documents. This system extracts assignments, exams, and deadlines, then highlights urgency using risk levels.

---

## 2. Problem

Real-world issue:
- Syllabus PDFs are long and unstructured
- Important deadlines are easy to miss
- Students manually track everything

Technical problem:
PDF (unstructured text)
-> No structured format
-> No automation possible

---

## 3. Solution

System flow:
Upload PDF
-> Extract text
-> AI extracts key information
-> Risk engine computes urgency
-> Frontend displays results

Example output:
{
  "assignments": [
    {
      "name": "Midterm Exam",
      "due": "2026-04-20",
      "risk": "HIGH"
    }
  ]
}

---

## 4. Tech Stack

Frontend:
- Next.js
- Tailwind CSS
- shadcn/ui

Backend:
- FastAPI (Python)

AI Layer:
- Gemini API or OpenAI

Parsing:
- PyPDF2

---

## 5. Project Structure

syllab-ai/

frontend/
- app/
  - page.tsx
  - components/
    - Dropzone.tsx
    - Timeline.tsx
    - RiskPanel.tsx
    - Loader.tsx
- lib/api.ts
- types/index.ts

backend/
- main.py
- routes/upload.py
- services/
  - parser.py
  - ai_parser.py
  - risk_engine.py
- models/schema.py
- requirements.txt

README.md
.env

---

## 6. System Architecture

User
-> Frontend (Next.js)
-> FastAPI Backend
-> Parser -> AI -> Risk Engine
-> JSON Response
-> UI Display

---

## 7. Development Plan

Phase 1:
- Setup frontend and backend

Phase 2:
- Create /upload endpoint
- Return mock JSON

Phase 3:
- Connect frontend to backend

Phase 4:
- Extract text from PDF

Phase 5:
- AI converts text to structured JSON

Phase 6:
- Risk engine assigns HIGH / MEDIUM / LOW

Phase 7:
- Display results in UI

---

## 8. Team Distribution

Backend:
- API
- parser
- risk engine

Frontend:
- UI
- upload
- display

AI + Integration:
- AI extraction
- debugging
- connecting everything

---

## 9. Execution Timeline

0–2 hours:
- Setup + backend API

2–4 hours:
- Frontend + API connection

4–6 hours:
- Parser + mock AI

6–8 hours:
- AI + risk engine

After:
- Polish + demo

---

## 10. API Contract

Endpoint:
POST /upload

Request:
- file (PDF)

Response:
{
  "assignments": [
    {
      "name": "HW1",
      "due": "2026-05-01",
      "risk": "HIGH"
    }
  ]
}

---

## 11. UI Design

Single page layout:

Title: SyllabAI
Upload your syllabus
[ Upload Box ]

Timeline | Risk Panel
HW1      | HIGH
Quiz     | MEDIUM

Color mapping:
- HIGH = red
- MEDIUM = yellow
- LOW = green

---

## 12. How to Run

Backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend:
cd frontend
npm install
npm run dev

---

## 13. Debugging Checklist

- CORS error -> add middleware
- Empty response -> check parser output
- API not called -> verify URL
- File not reading -> check UploadFile usage

---

## 14. Future Improvements

- Multiple syllabus support
- Calendar integration
- Notifications
- Chat with syllabus (RAG)

---

## 15. Real-World Relevance

Software Engineering:
- full-stack systems
- API design
- AI integration

Cybersecurity:
Logs -> Parser -> AI -> Risk -> Dashboard

Used in:
- SIEM
- SOC automation
- threat analysis

---

## 16. Pitch

Students struggle to track deadlines hidden inside long syllabus PDFs.
SyllabAI uses AI to automatically extract assignments, predict urgency, and present a clear timeline with risk levels.
Instead of manually scanning documents, students get instant actionable insights.

---

## 17. Build Order (IMPORTANT)

Upload -> API -> Mock Response -> UI -> Parser -> AI -> Risk

Do not move forward unless each step works.