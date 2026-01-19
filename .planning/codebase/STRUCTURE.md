# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
hack4good/
├── frontend/               # React SPA application
│   ├── src/               # Source code
│   │   ├── components/    # React components by domain
│   │   ├── contexts/      # React Context providers
│   │   ├── mocks/         # Mock data for development
│   │   ├── pages/         # Route-level page components
│   │   ├── services/      # API clients and services
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   ├── index.html         # HTML entry point
│   ├── package.json       # NPM dependencies
│   ├── vite.config.js     # Vite build config
│   └── tailwind.config.js # Tailwind CSS config
├── backend/               # FastAPI backend application
│   ├── app/               # Application code
│   │   ├── api/           # API route handlers
│   │   ├── core/          # Core config, auth, deps
│   │   ├── db/            # Database models and session
│   │   ├── integrations/  # Third-party service clients
│   │   ├── models/        # Pydantic schemas
│   │   ├── services/      # Business logic services
│   │   └── utils/         # Utility functions
│   ├── sql/               # SQL schema files
│   └── requirements.txt   # Python dependencies
├── .planning/             # Planning documents
└── README.md              # Project documentation
```

## Directory Purposes

**frontend/src/components/**
- Purpose: Reusable React components organized by domain
- Contains: JSX component files
- Key subdirectories:
  - `accessibility/` - A11y menu, TTS button
  - `activities/` - Calendar, cards, modals, forms
  - `auth/` - AuthForm, ProtectedRoute
  - `dashboard/` - Role-specific dashboards, registrations list
  - `layout/` - Layout wrapper, Navbar
  - `shared/` - Button, Card, Input, Modal, Spinner, Badge, EmptyState
  - `staff/` - Activity manager, analytics, attendance
  - `volunteer/` - Activity swiper

**frontend/src/contexts/**
- Purpose: React Context providers for global state
- Contains: `AuthContext.jsx`, `AccessibilityContext.jsx`
- Pattern: Context + Provider + useHook

**frontend/src/mocks/**
- Purpose: Mock data for frontend development without backend
- Contains: `activities.mock.js`, `users.mock.js`, `registrations.mock.js`, `userSwitcher.mock.js`, `volunteerMatches.mock.js`
- Usage: Imported when `USE_MOCK_DATA = true` in AuthContext

**frontend/src/pages/**
- Purpose: Top-level page components for routes
- Contains: `Landing.jsx`, `Auth.jsx`, `Dashboard.jsx`, `Activities.jsx`, `Profile.jsx`, `NotFound.jsx`

**frontend/src/services/**
- Purpose: API communication layer
- Contains: `api.js` (base axios), `supabase.js`, domain APIs (`auth.api.js`, `activities.api.js`, etc.)
- Key file: `API_REFERENCE.js` - Documents backend API endpoints

**frontend/src/utils/**
- Purpose: Shared utility functions
- Contains: `constants.js`, `dateUtils.js`, `roleUtils.js`, `activityUtils.js`, `validators.js`

**backend/app/api/**
- Purpose: FastAPI route handlers
- Contains: `router.py` (main router), domain routes (`activities.py`, `auth.py`, `registrations.py`, etc.)

**backend/app/core/**
- Purpose: Core application config and utilities
- Contains: `config.py` (settings), `auth.py` (JWT handling), `deps.py` (dependencies), `enums.py` (role/status enums)

**backend/app/db/**
- Purpose: Database layer (SQLAlchemy)
- Contains: `models.py` (ORM models), `session.py` (DB session), `base.py` (declarative base)

**backend/app/integrations/**
- Purpose: Third-party service client wrappers
- Contains: `twilio_client.py`, `elevenlabs_client.py`, `google_translate.py`

**backend/app/models/**
- Purpose: Pydantic schemas for API validation
- Contains: `user.py`, `activity.py`, `registration.py`, `notification.py`, `base.py`

**backend/app/services/**
- Purpose: Business logic layer
- Contains: `activity_service.py`, `registration_service.py`, `notification_service.py`, `accessibility_service.py`, `analytics_service.py`, `base_service.py`

## Key File Locations

**Entry Points:**
- `frontend/src/main.jsx` - React app entry
- `frontend/src/App.jsx` - App component with routing
- `backend/app/main.py` - FastAPI app entry

**Configuration:**
- `frontend/vite.config.js` - Vite build config with API proxy
- `frontend/tailwind.config.js` - Tailwind customization
- `backend/app/core/config.py` - Backend settings via pydantic-settings

**Core Logic:**
- `frontend/src/contexts/AuthContext.jsx` - User authentication state
- `frontend/src/services/api.js` - Axios instance with auth interceptor
- `backend/app/db/models.py` - Database ORM models
- `backend/app/api/router.py` - API route aggregation

**Testing:**
- No test files found in frontend
- Backend: pytest configured (`backend/requirements.txt`)

**Documentation:**
- `README.md` - Project documentation

## Naming Conventions

**Files:**
- PascalCase.jsx: React components (`Button.jsx`, `AuthForm.jsx`)
- camelCase.js: Utilities and services (`dateUtils.js`, `api.js`)
- domain.api.js: API service files (`activities.api.js`)
- snake_case.py: Python modules (`activity_service.py`)

**Directories:**
- kebab-case: All directories (`frontend/src/components/`)
- Plural for collections: `pages/`, `services/`, `mocks/`, `models/`

**Special Patterns:**
- `*.mock.js`: Mock data files
- `*.api.js`: API service files

## Where to Add New Code

**New Page:**
- Implementation: `frontend/src/pages/NewPage.jsx`
- Route: Add to `frontend/src/App.jsx`

**New Component:**
- Shared: `frontend/src/components/shared/ComponentName.jsx`
- Domain-specific: `frontend/src/components/{domain}/ComponentName.jsx`

**New API Endpoint (Frontend):**
- Implementation: `frontend/src/services/{domain}.api.js`
- Add to `API_REFERENCE.js` for documentation

**New API Route (Backend):**
- Handler: `backend/app/api/{domain}.py`
- Register in: `backend/app/api/router.py`
- Models: `backend/app/models/{domain}.py`

**New Service (Backend):**
- Implementation: `backend/app/services/{domain}_service.py`

**New Integration:**
- Client: `backend/app/integrations/{service}_client.py`

**Utilities:**
- Frontend: `frontend/src/utils/{name}.js`
- Backend: `backend/app/utils/{name}.py`

## Special Directories

**frontend/src/mocks/**
- Purpose: Development mock data
- Source: Manually created for testing
- Committed: Yes
- Note: Enabled via `USE_MOCK_DATA` flag in AuthContext

**backend/sql/**
- Purpose: Database schema initialization
- Contains: `init_schema.sql`
- Usage: Run manually for DB setup

**.planning/**
- Purpose: Project planning documents
- Source: Generated by GSD workflow
- Committed: Yes

---

*Structure analysis: 2026-01-19*
*Update when directory structure changes*
