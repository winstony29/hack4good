# Technology Stack

**Analysis Date:** 2026-01-20

## Languages

**Primary:**
- JavaScript/JSX - All frontend application code (`frontend/src/**/*.jsx`)
- Python 3.x - All backend application code (`backend/app/**/*.py`)

**Secondary:**
- CSS - Styling with Tailwind (`frontend/src/index.css`)
- SQL - Database schemas (`backend/sql/`)

## Runtime

**Environment:**
- Node.js (LTS) - Frontend build and dev server
- Python 3.x - Backend API server
- PostgreSQL - Primary database

**Package Manager:**
- npm - Frontend (`frontend/package-lock.json` present)
- pip - Backend (`backend/requirements.txt`)

## Frameworks

**Core:**
- React 18.2 - UI framework (`frontend/package.json`)
- FastAPI 0.104 - Python web framework (`backend/requirements.txt`)
- Vite 5.0 - Frontend build tool and dev server (`frontend/vite.config.js`)

**Testing:**
- Vitest 4.0 - Frontend unit tests (`frontend/vitest.config.js`)
- Playwright 1.57 - E2E testing (`frontend/playwright.config.js`)
- React Testing Library - Component testing (`frontend/package.json`)
- pytest 7.4 - Backend tests (`backend/pytest.ini`)

**Build/Dev:**
- Vite 5.0 - Frontend bundling (`frontend/vite.config.js`)
- uvicorn 0.24 - ASGI server (`backend/requirements.txt`)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.38 - Auth and database client (`frontend/package.json`)
- supabase 2.0 - Python Supabase client (`backend/requirements.txt`)
- react-router-dom 6.20 - Client-side routing (`frontend/package.json`)
- SQLAlchemy 2.0 - Python ORM (`backend/requirements.txt`)

**UI/UX:**
- tailwindcss 3.4 - Utility CSS framework (`frontend/tailwind.config.js`)
- framer-motion 10.16 - Animations (`frontend/package.json`)
- lucide-react 0.294 - Icon library (`frontend/package.json`)
- react-hot-toast 2.4 - Toast notifications (`frontend/package.json`)
- @fullcalendar/react 6.1 - Calendar component (`frontend/package.json`)
- recharts 2.10 - Data visualization (`frontend/package.json`)

**Backend Integrations:**
- twilio 8.10 - SMS/WhatsApp notifications (`backend/requirements.txt`)
- elevenlabs 0.2 - Text-to-speech (`backend/requirements.txt`)
- google-cloud-translate 3.12 - Translation service (`backend/requirements.txt`)

## Configuration

**Environment:**
- `.env` files for both frontend and backend
- Frontend: `VITE_USE_MOCK_DATA`, `VITE_API_BASE_URL` (`frontend/.env.example`)
- Backend: `DATABASE_URL`, `SUPABASE_URL`, `JWT_SECRET_KEY`, etc. (`backend/.env.example`)

**Build:**
- `frontend/vite.config.js` - Vite bundler config with API proxy
- `frontend/vitest.config.js` - Test runner config
- `frontend/tailwind.config.js` - Tailwind CSS customization
- `frontend/postcss.config.js` - PostCSS processing
- `backend/pytest.ini` - pytest configuration

## Platform Requirements

**Development:**
- Any platform with Node.js and Python
- PostgreSQL database (local or Supabase)
- No Docker required (uses venv for Python)

**Production:**
- Frontend: Static hosting (Vercel, Netlify, etc.)
- Backend: Python ASGI server (uvicorn)
- Database: PostgreSQL (Supabase hosted)

---

*Stack analysis: 2026-01-20*
*Update after major dependency changes*
