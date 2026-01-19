# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
hack4good/
├── .claude/                    # Claude Code configuration
├── .planning/                  # Project planning documents
│   └── codebase/              # Codebase analysis documents
├── backend/                    # Python FastAPI backend
│   ├── app/                   # Application code
│   │   ├── api/              # Route handlers
│   │   ├── core/             # Configuration, auth, deps
│   │   ├── db/               # Database models, session
│   │   ├── integrations/     # External service clients
│   │   ├── models/           # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   ├── sql/                   # SQL scripts
│   └── tests/                 # Backend tests
│       ├── integration/      # Integration tests
│       └── unit/             # Unit tests
├── frontend/                   # React Vite frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── accessibility/  # TTS, accessibility menu
│   │   │   ├── activities/     # Activity-related components
│   │   │   ├── auth/           # Auth form, protected route
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── shared/         # Reusable UI components
│   │   │   └── staff/          # Staff management components
│   │   ├── contexts/         # React contexts (AuthContext)
│   │   ├── mocks/            # Mock data for development
│   │   ├── pages/            # Page components
│   │   ├── services/         # API clients
│   │   └── utils/            # Utility functions
│   └── node_modules/         # npm dependencies
├── ACTIVITIES_IMPLEMENTATION.md  # Feature documentation
├── DEMO_SCRIPT.md                # Demo walkthrough
├── INTEGRATION_CHECKLIST.md      # Integration status
├── README.md                     # Project documentation
├── REFINED_ARCHITECTURE.md       # Architecture decisions
└── TEAM_WORKFLOW.md              # Development workflow
```

## Directory Purposes

**backend/app/api/**
- Purpose: FastAPI route handlers organized by domain
- Contains: `auth.py`, `activities.py`, `registrations.py`, `matches.py`, `notifications.py`, `staff.py`, `accessibility.py`
- Key files: `router.py` - aggregates all routers
- Pattern: One file per API domain

**backend/app/core/**
- Purpose: Core application configuration and middleware
- Contains: Settings, authentication, dependencies, enums
- Key files:
  - `config.py` - Pydantic settings from environment
  - `auth.py` - JWT authentication
  - `deps.py` - FastAPI dependency injection
  - `enums.py` - Role, MembershipType, RegistrationStatus

**backend/app/db/**
- Purpose: Database layer with SQLAlchemy
- Contains: ORM models, database session management
- Key files:
  - `models.py` - User, Activity, Registration, VolunteerMatch models
  - `session.py` - Database connection
  - `base.py` - SQLAlchemy declarative base

**backend/app/services/**
- Purpose: Business logic layer
- Contains: Service classes for each domain
- Key files:
  - `base_service.py` - Generic CRUD operations
  - `activity_service.py` - Activity-specific logic
  - `registration_service.py` - Registration handling
  - `analytics_service.py` - Analytics data generation

**backend/app/integrations/**
- Purpose: External service clients
- Contains: Third-party API integrations
- Key files: `twilio_client.py` - SMS/WhatsApp client

**frontend/src/components/**
- Purpose: React component library
- Contains: UI components organized by feature
- Subdirectories:
  - `shared/` - Reusable UI (Button, Input, Modal, Badge, Spinner)
  - `activities/` - Calendar, forms, modals for activities
  - `auth/` - Login/signup form, protected route wrapper
  - `dashboard/` - Role-specific dashboard views
  - `staff/` - Admin/staff management tools
  - `accessibility/` - TTS, accessibility features

**frontend/src/services/**
- Purpose: API client layer
- Contains: axios-based API functions
- Key files:
  - `api.js` - Base axios instance with auth interceptor
  - `supabase.js` - Supabase client initialization
  - `activities.api.js`, `registrations.api.js`, etc. - Domain APIs

**frontend/src/pages/**
- Purpose: Top-level route components
- Contains: Page layouts for each route
- Key files: `Landing.jsx`, `Dashboard.jsx`, `Activities.jsx`, `Auth.jsx`, `Profile.jsx`

**frontend/src/mocks/**
- Purpose: Mock data for development without backend
- Contains: Static mock data and user switching
- Key files:
  - `activities.mock.js`, `registrations.mock.js`, `users.mock.js`
  - `userSwitcher.mock.js` - Switch between mock user roles

## Key File Locations

**Entry Points:**
- `backend/app/main.py` - FastAPI application entry
- `frontend/src/main.jsx` - React application entry (implicit)

**Configuration:**
- `backend/.env.example` - Backend environment template
- `backend/app/core/config.py` - Settings class with validation
- `frontend/vite.config.js` - Vite bundler configuration
- `frontend/tailwind.config.js` - Tailwind CSS configuration

**Core Logic:**
- `backend/app/api/router.py` - API route aggregation
- `backend/app/services/base_service.py` - Generic CRUD
- `frontend/src/contexts/AuthContext.jsx` - Authentication state
- `frontend/src/services/api.js` - HTTP client with interceptors

**Testing:**
- `backend/tests/` - Pytest tests (unit/, integration/)
- `backend/conftest.py` - Test fixtures
- `frontend/src/**/*.test.jsx` - Vitest component tests

**Documentation:**
- `README.md` - Project overview and setup
- `REFINED_ARCHITECTURE.md` - Architectural decisions
- `INTEGRATION_CHECKLIST.md` - Feature completion status

## Naming Conventions

**Files:**
- `snake_case.py` for Python modules (`activity_service.py`)
- `PascalCase.jsx` for React components (`AuthForm.jsx`)
- `camelCase.js` for JavaScript utilities (`dateUtils.js`)
- `*.test.jsx` for test files (`Card.test.jsx`)

**Directories:**
- `lowercase` for all directories
- Plural for collections (`services/`, `components/`, `pages/`)

**Special Patterns:**
- `*.api.js` for API service modules
- `*.mock.js` for mock data files
- `__init__.py` for Python packages

## Where to Add New Code

**New API Endpoint:**
- Route handler: `backend/app/api/{domain}.py`
- Add to router: `backend/app/api/router.py`
- Pydantic models: `backend/app/models/{domain}.py`
- Service logic: `backend/app/services/{domain}_service.py`
- Tests: `backend/tests/unit/` or `backend/tests/integration/`

**New React Component:**
- Component: `frontend/src/components/{category}/{ComponentName}.jsx`
- Tests: `frontend/src/components/{category}/{ComponentName}.test.jsx`
- Shared components go in `frontend/src/components/shared/`

**New Page/Route:**
- Page: `frontend/src/pages/{PageName}.jsx`
- Add route in main router (likely in App.jsx or similar)
- Protected routes wrap with `ProtectedRoute` component

**New API Client:**
- Service: `frontend/src/services/{domain}.api.js`
- Use `createCrudApi` factory for standard CRUD
- Add custom methods as needed

**New Backend Service:**
- Service: `backend/app/services/{domain}_service.py`
- Extend `BaseService` for CRUD operations
- Add to `__init__.py` exports

## Special Directories

**.planning/**
- Purpose: Project planning and analysis documents
- Source: Created by GSD workflow
- Committed: Yes

**frontend/node_modules/**
- Purpose: npm dependencies
- Source: `npm install`
- Committed: No (gitignored)

**backend/.pytest_cache/**
- Purpose: Pytest cache
- Source: Generated by pytest
- Committed: No

---

*Structure analysis: 2026-01-19*
*Update when directory structure changes*
