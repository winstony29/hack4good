# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Monorepo with separated Frontend (SPA) and Backend (REST API)

**Key Characteristics:**
- React SPA frontend with client-side routing
- FastAPI REST backend with layered architecture
- Supabase for authentication and database
- Mock data layer for development without backend
- Accessibility-first design (TTS, translation features)

## Layers

**Frontend Presentation Layer:**
- Purpose: User interface and interactions
- Contains: React components, pages, routing
- Location: `frontend/src/pages/*.jsx`, `frontend/src/components/**/*.jsx`
- Depends on: Services layer, AuthContext
- Used by: End users via browser

**Frontend Services Layer:**
- Purpose: API communication and business logic abstraction
- Contains: API clients, Supabase client, utilities
- Location: `frontend/src/services/*.js`
- Depends on: Backend API, Supabase
- Used by: Components, pages

**Frontend Context Layer:**
- Purpose: Global state management
- Contains: AuthContext for authentication state
- Location: `frontend/src/contexts/AuthContext.jsx`
- Depends on: Supabase auth, mock user data
- Used by: All components requiring auth state

**Backend API Layer:**
- Purpose: HTTP request handling, routing
- Contains: FastAPI route handlers
- Location: `backend/app/api/*.py`
- Depends on: Services layer, Core layer
- Used by: Frontend via HTTP requests

**Backend Services Layer:**
- Purpose: Business logic and data operations
- Contains: BaseService, ActivityService, RegistrationService
- Location: `backend/app/services/*.py`
- Depends on: Database models, SQLAlchemy
- Used by: API layer

**Backend Core Layer:**
- Purpose: Configuration, authentication, shared dependencies
- Contains: Settings, auth middleware, enums
- Location: `backend/app/core/*.py`
- Depends on: Environment variables
- Used by: API layer, Services layer

**Backend Database Layer:**
- Purpose: Data persistence and ORM
- Contains: SQLAlchemy models, database session
- Location: `backend/app/db/*.py`
- Depends on: PostgreSQL via SQLAlchemy
- Used by: Services layer

**Backend Integrations Layer:**
- Purpose: External service communication
- Contains: Twilio client, accessibility services
- Location: `backend/app/integrations/*.py`
- Depends on: External APIs (Twilio, ElevenLabs, Google)
- Used by: API layer, Services layer

## Data Flow

**User Registration for Activity:**

1. User selects activity in React UI (`frontend/src/components/activities/ActivityDetailModal.jsx`)
2. Component calls registration API via axios (`frontend/src/services/registrations.api.js`)
3. Request includes JWT token from Supabase session (`frontend/src/services/api.js` interceptor)
4. Backend route handler validates request (`backend/app/api/registrations.py`)
5. Service layer processes registration (`backend/app/services/registration_service.py`)
6. SQLAlchemy model persisted to PostgreSQL
7. Optional: Notification sent via Twilio
8. Response returned to frontend
9. UI updated with confirmation

**Authentication Flow:**

1. User submits credentials (`frontend/src/components/auth/AuthForm.jsx`)
2. Supabase Auth handles authentication (`frontend/src/services/supabase.js`)
3. Session stored in Supabase client
4. AuthContext updates user state (`frontend/src/contexts/AuthContext.jsx`)
5. Protected routes check auth state (`frontend/src/components/auth/ProtectedRoute.jsx`)
6. API requests include JWT in Authorization header (`frontend/src/services/api.js`)

**State Management:**
- Frontend: React Context API for auth state, local state in components
- Backend: Stateless - all state in PostgreSQL database
- Mock mode: Local mock data arrays for development

## Key Abstractions

**BaseService (Backend):**
- Purpose: Generic CRUD operations for database models
- Location: `backend/app/services/base_service.py`
- Pattern: Generic class with TypeVar for model type
- Methods: get_by_id, get_all, create, update, delete, count

**createCrudApi (Frontend):**
- Purpose: Factory for creating CRUD API functions
- Location: `frontend/src/services/api.js`
- Pattern: Factory function returning API method object
- Methods: getAll, getById, create, update, delete, getByUser

**Pydantic Models:**
- Purpose: Request/response validation and serialization
- Location: `backend/app/models/*.py`
- Pattern: Pydantic BaseModel classes
- Examples: User, Activity, Registration, Notification models

**React Components:**
- Purpose: Reusable UI building blocks
- Location: `frontend/src/components/shared/*.jsx`
- Pattern: Functional components with props
- Examples: Button, Input, Modal, Badge, Spinner

## Entry Points

**Frontend Entry:**
- Location: `frontend/src/main.jsx` (implied by Vite)
- Triggers: Browser navigation
- Responsibilities: React app mounting, router setup

**Backend Entry:**
- Location: `backend/app/main.py`
- Triggers: uvicorn server start
- Responsibilities: FastAPI app creation, CORS setup, router inclusion

**API Router:**
- Location: `backend/app/api/router.py`
- Triggers: HTTP requests to /api/*
- Responsibilities: Route delegation to domain-specific routers

## Error Handling

**Strategy:**
- Frontend: try/catch with toast notifications
- Backend: FastAPI exception handling with HTTP status codes

**Patterns:**
- Frontend axios interceptor handles 401 → redirect to auth (`frontend/src/services/api.js`)
- Backend returns structured error responses
- Validation errors return 422 with Pydantic error details

## Cross-Cutting Concerns

**Logging:**
- Console.log/console.warn in frontend
- No structured logging in backend yet

**Validation:**
- Frontend: Form validation in components
- Backend: Pydantic models for request validation

**Authentication:**
- Supabase Auth for identity
- JWT tokens for API authorization
- Protected routes in frontend (`frontend/src/components/auth/ProtectedRoute.jsx`)

**Accessibility:**
- TTS button component (`frontend/src/components/accessibility/TTSButton.jsx`)
- Accessibility menu (`frontend/src/components/accessibility/AccessibilityMenu.jsx`)
- Multi-language support via Google Translate

---

*Architecture analysis: 2026-01-19*
*Update when major patterns change*
