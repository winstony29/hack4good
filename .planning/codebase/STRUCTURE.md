# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
hack4good/
├── frontend/               # React + Vite frontend application
│   ├── src/               # Source code
│   │   ├── components/    # React components (8 subdirectories)
│   │   ├── pages/         # Page-level components
│   │   ├── contexts/      # React Context providers
│   │   ├── services/      # API service layer
│   │   ├── mocks/         # Mock data for development
│   │   ├── constants/     # Design system constants
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # CSS files
│   │   ├── test/          # Test setup
│   │   └── main.jsx       # Entry point
│   ├── tests/e2e/         # Playwright E2E tests
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Vite configuration
├── backend/               # FastAPI Python backend
│   ├── app/               # Application code
│   │   ├── api/          # API routers
│   │   ├── core/         # Core utilities (auth, config)
│   │   ├── db/           # Database models and session
│   │   ├── services/     # Business logic services
│   │   ├── integrations/ # External service clients
│   │   ├── utils/        # Utility functions
│   │   └── main.py       # FastAPI app entry
│   ├── tests/            # Backend tests
│   ├── alembic/          # Database migrations
│   └── requirements.txt  # Python dependencies
├── .planning/            # Project planning documents
├── README.md
└── *.md                  # Project documentation files
```

## Directory Purposes

**frontend/src/components/**
- Purpose: React UI components organized by feature
- Contains: 36 React components in 8 subdirectories
- Subdirectories:
  - `accessibility/` - AccessibilityMenu.jsx, TTSButton.jsx
  - `activities/` - ActivityCalendar.jsx, ActivityCard.jsx, ActivityDetailModal.jsx, ActivityForm.jsx, ActivityMonthCalendar.jsx, DayActivitiesModal.jsx
  - `auth/` - AuthForm.jsx, ProtectedRoute.jsx
  - `dashboard/` - DashboardContainer.jsx, ParticipantDashboard.jsx, VolunteerDashboard.jsx, StaffDashboard.jsx, RegistrationsList.jsx
  - `layout/` - Layout.jsx, Navbar.jsx, PageTransition.jsx
  - `shared/` - Button.jsx, Card.jsx, Modal.jsx, Input.jsx, Badge.jsx, Spinner.jsx, EmptyState.jsx
  - `staff/` - ActivityManager.jsx, AnalyticsCharts.jsx, AttendanceExporter.jsx
  - `volunteer/` - ActivitySwiper.jsx, SwipeableCard.jsx, SwipeButtons.jsx, MatchAnimation.jsx

**frontend/src/pages/**
- Purpose: Route-level page components
- Contains: Landing.jsx, Auth.jsx, Dashboard.jsx, Activities.jsx, Swiper.jsx, Profile.jsx, NotFound.jsx

**frontend/src/contexts/**
- Purpose: React Context API state management
- Contains: AuthContext.jsx, AccessibilityContext.jsx

**frontend/src/services/**
- Purpose: API communication layer
- Contains: api.js (axios instance), supabase.js, *.api.js files for each feature
- Key files: activities.api.js, registrations.api.js, matches.api.js, notifications.api.js, auth.api.js, staff.api.js, accessibility.api.js

**frontend/src/mocks/**
- Purpose: Mock data for development without backend
- Contains: users.mock.js, activities.mock.js, registrations.mock.js, analytics.mock.js

**frontend/src/constants/**
- Purpose: Design system tokens
- Contains: colors.js, spacing.js, typography.js, styles.js, index.js

**backend/app/api/**
- Purpose: FastAPI route handlers
- Contains: auth.py, activities.py, registrations.py, matches.py, notifications.py, staff.py, accessibility.py, router.py

**backend/app/core/**
- Purpose: Core application utilities
- Contains: config.py (settings), auth.py (JWT/auth), deps.py (dependencies), enums.py

**backend/app/db/**
- Purpose: Database layer
- Contains: models.py (ORM models), session.py (SQLAlchemy session), base.py (declarative base)

**backend/app/services/**
- Purpose: Business logic layer
- Contains: base_service.py, activity_service.py, registration_service.py, notification_service.py, analytics_service.py, accessibility_service.py

**backend/app/integrations/**
- Purpose: External service API clients
- Contains: twilio_client.py, elevenlabs_client.py, google_translate.py

## Key File Locations

**Entry Points:**
- `frontend/src/main.jsx` - React app entry point
- `frontend/src/App.jsx` - Root component with routing
- `backend/app/main.py` - FastAPI application entry

**Configuration:**
- `frontend/vite.config.js` - Vite build config with API proxy
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/vitest.config.js` - Unit test configuration
- `frontend/playwright.config.js` - E2E test configuration
- `backend/app/core/config.py` - Backend settings class
- `frontend/.env.example` - Frontend environment template
- `backend/.env.example` - Backend environment template

**Core Logic:**
- `frontend/src/contexts/AuthContext.jsx` - Authentication state
- `frontend/src/services/api.js` - Axios instance with interceptors
- `backend/app/core/auth.py` - JWT validation and user extraction
- `backend/app/api/router.py` - Central API router

**Testing:**
- `frontend/src/test/setup.js` - Vitest global setup
- `frontend/tests/e2e/` - Playwright E2E tests
- `backend/tests/unit/` - Backend unit tests
- `backend/tests/integration/` - Backend integration tests

**Documentation:**
- `README.md` - Project overview
- `REFINED_ARCHITECTURE.md` - Architecture documentation
- `TEAM_WORKFLOW.md` - Development workflow

## Naming Conventions

**Files:**
- PascalCase.jsx - React components (e.g., `ActivityCard.jsx`)
- camelCase.js - Utilities and services (e.g., `dateUtils.js`)
- kebab-case.api.js - API service files (e.g., `activities.api.js`)
- kebab-case.mock.js - Mock data files (e.g., `users.mock.js`)
- *.test.jsx - Unit test files (e.g., `Card.test.jsx`)
- *.spec.js - E2E test files (e.g., `accessibility.spec.js`)
- snake_case.py - Python files (e.g., `activity_service.py`)

**Directories:**
- kebab-case - Feature directories (e.g., `activities/`, `auth/`)
- Plural names for collections (e.g., `components/`, `services/`, `pages/`)

**Special Patterns:**
- index.js - Barrel exports for constants
- *.api.js - API service modules
- *.mock.js - Mock data modules

## Where to Add New Code

**New Feature (Frontend):**
- Components: `frontend/src/components/{feature}/`
- Page: `frontend/src/pages/{FeatureName}.jsx`
- API service: `frontend/src/services/{feature}.api.js`
- Mock data: `frontend/src/mocks/{feature}.mock.js`
- Route: Add to `frontend/src/App.jsx`

**New Feature (Backend):**
- Router: `backend/app/api/{feature}.py`
- Service: `backend/app/services/{feature}_service.py`
- Models: Add to `backend/app/db/models.py`
- Register router in `backend/app/api/router.py`

**New Component:**
- Implementation: `frontend/src/components/{category}/{ComponentName}.jsx`
- Test: `frontend/src/components/{category}/{ComponentName}.test.jsx`

**New API Endpoint:**
- Add route to appropriate `backend/app/api/*.py` router
- Add service method to `backend/app/services/*_service.py`

**Shared Utilities:**
- Frontend: `frontend/src/utils/{name}.js`
- Backend: `backend/app/utils/{name}.py`

**New External Integration:**
- Client: `backend/app/integrations/{service}_client.py`
- Service wrapper: `backend/app/services/{service}_service.py`

## Special Directories

**frontend/src/mocks/**
- Purpose: Mock data for development mode
- Source: Manually created test data
- Committed: Yes
- Usage: Enabled via `VITE_USE_MOCK_DATA=true`

**frontend/node_modules/**
- Purpose: npm dependencies
- Source: `npm install`
- Committed: No (in .gitignore)

**backend/__pycache__/**
- Purpose: Python bytecode cache
- Source: Auto-generated by Python
- Committed: No (in .gitignore)

**.planning/**
- Purpose: Project planning and documentation
- Source: Manual and generated documentation
- Committed: Yes

---

*Structure analysis: 2026-01-19*
*Update when directory structure changes*
