# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**Authentication:**
- Supabase Auth - User authentication and session management
  - Frontend Client: `frontend/src/services/supabase.js`
  - Backend Integration: `backend/app/core/auth.py`
  - SDK: @supabase/supabase-js 2.38.5 (frontend), supabase 2.0.0 (backend)
  - Auth: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (frontend), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` (backend)
  - Features: Email/password login, JWT sessions, role-based access

**SMS/WhatsApp Notifications:**
- Twilio - SMS and WhatsApp messaging
  - Client: `backend/app/integrations/twilio_client.py`
  - Auth: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_WHATSAPP_NUMBER`
  - Features: Send SMS, send WhatsApp messages
  - Mock mode: Falls back to mock when credentials unavailable

**Text-to-Speech:**
- ElevenLabs - Multilingual TTS for accessibility
  - Client: `backend/app/integrations/elevenlabs_client.py`
  - Auth: `ELEVENLABS_API_KEY`
  - Features: Generate speech from text in en, zh, ms, ta languages
  - Voice: Rachel (multilingual model, ID: 21m00Tcm4TlvDq8ikWAM)
  - Returns: Base64-encoded MP3 data URL
  - Mock mode: Returns mock audio when API key unavailable

**Translation:**
- Google Cloud Translation - Language translation
  - Client: `backend/app/integrations/google_translate.py`
  - Auth: `GOOGLE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`
  - Features: Translate between English, Mandarin, Malay, Tamil
  - Mock mode: Returns mock translations when credentials unavailable

## Data Storage

**Databases:**
- PostgreSQL - Primary data store
  - Connection: `DATABASE_URL` env var
  - Client: SQLAlchemy 2.0.23 ORM (`backend/app/db/session.py`)
  - Models: `backend/app/db/models.py`
  - Migrations: Alembic 1.12.1 (`backend/alembic/`)

**Tables:**
- `users` - User accounts with roles (participant, volunteer, staff)
- `activities` - Volunteer activities with capacity tracking
- `registrations` - User activity registrations
- `volunteer_matches` - Volunteer-to-activity assignments
- `notifications` - SMS/WhatsApp notification records

**File Storage:**
- Not currently implemented (no file uploads)

**Caching:**
- None currently (all database queries)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Primary authentication
  - Implementation: Supabase client SDK on both frontend and backend
  - Token storage: Supabase session management (httpOnly cookies via @supabase/ssr)
  - Session management: JWT refresh tokens handled by Supabase
  - Backend validation: `backend/app/core/auth.py` validates JWT tokens

**Role-Based Access:**
- Three roles: `participant`, `volunteer`, `staff`
- Role guards: `get_current_staff()`, `get_current_volunteer()`, `get_current_participant()`
- Frontend protection: `frontend/src/components/auth/ProtectedRoute.jsx`

## Monitoring & Observability

**Error Tracking:**
- None configured (logs to stdout/stderr)

**Analytics:**
- None (planned feature)

**Logs:**
- Print statements in backend (should migrate to proper logging)
- Console.log in frontend for debugging

## CI/CD & Deployment

**Hosting:**
- Not specified (development only currently)
- Recommended: Vercel (frontend), Railway/Render (backend)

**CI Pipeline:**
- Not configured (no GitHub Actions workflows detected)

## Environment Configuration

**Development:**
- Required frontend vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Required backend vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET_KEY`
- Optional integrations: Twilio, ElevenLabs, Google Cloud (fall back to mock mode)
- Mock data: `VITE_USE_MOCK_DATA=true` enables frontend mock mode
- Secrets location: `.env.local` (gitignored)

**Staging:**
- Not currently configured

**Production:**
- Same env vars as development
- Requires real credentials for Twilio, ElevenLabs, Google Cloud
- Requires production PostgreSQL database

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured

---

*Integration audit: 2026-01-19*
*Update when adding/removing external services*
