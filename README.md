# Karnova : the Krishi Officier

Offline-first agriculture workflow platform for farmers, officers, and admins.

## Stack
- **Frontend**: React (Vite), Tailwind CSS, Zustand, React Router
- **Backend**: FastAPI
- **Database**: MongoDB
- **Offline-first**: IndexedDB queue, service worker caching, background sync trigger

## Project Structure

```text
Karnova/
  src/
    components/
    pages/
    layouts/
    services/
    store/
  backend/
    .env
    app/
      auth/
      users/
      admin/
      officer/
      farmer/
      ai/
      sync/
```

## Environment

Frontend `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME="Karnova : the Krishi Officier"
```

Backend `backend/.env`:

```bash
MONGO_URI=mongodb://localhost:27017/karnova
JWT_SECRET=supersecretkey
AI_API_KEY=placeholder_key
STORAGE_TYPE=local
```

## Run Locally

### 1) Install frontend dependencies
```bash
npm install
```

### 2) Install backend dependencies
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 3) Start MongoDB locally
```bash
mongod --dbpath /data/db
```

### 4) Start backend (from repository root)
Use either command below:

```bash
npm run backend
```

```bash
uvicorn backend.app.main:app --reload --env-file backend/.env
```

### 5) Start frontend
```bash
npm run dev
```

### 6) Open API docs
```text
http://localhost:8000/docs
```

## Troubleshooting

- If backend startup reports missing `MONGO_URI`, `JWT_SECRET`, or `AI_API_KEY`, verify the file exists at **exactly** `backend/.env`.
- Always run Uvicorn from the repository root so module path `backend.app.main:app` resolves correctly.
- If your local checkout accidentally has nested directories (for example `Karnova/Karnova/backend`), move to a flat root layout (`Karnova/backend` and `Karnova/src`) before running commands.

## Key Features
- JWT login (email/phone/krishi-id as `identifier`)
- Role-aware navigation (admin/officer/farmer)
- Dark/Light mode with persisted preference
- AI query submission with offline queue fallback
- `/sync` endpoint for queued action processing
- Local file upload saved under `backend/uploads`
- Service worker shell cache for offline app availability

## Demo Credentials
- `admin@karnova.local` / `admin123`

This user is auto-seeded on first login attempt.
