# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- JavaScript (JSX) - All frontend application code
- Python 3.x - All backend application code

**Secondary:**
- CSS - Styling via Tailwind CSS utility classes
- SQL - Database schema and queries

## Runtime

**Environment:**
- Node.js - Frontend development and build
- Python 3.x - Backend API server
- Browser - React SPA execution

**Package Manager:**
- npm - Frontend dependencies (`frontend/package.json`)
- pip - Backend dependencies (`backend/requirements.txt`)
- Lockfile: `package-lock.json` present (frontend)

## Frameworks

**Core:**
- React 18.2.0 - UI framework (`frontend/package.json`)
- FastAPI 0.104.1 - Python web framework (`backend/requirements.txt`)

**Testing:**
- pytest 7.4.3 - Backend testing (`backend/requirements.txt`)
- No frontend testing framework configured

**Build/Dev:**
- Vite 5.0.8 - Frontend build tool (`frontend/vite.config.js`)
- ESLint 8.55.0 - JavaScript linting (`frontend/package.json`)
- uvicorn 0.24.0 - ASGI server (`backend/requirements.txt`)

## Key Dependencies

**Frontend Critical:**
- react-router-dom 6.20.1 - Client-side routing (`frontend/package.json`)
- @supabase/supabase-js 2.38.5 - Supabase client for auth (`frontend/src/services/supabase.js`)
- axios 1.6.2 - HTTP client (`frontend/src/services/api.js`)
- tailwindcss 3.4.0 - Utility-first CSS (`frontend/tailwind.config.js`)
- framer-motion 10.16.16 - Animations (`frontend/package.json`)
- @fullcalendar/react 6.1.10 - Calendar component (`frontend/package.json`)
- recharts 2.10.3 - Charts library (`frontend/package.json`)
- lucide-react 0.294.0 - Icon library (`frontend/package.json`)
- react-hot-toast 2.4.1 - Toast notifications (`frontend/src/App.jsx`)

**Backend Critical:**
- supabase 2.0.0 - Supabase client (`backend/requirements.txt`)
- sqlalchemy 2.0.23 - ORM (`backend/app/db/models.py`)
- pydantic-settings 2.1.0 - Settings management (`backend/app/core/config.py`)
- python-jose 3.3.0 - JWT handling (`backend/requirements.txt`)
- twilio 8.10.0 - SMS/WhatsApp notifications (`backend/requirements.txt`)
- elevenlabs 0.2.26 - Text-to-speech (`backend/requirements.txt`)
- google-cloud-translate 3.12.1 - Translation (`backend/requirements.txt`)
- alembic 1.12.1 - Database migrations (`backend/requirements.txt`)

## Configuration

**Environment:**
- Frontend: Vite env vars via `import.meta.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`)
- Backend: `.env` file via pydantic-settings (`backend/app/core/config.py`)
- Key configs: `DATABASE_URL`, `SUPABASE_URL`, `JWT_SECRET_KEY`, `TWILIO_*`, `ELEVENLABS_API_KEY`

**Build:**
- `frontend/vite.config.js` - Vite configuration with API proxy
- `frontend/tailwind.config.js` - Tailwind CSS customization
- `frontend/postcss.config.js` - PostCSS configuration

## Platform Requirements

**Development:**
- Any platform with Node.js and Python
- No Docker configuration found
- Manual setup required for frontend and backend

**Production:**
- Not yet configured
- Backend designed to run on any Python host
- Frontend builds to static assets

---

*Stack analysis: 2026-01-19*
*Update after major dependency changes*
