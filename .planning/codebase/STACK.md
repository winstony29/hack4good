# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- Python 3.x - Backend API (`backend/app/`)
- JavaScript (ES6+) - Frontend React application (`frontend/src/`)

**Secondary:**
- SQL - Database migrations and schema (`backend/sql/`)

## Runtime

**Environment:**
- Python 3.x with FastAPI for backend
- Node.js for frontend development and build tooling
- Vite dev server on port 5173

**Package Manager:**
- pip with `requirements.txt` (`backend/requirements.txt`)
- npm with `package-lock.json` (`frontend/package.json`)

## Frameworks

**Core:**
- FastAPI 0.104.1 - Python web framework for REST API (`backend/app/main.py`)
- React 18.2.0 - Frontend UI framework (`frontend/src/`)
- SQLAlchemy 2.0.23 - Python ORM (`backend/app/db/`)

**Testing:**
- Vitest 4.0.17 - Frontend unit tests (`frontend/src/**/*.test.jsx`)
- Playwright 1.57.0 - E2E testing (`frontend/`)
- Pytest 7.4.3 - Backend unit/integration tests (`backend/tests/`)
- React Testing Library 16.3.1 - React component testing

**Build/Dev:**
- Vite 5.0.8 - Frontend bundler (`frontend/vite.config.js`)
- Uvicorn 0.24.0 - ASGI server for FastAPI
- Tailwind CSS 3.4.0 - Utility-first CSS (`frontend/tailwind.config.js`)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.38.5 - Frontend Supabase client (`frontend/src/services/supabase.js`)
- supabase 2.0.0 - Backend Supabase SDK
- axios 1.6.2 - HTTP client for API calls (`frontend/src/services/api.js`)
- react-router-dom 6.20.1 - Client-side routing
- pydantic-settings 2.1.0 - Backend configuration management (`backend/app/core/config.py`)

**Infrastructure:**
- python-jose 3.3.0 - JWT token handling
- passlib 1.7.4 - Password hashing
- alembic 1.12.1 - Database migrations

**UI:**
- @fullcalendar/react 6.1.10 - Activity calendar component
- framer-motion 10.16.16 - Animations
- lucide-react 0.294.0 - Icon library
- react-hot-toast 2.4.1 - Toast notifications
- recharts 2.10.3 - Charts for analytics

**Accessibility/Integrations:**
- twilio 8.10.0 - SMS/WhatsApp notifications
- elevenlabs 0.2.26 - Text-to-speech
- google-cloud-translate 3.12.1 - Translation services

## Configuration

**Environment:**
- `.env` files for both frontend and backend (gitignored)
- `backend/.env.example` - Backend env template
- Key vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET_KEY`
- Frontend vars via `VITE_*` prefix (`VITE_SUPABASE_URL`, `VITE_API_BASE_URL`)

**Build:**
- `frontend/vite.config.js` - Vite configuration with proxy to backend
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/postcss.config.js` - PostCSS configuration
- `backend/pytest.ini` - Pytest configuration

## Platform Requirements

**Development:**
- Any platform (Windows, macOS, Linux)
- Python 3.x with pip
- Node.js with npm
- PostgreSQL database (local or Supabase)

**Production:**
- Backend: Any platform supporting Python/FastAPI
- Frontend: Static hosting (Vercel, Netlify, etc.)
- Database: Supabase (PostgreSQL)

---

*Stack analysis: 2026-01-19*
*Update after major dependency changes*
