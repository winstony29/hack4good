# Architecture

**Analysis Date:** 2026-01-20

## Pattern Overview

**Overall:** Full-Stack Web Application with Separate Frontend and Backend

**Key Characteristics:**
- React SPA frontend with Vite
- FastAPI REST backend
- PostgreSQL database via Supabase
- Role-based access (Staff, Volunteer, Participant)
- Mock data mode for development
- Accessibility-focused design (TTS, translation)

## Layers

**Frontend Presentation Layer:**
- Purpose: User interface rendering and interaction
- Contains: React components, pages, routing
- Location: `frontend/src/pages/`, `frontend/src/components/`
- Depends on: Services layer, Context providers
- Used by: End users via browser

**Frontend Context Layer:**
- Purpose: Global state management (auth, accessibility)
- Contains: React Context providers
- Location: `frontend/src/contexts/`
- Depends on: Services layer
- Used by: All components

**Frontend Services Layer:**
- Purpose: API communication and data fetching
- Contains: API service functions, Supabase client
- Location: `frontend/src/services/`
- Depends on: Backend API, Supabase
- Used by: Components, Contexts

**Frontend Mocks Layer:**
- Purpose: Development data when backend unavailable
- Contains: Mock data generators, user switcher
- Location: `frontend/src/mocks/`
- Depends on: Nothing (self-contained)
- Used by: Services (when USE_MOCK_DATA=true)

**Backend API Layer:**
- Purpose: HTTP request handling, routing
- Contains: FastAPI route handlers
- Location: `backend/app/api/`
- Depends on: Services layer, Models
- Used by: Frontend via HTTP

**Backend Services Layer:**
- Purpose: Business logic implementation
- Contains: Service classes for activities, notifications, analytics
- Location: `backend/app/services/`
- Depends on: Database, External APIs
- Used by: API handlers

**Backend Models Layer:**
- Purpose: Data structures and database models
- Contains: SQLAlchemy models, Pydantic schemas
- Location: `backend/app/models/`
- Depends on: SQLAlchemy
- Used by: Services, API handlers

**Backend Integrations Layer:**
- Purpose: External service connections
- Contains: Twilio, ElevenLabs, Google Cloud clients
- Location: `backend/app/integrations/`
- Depends on: External APIs
- Used by: Services

## Data Flow

**User Authentication Flow:**

1. User submits login form (`frontend/src/components/auth/AuthForm.jsx`)
2. AuthContext calls Supabase auth (`frontend/src/contexts/AuthContext.jsx`)
3. Supabase validates credentials and returns session
4. User state updated in context
5. Protected routes become accessible (`frontend/src/components/auth/ProtectedRoute.jsx`)

**Activity Registration Flow:**

1. User views activity (`frontend/src/components/activities/ActivityDetailModal.jsx`)
2. Frontend calls registration API (`frontend/src/services/registrations.api.js`)
3. Backend validates request (`backend/app/api/registrations.py`)
4. Registration service creates record (`backend/app/services/registration_service.py`)
5. Notification sent via Twilio (`backend/app/services/notification_service.py`)
6. Frontend updates UI

**State Management:**
- Auth state: React Context (`AuthContext`)
- Accessibility settings: React Context (`AccessibilityContext`)
- Component state: Local useState hooks
- Server state: Fetched per-component (no global cache like React Query)

## Key Abstractions

**Dashboard Pattern:**
- Purpose: Role-specific views based on user type
- Examples: `StaffDashboard.jsx`, `VolunteerDashboard.jsx`, `ParticipantDashboard.jsx`
- Pattern: Conditional rendering in `DashboardContainer.jsx`

**API Service Pattern:**
- Purpose: Centralized API communication
- Examples: `activities.api.js`, `registrations.api.js`
- Pattern: Functions returning promises, mock/real data toggle

**Service Class Pattern (Backend):**
- Purpose: Encapsulate business logic
- Examples: `activity_service.py`, `notification_service.py`, `analytics_service.py`
- Pattern: Classes with async methods, dependency injection via constructor

## Entry Points

**Frontend Entry:**
- Location: `frontend/src/main.jsx`
- Triggers: Browser loads index.html
- Responsibilities: Mount React app, wrap with providers

**Frontend Router:**
- Location: `frontend/src/App.jsx`
- Triggers: URL navigation
- Responsibilities: Route matching, layout rendering, protected routes

**Backend Entry:**
- Location: `backend/app/main.py`
- Triggers: uvicorn server start
- Responsibilities: FastAPI app setup, CORS config, router mounting

**Backend API Router:**
- Location: `backend/app/api/router.py`
- Triggers: HTTP requests to /api/*
- Responsibilities: Route registration for all endpoints

## Error Handling

**Strategy:**
- Frontend: try/catch with toast notifications
- Backend: FastAPI HTTPException with status codes

**Patterns:**
- Frontend catches errors in service calls, shows toast via react-hot-toast
- Backend raises HTTPException with appropriate status codes (400, 401, 404, etc.)
- Auth errors redirect to login page

## Cross-Cutting Concerns

**Logging:**
- Frontend: console.log for debugging
- Backend: print/logging (basic, no structured logging)

**Validation:**
- Frontend: Basic form validation in components
- Backend: Pydantic schemas for request validation

**Authentication:**
- Supabase Auth handling JWT
- Backend verifies JWT from Supabase
- Frontend stores session via Supabase client

**Accessibility:**
- Text-to-speech via ElevenLabs API
- Translation via Google Cloud Translate
- High contrast/font size settings (`AccessibilityContext`)
- Screen reader support via semantic HTML

---

*Architecture analysis: 2026-01-20*
*Update when major patterns change*
