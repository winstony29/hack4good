# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Full-Stack Web Application (React SPA + FastAPI REST API)

**Key Characteristics:**
- Separate frontend and backend codebases
- REST API communication between frontend and backend
- Role-based access control (participant, volunteer, staff)
- Mock-first development with feature flags
- Accessibility-first design with TTS and translation support

## Layers

**Frontend Layers:**

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Contains: React components in `frontend/src/components/`
- Depends on: Context layer, Service layer
- Used by: Page components

**Page Layer:**
- Purpose: Route-level page composition
- Contains: Page components in `frontend/src/pages/`
- Depends on: Presentation layer, Context layer
- Used by: React Router

**Context Layer:**
- Purpose: Global state management
- Contains: React Contexts in `frontend/src/contexts/`
- Depends on: Service layer
- Used by: All components via hooks

**Service Layer:**
- Purpose: API communication abstraction
- Contains: API clients in `frontend/src/services/`
- Depends on: axios, Supabase client
- Used by: Context layer, Page components

**Backend Layers:**

**API Layer:**
- Purpose: HTTP request handling and routing
- Contains: FastAPI routers in `backend/app/api/`
- Depends on: Service layer, Auth dependencies
- Used by: External HTTP clients

**Service Layer:**
- Purpose: Business logic encapsulation
- Contains: Service classes in `backend/app/services/`
- Depends on: Data layer, Integration layer
- Used by: API layer

**Integration Layer:**
- Purpose: External service communication
- Contains: API clients in `backend/app/integrations/`
- Depends on: External APIs (Twilio, ElevenLabs, Google)
- Used by: Service layer

**Data Layer:**
- Purpose: Database access and ORM
- Contains: SQLAlchemy models in `backend/app/db/`
- Depends on: PostgreSQL database
- Used by: Service layer

## Data Flow

**HTTP Request Flow:**

1. User interacts with React component
2. Component calls service method (e.g., `activitiesApi.getAll()`)
3. Axios interceptor attaches JWT token from Supabase session
4. Request sent to FastAPI backend
5. FastAPI validates JWT via auth dependency
6. Router calls service method with DB session
7. Service executes business logic, queries database
8. Response returned through layers to frontend
9. Component updates state, re-renders

**Authentication Flow:**

1. User submits credentials on Auth page
2. `AuthContext` calls Supabase Auth API
3. Supabase validates credentials, returns JWT + user data
4. Frontend stores session via Supabase client
5. `AuthContext` updates user state
6. Subsequent API requests include JWT in Authorization header
7. Backend validates JWT, extracts user from token
8. Role-based access checks via dependencies

**State Management:**
- Frontend: React Context API (AuthContext, AccessibilityContext)
- Backend: Stateless - each request is independent
- Persistence: PostgreSQL for data, localStorage for accessibility settings

## Key Abstractions

**Frontend:**

**Context/Provider:**
- Purpose: Share state across component tree
- Examples: `AuthContext`, `AccessibilityContext` in `frontend/src/contexts/`
- Pattern: React Context with custom hook (useAuth, useAccessibility)

**API Client:**
- Purpose: Encapsulate HTTP communication
- Examples: `activitiesApi`, `registrationsApi`, `matchesApi` in `frontend/src/services/`
- Pattern: Factory function `createCrudApi()` generates CRUD methods

**Shared Component:**
- Purpose: Reusable UI building blocks
- Examples: `Button`, `Card`, `Modal`, `Input` in `frontend/src/components/shared/`
- Pattern: Variant objects for style variations

**Backend:**

**BaseService:**
- Purpose: Generic CRUD operations
- Examples: All services extend `BaseService` in `backend/app/services/base_service.py`
- Pattern: Generic TypeVar for type safety

**Router:**
- Purpose: Group related API endpoints
- Examples: `auth`, `activities`, `registrations` in `backend/app/api/`
- Pattern: FastAPI APIRouter with prefix

**Integration Client:**
- Purpose: Wrap external service API
- Examples: `TwilioClient`, `ElevenLabsClient` in `backend/app/integrations/`
- Pattern: Singleton with mock fallback

## Entry Points

**Frontend Entry:**
- Location: `frontend/src/main.jsx`
- Triggers: Browser loads application
- Responsibilities: Create React root, render App component

**App Component:**
- Location: `frontend/src/App.jsx`
- Triggers: React initialization
- Responsibilities: Configure routing, wrap with providers (Auth, Accessibility)

**Backend Entry:**
- Location: `backend/app/main.py`
- Triggers: Uvicorn server startup
- Responsibilities: Create FastAPI app, configure CORS, mount API router

**API Router:**
- Location: `backend/app/api/router.py`
- Triggers: HTTP requests to /api/*
- Responsibilities: Route to appropriate feature routers

## Error Handling

**Frontend Strategy:**
- Try/catch in async operations
- Toast notifications for user feedback
- Error boundaries for component crashes (planned)

**Frontend Patterns:**
- Service methods return data or throw errors
- Components catch errors, display toast or error state
- Auth errors trigger redirect to login page

**Backend Strategy:**
- HTTPException for API errors with status codes
- Pydantic ValidationError for input validation
- Generic Exception handling in integrations with mock fallback

**Backend Patterns:**
- Services throw HTTPException with descriptive messages
- Routers let exceptions propagate to FastAPI error handler
- Integration failures fall back to mock mode gracefully

## Cross-Cutting Concerns

**Authentication:**
- Frontend: Supabase client manages sessions, AuthContext provides user state
- Backend: JWT validation via `get_current_user()` dependency
- Protected routes: ProtectedRoute component (frontend), role dependencies (backend)

**Authorization:**
- Role-based: `participant`, `volunteer`, `staff`
- Backend guards: `get_current_staff()`, `get_current_volunteer()`, `get_current_participant()`
- Frontend guards: ProtectedRoute with role checks

**Logging:**
- Frontend: console.log (development only)
- Backend: print statements (should migrate to structured logging)

**Validation:**
- Frontend: Form validation in components
- Backend: Pydantic models for request/response validation

**Accessibility:**
- AccessibilityContext manages font size, contrast, language, reduce motion
- CSS variables for theming (`--a11y-bg`, `--a11y-text`, `--a11y-border`)
- TTS support via ElevenLabs API
- Translation support via Google Cloud Translation API

---

*Architecture analysis: 2026-01-19*
*Update when major patterns change*
