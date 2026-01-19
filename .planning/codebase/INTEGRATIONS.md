# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**Authentication:**
- Supabase Auth - User authentication (email/password)
  - SDK/Client: `@supabase/supabase-js` in frontend (`frontend/src/services/supabase.js`)
  - SDK/Client: `supabase` Python SDK in backend
  - Auth: `SUPABASE_URL`, `SUPABASE_ANON_KEY` env vars
  - JWT tokens passed to backend API

**Notifications:**
- Twilio - SMS and WhatsApp notifications (`backend/app/integrations/twilio_client.py`)
  - SDK/Client: `twilio 8.10.0`
  - Auth: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` env vars
  - Config: `TWILIO_PHONE_NUMBER`, `TWILIO_WHATSAPP_NUMBER`
  - Mock mode available via `USE_MOCK_NOTIFICATIONS=true`

**Accessibility:**
- ElevenLabs - Text-to-speech for accessibility features
  - SDK/Client: `elevenlabs 0.2.26`
  - Auth: `ELEVENLABS_API_KEY` env var
  - Optional: Falls back to mock mode if not configured

- Google Cloud Translation - Multi-language support
  - SDK/Client: `google-cloud-translate 3.12.1`
  - Auth: `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_PROJECT_ID` env vars
  - Optional: Falls back to mock mode if not configured

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary data store
  - Connection: `DATABASE_URL` env var
  - Client: SQLAlchemy 2.0.23 ORM (`backend/app/db/`)
  - Models: `backend/app/db/models.py`
  - Base: `backend/app/db/base.py`, `backend/app/db/session.py`

**File Storage:**
- Not currently implemented (potential future Supabase Storage)

**Caching:**
- Not detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password authentication
  - Implementation: Supabase client SDK (`frontend/src/services/supabase.js`)
  - Context: `frontend/src/contexts/AuthContext.jsx`
  - Token storage: Supabase manages session
  - Session management: JWT tokens with refresh handled by Supabase
  - Mock mode: `USE_MOCK_DATA = true` in AuthContext for development

**Backend Auth:**
- JWT validation via `python-jose`
- Auth middleware: `backend/app/core/auth.py`
- Dependencies: `backend/app/core/deps.py`

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry or similar)

**Analytics:**
- Built-in analytics via `backend/app/services/analytics_service.py`
- Frontend charts: `frontend/src/components/staff/AnalyticsCharts.jsx`

**Logs:**
- Console logging only (stdout/stderr)

## CI/CD & Deployment

**Hosting:**
- Not configured (development only)

**CI Pipeline:**
- Not detected (no GitHub Actions or similar)

## Environment Configuration

**Development:**
- Required env vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET_KEY`
- Secrets location: `.env` files (gitignored), `.env.example` for reference
- Mock/stub services:
  - Mock auth via `USE_MOCK_DATA` flag (`frontend/src/contexts/AuthContext.jsx`)
  - Mock notifications via `USE_MOCK_NOTIFICATIONS` flag
  - Mock users: `frontend/src/mocks/userSwitcher.mock.js`

**Staging:**
- Not configured

**Production:**
- Not configured

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Twilio notifications (SMS/WhatsApp) triggered by activity events

---

*Integration audit: 2026-01-19*
*Update when adding/removing external services*
