# How to Run SyllabAI

## What you need installed
- Python 3.10+
- Node.js 18+
- uv (`pip install uv`)

---

## Step 1 — Clone the repo

```bash
git clone https://github.com/typicaleoxx/syllabAI
cd syllabAI
```

---

## Step 2 — Start the backend

Open a terminal and run:

```bash
cd backend
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn main:app --reload
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

Leave this terminal open.

---

## Step 3 — Start the frontend

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000`

---

## Step 4 — Open it

Go to **http://localhost:3000** in your browser.

Upload any PDF → hit Analyze Syllabus → you'll see the dashboard.

---

## Sharing with teammates (optional)

If you want others to see it without them running anything, install ngrok and run:

```bash
ngrok http 3000
```

It'll give you a public link you can paste in the group chat.

---

## Quick sanity check

If something's not working:

- Backend not starting → make sure you're inside the `backend/` folder and the venv is activated
- Frontend not starting → make sure you ran `npm install` first
- Upload not working → check that the backend is running on port 8000
