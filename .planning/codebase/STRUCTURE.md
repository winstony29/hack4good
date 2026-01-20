# Codebase Structure

**Analysis Date:** 2026-01-20

## Directory Layout

```
hack4good/
├── frontend/               # React SPA application
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── contexts/      # React Context providers
│   │   ├── mocks/         # Mock data for development
│   │   ├── pages/         # Page components (routes)
│   │   ├── services/      # API service functions
│   │   ├── constants/     # Shared constants
│   │   ├── styles/        # CSS modules
│   │   ├── utils/         # Utility functions
│   │   └── test/          # Test setup files
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Build configuration
├── backend/               # FastAPI Python backend
│   ├── app/               # Application code
│   │   ├── api/           # Route handlers
│   │   ├── core/          # Core config
│   │   ├── db/            # Database connection
│   │   ├── integrations/  # External service clients
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   ├── sql/               # Database schemas
│   ├── tests/             # Pytest tests
│   └── requirements.txt   # Python dependencies
└── .planning/             # Project planning docs
    └── codebase/          # Codebase analysis (this folder)
```

## Directory Purposes

**frontend/src/components/**
- Purpose: Reusable React components
- Contains: JSX components organized by feature
- Key files:
  - `activities/` - Activity cards, calendar, forms
  - `auth/` - Login forms, protected route wrapper
  - `dashboard/` - Role-specific dashboard views
  - `layout/` - Navbar, Layout wrapper
  - `shared/` - Button, Card, Modal, Input
  - `staff/` - Staff-only components (analytics, timetable)
  - `volunteer/` - Volunteer swiper components
  - `accessibility/` - TTS button, accessibility menu

**frontend/src/contexts/**
- Purpose: Global state via React Context
- Contains: Context providers
- Key files:
  - `AuthContext.jsx` - User authentication state
  - `AccessibilityContext.jsx` - Accessibility settings

**frontend/src/mocks/**
- Purpose: Mock data for development without backend
- Contains: Mock data generators and user switcher
- Key files:
  - `activities.mock.js` - Activity data
  - `registrations.mock.js` - Registration data
  - `users.mock.js` - User data
  - `userSwitcher.mock.js` - Dev tool to switch between mock users
  - `analytics.mock.js` - Analytics data

**frontend/src/pages/**
- Purpose: Top-level route components
- Contains: Page components
- Key files:
  - `Landing.jsx` - Home/landing page
  - `Dashboard.jsx` - Main dashboard
  - `Activities.jsx` - Activity listing
  - `Auth.jsx` - Login/signup page
  - `Profile.jsx` - User profile
  - `Swiper.jsx` - Volunteer activity swiper

**frontend/src/services/**
- Purpose: API communication layer
- Contains: API service functions
- Key files:
  - `activities.api.js` - Activity CRUD
  - `registrations.api.js` - Registration management
  - `supabase.js` - Supabase client setup
  - `accessibility.api.js` - TTS/translation

**backend/app/api/**
- Purpose: FastAPI route handlers
- Contains: API endpoint definitions
- Key files:
  - `router.py` - Main router aggregating all routes
  - `activities.py` - Activity endpoints
  - `registrations.py` - Registration endpoints
  - `auth.py` - Authentication endpoints
  - `matches.py` - Volunteer matching endpoints
  - `staff.py` - Staff-only endpoints
  - `notifications.py` - Notification endpoints
  - `accessibility.py` - TTS/translation endpoints

**backend/app/services/**
- Purpose: Business logic layer
- Contains: Service classes
- Key files:
  - `activity_service.py` - Activity operations
  - `registration_service.py` - Registration logic
  - `notification_service.py` - SMS/WhatsApp notifications
  - `analytics_service.py` - Analytics generation
  - `accessibility_service.py` - TTS/translation
  - `twilio_client.py` - Twilio SDK wrapper

**backend/app/models/**
- Purpose: Data models and schemas
- Contains: SQLAlchemy models, Pydantic schemas

**backend/app/core/**
- Purpose: Core configuration
- Contains: Settings, config classes

## Key File Locations

**Entry Points:**
- `frontend/src/main.jsx` - React app bootstrap
- `frontend/src/App.jsx` - Router and layout
- `backend/app/main.py` - FastAPI app setup

**Configuration:**
- `frontend/vite.config.js` - Vite build config
- `frontend/vitest.config.js` - Test config
- `frontend/tailwind.config.js` - Tailwind customization
- `frontend/.env.example` - Frontend env vars
- `backend/.env.example` - Backend env vars
- `backend/pytest.ini` - pytest config

**Core Logic:**
- `frontend/src/contexts/AuthContext.jsx` - Auth state
- `frontend/src/services/*.api.js` - API layer
- `backend/app/api/*.py` - API endpoints
- `backend/app/services/*.py` - Business logic

**Testing:**
- `frontend/src/**/*.test.jsx` - Component tests (co-located)
- `frontend/src/test/setup.js` - Test setup
- `backend/tests/` - Python tests

## Naming Conventions

**Files:**
- PascalCase.jsx - React components (`ActivityCard.jsx`)
- camelCase.api.js - API services (`activities.api.js`)
- camelCase.mock.js - Mock data (`users.mock.js`)
- snake_case.py - Python modules (`activity_service.py`)
- *.test.jsx - Frontend tests (co-located)

**Directories:**
- lowercase - All directories (`components`, `services`)
- Feature-based grouping in components (`activities/`, `staff/`)

**Special Patterns:**
- `*.api.js` - API service files
- `*.mock.js` - Mock data files
- `*.test.jsx` - Test files (co-located with source)

## Where to Add New Code

**New Feature Component:**
- Primary code: `frontend/src/components/{feature}/`
- Tests: Same directory as `{Component}.test.jsx`
- If page-level: `frontend/src/pages/{Page}.jsx`

**New API Endpoint:**
- Handler: `backend/app/api/{resource}.py`
- Register in: `backend/app/api/router.py`
- Service logic: `backend/app/services/{resource}_service.py`

**New Mock Data:**
- Location: `frontend/src/mocks/{resource}.mock.js`
- Export from mock index if pattern exists

**New Context:**
- Location: `frontend/src/contexts/{Name}Context.jsx`
- Wrap in App.jsx

**Utilities:**
- Frontend: `frontend/src/utils/`
- Backend: `backend/app/utils/`

## Special Directories

**frontend/node_modules/**
- Purpose: npm dependencies
- Source: Auto-generated by npm install
- Committed: No (gitignored)

**backend/venv/**
- Purpose: Python virtual environment
- Source: Created by python -m venv
- Committed: No (gitignored)

**.planning/**
- Purpose: Project planning and codebase docs
- Source: Manual + GSD skill generated
- Committed: Yes

---

*Structure analysis: 2026-01-20*
*Update when directory structure changes*
