# SyllabAI

SyllabAI is an AI-powered planner that turns syllabus PDFs or pasted syllabus text into structured deadlines, risk levels, weekly study plans, and calendar exports.

## What It Does

Upload a syllabus PDF or paste your syllabus text and SyllabAI pulls out every assignment, exam, and deadline automatically. It figures out the risk level of each item based on how soon it is and how much it is worth, then builds you a dashboard with a today focus, weekly plan, and upcoming view. You can also chat with an AI coach, add tasks to a calendar, and export everything as an ICS file for Google Calendar, Apple Calendar, or Outlook.

## Tech Stack

The frontend is built with Next.js 14, React 18, TypeScript, and Tailwind CSS. The backend runs on FastAPI with Uvicorn. AI extraction uses the Groq API with llama models, and PDF text extraction uses PyPDF2. Everything is stored in browser localStorage so there is no database needed.

## Project Structure

```text
syllabAI/
  backend/
    main.py
    requirements.txt
    models/schema.py
    routes/upload.py
    routes/chat.py
    services/parser.py
    services/ai_parser.py

  frontend/
    app/
      page.tsx
      layout.tsx
      calendar/page.tsx
      syllabi/page.tsx
      components/
    lib/
      api.ts  storage.ts  ics.ts  tone.ts
    types/index.ts
```

## API Endpoints

`GET /` returns a health check confirming the backend is running.

`POST /upload` accepts a multipart PDF file and returns parsed assignments and contacts.

`POST /parse-text` accepts a JSON body with a `text` field and returns the same structure.

`POST /chat` accepts a `message` and a `tone` field (genz, direct, or practical) and returns an AI reply.

## Environment Variables

**Backend** — create `backend/.env` with:

```
GROQ_API_KEY=your_groq_key
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

**Frontend** — set this in your Vercel project environment variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-render-backend.onrender.com
```

Locally the frontend falls back to `http://localhost:8000` automatically.

## Running Locally

Start the backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3003` and the backend API docs are at `http://localhost:8000/docs`.

## Deployment

The repo includes a `render.yaml` that handles the Render configuration automatically. Just connect the repo in Render and it will use the right root directory, build command, and start command.

For Vercel, set the root directory to `frontend` and add the `NEXT_PUBLIC_API_BASE_URL` environment variable pointing to your Render backend URL. Everything else is picked up automatically.

## Deployment Errors We Hit

Getting this to work on Vercel and Render took some debugging. Here are the actual things that broke and how we fixed them, in case you run into the same issues.

**The backend was unreachable from the outside world.** When we first deployed to Render, every request timed out. The problem was that Uvicorn was starting with the default host binding, which is `127.0.0.1`. That means it only listens on localhost inside the container and Render cannot route external traffic to it. The fix is to always start with `--host 0.0.0.0 --port $PORT`. Render assigns the port dynamically through the `$PORT` environment variable, so hardcoding `8000` also silently breaks things.

**The frontend threw an error the moment it loaded on Vercel.** The API base URL logic checks if you are on a non-localhost hostname and throws if `NEXT_PUBLIC_API_BASE_URL` is not set. We had not added that variable to the Vercel project settings yet, so the app crashed on every page load before any user action. Once we set it in Vercel under Settings > Environment Variables and redeployed, it went away.

**The backend crashed immediately on Render even though it looked deployed.** The `GROQ_API_KEY` check runs at module import time, meaning the whole process exits with a runtime error if the key is missing. Since the `.env` file is gitignored and never pushed, Render had no key at all. We set `GROQ_API_KEY` directly in the Render environment variables dashboard and restarted the service.

**CORS was blocking every request from the frontend.** Even after the above fixes, browser requests were getting blocked. The backend only allows origins listed in `FRONTEND_ORIGIN` plus a regex that matches `*.vercel.app`. We had not set `FRONTEND_ORIGIN` on Render, so requests from any custom domain or preview URL outside that regex were rejected. Setting `FRONTEND_ORIGIN` to the exact Vercel URL fixed it.

**Render spins down free tier services after inactivity.** The first request after the service sleeps takes 30 to 60 seconds and usually times out in the browser. We added a `pingBackend` call that fires silently when the chat component mounts, so by the time the user actually sends a message the backend is already awake.

## Known Limitations

Scanned or image-only PDFs will not work because there is no OCR layer. Everything is stored in localStorage so it is device and browser specific. AI extraction quality depends on how well formatted the original syllabus is.

## Security

Never commit your Groq API key. If a key was accidentally exposed, revoke it immediately in the Groq dashboard and generate a new one.
