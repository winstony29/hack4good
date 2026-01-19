# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**Authentication:**
- Supabase Auth - User authentication and session management
  - SDK/Client: `@supabase/supabase-js` v2.38.5 (frontend), `supabase` v2.0.0 (backend)
  - Auth: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` env vars
  - Implementation: `frontend/src/services/supabase.js`, `frontend/src/contexts/AuthContext.jsx`

**SMS/WhatsApp Notifications:**
- Twilio - SMS and WhatsApp message delivery
  - SDK/Client: `twilio` v8.10.0 (`backend/requirements.txt`)
  - Auth: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_WHATSAPP_NUMBER`
  - Implementation: `backend/app/integrations/twilio_client.py`, `backend/app/services/notification_service.py`
  - Status: Not yet implemented (TODO comments in code)

**Text-to-Speech:**
- ElevenLabs - Accessibility text-to-speech feature
  - SDK/Client: `elevenlabs` v0.2.26 (`backend/requirements.txt`)
  - Auth: `ELEVENLABS_API_KEY` env var
  - Implementation: `backend/app/integrations/elevenlabs_client.py`, `backend/app/services/accessibility_service.py`
  - Status: Not yet implemented (TODO comments in code)

**Translation:**
- Google Cloud Translate - Multi-language support (English, Mandarin, Malay, Tamil)
  - SDK/Client: `google-cloud-translate` v3.12.1 (`backend/requirements.txt`)
  - Auth: `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_PROJECT_ID` env vars
  - Implementation: `backend/app/integrations/google_translate.py`, `backend/app/services/accessibility_service.py`
  - Status: Not yet implemented (TODO comments in code)

## Data Storage

**Databases:**
- PostgreSQL via Supabase - Primary data store
  - Connection: `DATABASE_URL` env var
  - Client: SQLAlchemy 2.0.23 (`backend/app/db/models.py`)
  - Migrations: Alembic 1.12.1 (`backend/requirements.txt`)
  - Tables: `users`, `activities`, `registrations`, `volunteer_matches` (`backend/app/db/models.py`)

**File Storage:**
- Not detected

**Caching:**
- Not detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password authentication
  - Implementation: Supabase client SDK
  - Token storage: Session via Supabase SDK
  - Session management: JWT tokens validated by backend
  - Files: `frontend/src/contexts/AuthContext.jsx`, `backend/app/core/auth.py`

**OAuth Integrations:**
- Not detected

**Mock Mode:**
- Development uses mock data (`USE_MOCK_DATA = true` in `frontend/src/contexts/AuthContext.jsx`)
- Mock users defined in `frontend/src/mocks/userSwitcher.mock.js`

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Analytics:**
- Not detected

**Logs:**
- Console logging only (stdout/stderr)

## CI/CD & Deployment

**Hosting:**
- Not configured

**CI Pipeline:**
- Not detected

## Environment Configuration

**Development:**
- Required env vars:
  - Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`
  - Backend: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET_KEY`
- Secrets location: `.env` files (gitignored)
- Mock mode: Frontend operates with mock data by default

**Staging:**
- Not configured

**Production:**
- Not configured

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Planned: SMS notifications via Twilio (not yet implemented)
- Planned: WhatsApp notifications via Twilio (not yet implemented)

---

*Integration audit: 2026-01-19*
*Update when adding/removing external services*
