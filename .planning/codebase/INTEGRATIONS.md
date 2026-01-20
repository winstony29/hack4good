# External Integrations

**Analysis Date:** 2026-01-20

## APIs & External Services

**Authentication:**
- Supabase Auth - User authentication and session management
  - SDK/Client: `@supabase/supabase-js` v2.38 (frontend), `supabase` v2.0 (backend)
  - Auth: `SUPABASE_URL`, `SUPABASE_ANON_KEY` env vars
  - Implementation: `frontend/src/contexts/AuthContext.jsx`, `frontend/src/services/supabase.js`

**Text-to-Speech (Accessibility):**
- ElevenLabs API - Voice synthesis for accessibility features
  - SDK/Client: `elevenlabs` v0.2.26 (`backend/requirements.txt`)
  - Auth: `ELEVENLABS_API_KEY` env var (optional - mock mode available)
  - Implementation: `backend/app/services/accessibility_service.py`

**Translation:**
- Google Cloud Translate - Multi-language support
  - SDK/Client: `google-cloud-translate` v3.12.1 (`backend/requirements.txt`)
  - Auth: `GOOGLE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` env vars
  - Implementation: `backend/app/services/accessibility_service.py`

**Notifications:**
- Twilio - SMS and WhatsApp notifications
  - SDK/Client: `twilio` v8.10.0 (`backend/requirements.txt`)
  - Auth: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` env vars
  - Config: `USE_MOCK_NOTIFICATIONS=true` for development
  - Implementation: `backend/app/services/twilio_client.py`, `backend/app/services/notification_service.py`

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary data store
  - Connection: `DATABASE_URL` env var
  - Client: SQLAlchemy 2.0 ORM (`backend/app/db/`)
  - Models: `backend/app/models/`

**File Storage:**
- Not detected (no file upload functionality currently)

**Caching:**
- Not detected (no Redis or caching layer)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password authentication
  - Implementation: `frontend/src/contexts/AuthContext.jsx`
  - Token storage: Handled by Supabase client SDK
  - Session management: Supabase session handling

**Mock Auth:**
- Development mock system for testing different user roles
  - Implementation: `frontend/src/mocks/userSwitcher.mock.js`
  - Toggle: `USE_MOCK_DATA` in `AuthContext.jsx`

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry or similar configured)

**Analytics:**
- Internal analytics service (`backend/app/services/analytics_service.py`)
- Recharts for data visualization (`frontend/src/components/staff/AnalyticsCharts.jsx`)

**Logs:**
- Console logging (stdout/stderr)
- No external logging service detected

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured
- Frontend designed for static hosting (Vite build)
- Backend designed for ASGI hosting (uvicorn)

**CI Pipeline:**
- Not detected (no .github/workflows found)

## Environment Configuration

**Development:**
- Required env vars:
  - Frontend: `VITE_USE_MOCK_DATA`, `VITE_API_BASE_URL`
  - Backend: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET_KEY`
- Secrets location: `.env` files (gitignored), `.env.example` for reference
- Mock services: Mock mode available for TTS, translation, notifications, and auth

**Production:**
- Secrets management: Environment variables (configure in hosting platform)
- External services: Supabase, ElevenLabs, Google Cloud, Twilio

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Twilio webhooks for SMS/WhatsApp delivery status (if configured)

---

*Integration audit: 2026-01-20*
*Update when adding/removing external services*
