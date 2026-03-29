# Karnova : the Krishi Officier

Offline-first agriculture workflow platform for farmers, officers, and admins.

## Stack
- **Frontend**: React (Vite), Tailwind CSS, Zustand, React Router
- **Backend**: FastAPI
- **Database**: MongoDB
- **Offline-first**: IndexedDB queue, service worker caching, background sync trigger

## Project Structure

```
src/
  components/
  pages/
  layouts/
  services/
  store/
  hooks/
  utils/
backend/app/
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

### 4) Start backend
```bash
npm run backend
```

### 5) Start frontend
```bash
npm run dev
```

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
