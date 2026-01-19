# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- JavaScript (ES6+) - All frontend application code
- Python 3.x - All backend application code

**Secondary:**
- CSS - Styling via Tailwind CSS
- HTML - JSX templates

## Runtime

**Frontend Environment:**
- Node.js (no version constraint in `package.json`)
- Vite 5.0.8 dev server (port 5173)

**Backend Environment:**
- Python 3.x with FastAPI/Uvicorn (port 8000)
- ASGI server for async request handling

**Package Managers:**
- npm (frontend) - Lockfile: `frontend/package-lock.json`
- pip (backend) - Requirements: `backend/requirements.txt`

## Frameworks

**Frontend Core:**
- React 18.2.0 - UI framework (`frontend/package.json`)
- React Router DOM 6.20.1 - Client-side routing (`frontend/src/App.jsx`)
- Vite 5.0.8 - Build tool and dev server (`frontend/vite.config.js`)

**Backend Core:**
- FastAPI 0.104.1 - Web framework (`backend/requirements.txt`)
- Uvicorn 0.24.0 - ASGI server (`backend/requirements.txt`)
- SQLAlchemy 2.0.23 - ORM (`backend/app/db/models.py`)
- Alembic 1.12.1 - Database migrations (`backend/requirements.txt`)

**Testing:**
- Vitest 4.0.17 - Unit tests (`frontend/vitest.config.js`)
- React Testing Library 16.3.1 - Component testing (`frontend/package.json`)
- Playwright 1.57.0 - E2E tests (`frontend/playwright.config.js`)
- Pytest 7.4.3 - Backend tests (`backend/requirements.txt`)

**Build/Dev:**
- Vite with @vitejs/plugin-react 4.2.1 (`frontend/vite.config.js`)
- ESLint 8.55.0 - Linting (`frontend/package.json`)
- Tailwind CSS 3.4.0 - Styling (`frontend/tailwind.config.js`)
- PostCSS with Autoprefixer (`frontend/postcss.config.js`)

## Key Dependencies

**Frontend Critical:**
- @supabase/supabase-js 2.38.5 - Auth and database client (`frontend/src/services/supabase.js`)
- axios 1.6.2 - HTTP client (`frontend/src/services/api.js`)
- framer-motion 10.16.16 - Animations (`frontend/src/components/layout/PageTransition.jsx`)
- @fullcalendar/react 6.1.10 - Event calendar (`frontend/src/components/activities/ActivityCalendar.jsx`)
- recharts 2.10.3 - Charts (`frontend/src/components/staff/AnalyticsCharts.jsx`)
- lucide-react 0.294.0 - Icons
- react-hot-toast 2.4.1 - Toast notifications
- canvas-confetti 1.9.4 - Celebration effects

**Backend Critical:**
- pydantic-settings 2.1.0 - Settings management (`backend/app/core/config.py`)
- python-jose 3.3.0 - JWT handling (`backend/app/core/auth.py`)
- passlib 1.7.4 - Password hashing (`backend/requirements.txt`)
- supabase 2.0.0 - Auth integration (`backend/requirements.txt`)
- httpx 0.25.2 - Async HTTP client (`backend/requirements.txt`)

**Infrastructure:**
- PostgreSQL - Primary database (via SQLAlchemy)
- Supabase - Authentication provider

## Configuration

**Frontend Environment:**
- `.env` files with `VITE_` prefix (`frontend/.env.example`)
- Key vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`, `VITE_USE_MOCK_DATA`

**Backend Environment:**
- `.env` files loaded via python-dotenv (`backend/.env.example`)
- Key vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET_KEY`
- Optional: `ELEVENLABS_API_KEY`, `TWILIO_*`, `GOOGLE_*` credentials

**Build Configuration:**
- `frontend/vite.config.js` - Vite with API proxy to backend
- `frontend/tailwind.config.js` - Custom primary color palette, Inter font
- `frontend/vitest.config.js` - Test configuration with jsdom
- `frontend/playwright.config.js` - E2E test configuration

## Platform Requirements

**Development:**
- Node.js (any recent LTS version)
- Python 3.x
- PostgreSQL (or use Supabase hosted)
- Any platform (Windows/macOS/Linux)

**Production:**
- Frontend: Static hosting (Vercel, Netlify, etc.)
- Backend: Python ASGI hosting (Railway, Render, AWS Lambda)
- Database: PostgreSQL (Supabase recommended)
- External services: Supabase Auth, optional Twilio/ElevenLabs/Google Cloud

---

*Stack analysis: 2026-01-19*
*Update after major dependency changes*
