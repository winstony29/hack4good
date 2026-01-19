# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Monorepo with Frontend SPA + Backend REST API

**Key Characteristics:**
- Decoupled frontend (React SPA) and backend (FastAPI REST API)
- Role-based access control (Participant, Volunteer, Staff)
- Accessibility-focused features (TTS, translation, font sizing)
- Mock data mode for frontend development without backend

## Layers

**Frontend Layers:**

**Pages Layer:**
- Purpose: Route-level components representing full pages
- Contains: `Landing`, `Auth`, `Dashboard`, `Activities`, `Profile`, `NotFound`
- Location: `frontend/src/pages/*.jsx`
- Depends on: Components, Contexts, Services

**Components Layer:**
- Purpose: Reusable UI components organized by domain
- Contains: Dashboard variants, Activities, Auth, Accessibility, Layout, Shared, Staff, Volunteer
- Location: `frontend/src/components/**/*.jsx`
- Depends on: Contexts, Services, Utils
- Used by: Pages

**Contexts Layer:**
- Purpose: Global state management via React Context
- Contains: `AuthContext` (user session), `AccessibilityContext` (a11y preferences)
- Location: `frontend/src/contexts/*.jsx`
- Depends on: Services
- Used by: All components

**Services Layer:**
- Purpose: API communication abstraction
- Contains: `api.js` (axios instance), domain-specific APIs (`auth.api.js`, `activities.api.js`, etc.)
- Location: `frontend/src/services/*.js`
- Depends on: Supabase client
- Used by: Components, Contexts

**Backend Layers:**

**API Layer:**
- Purpose: HTTP route handlers
- Contains: Route definitions for activities, auth, registrations, matches, notifications, staff, accessibility
- Location: `backend/app/api/*.py`
- Depends on: Services, Models, Core
- Used by: FastAPI router

**Services Layer:**
- Purpose: Business logic encapsulation
- Contains: `ActivityService`, `RegistrationService`, `NotificationService`, `AccessibilityService`, `AnalyticsService`
- Location: `backend/app/services/*.py`
- Depends on: Models, Integrations
- Used by: API handlers

**Models Layer:**
- Purpose: Pydantic schemas for request/response validation
- Contains: User, Activity, Registration, Notification models
- Location: `backend/app/models/*.py`
- Used by: API, Services

**DB Layer:**
- Purpose: SQLAlchemy ORM models and database session
- Contains: `User`, `Activity`, `Registration`, `VolunteerMatch` tables
- Location: `backend/app/db/*.py`
- Used by: Services

**Integrations Layer:**
- Purpose: Third-party service clients
- Contains: Twilio, ElevenLabs, Google Translate clients
- Location: `backend/app/integrations/*.py`
- Used by: Services

## Data Flow

**User Authentication Flow:**

1. User enters credentials on `/auth` page (`frontend/src/pages/Auth.jsx`)
2. `AuthForm` component calls `login()` from `AuthContext`
3. AuthContext calls Supabase auth (or returns mock user in dev mode)
4. Session token stored in Supabase client
5. Protected routes check auth via `ProtectedRoute` component
6. API requests include Bearer token via axios interceptor (`frontend/src/services/api.js`)

**Activity Registration Flow:**

1. User views activities on `/activities` page
2. `ActivityMonthCalendar` displays activities color-coded by type
3. User clicks day to see activities in `DayActivitiesModal`
4. User selects activity, `ActivityDetailModal` shows details
5. Registration creates entry via `registrations.api.js`
6. Backend validates capacity and creates registration

**State Management:**
- User session: `AuthContext` (React Context)
- Accessibility preferences: `AccessibilityContext` with localStorage persistence
- Component state: Local useState hooks
- API state: Fetched on mount, no global cache

## Key Abstractions

**Context Providers:**
- Purpose: Global state containers
- Examples: `AuthProvider` (`frontend/src/contexts/AuthContext.jsx`), `AccessibilityProvider` (`frontend/src/contexts/AccessibilityContext.jsx`)
- Pattern: React Context with Provider wrapper

**API Factory:**
- Purpose: Generate CRUD operations for resources
- Examples: `createCrudApi(resource)` in `frontend/src/services/api.js`
- Pattern: Factory function returning object with getAll, getById, create, update, delete methods

**Role-Based Dashboards:**
- Purpose: Display different UI based on user role
- Examples: `ParticipantDashboard`, `VolunteerDashboard`, `StaffDashboard`
- Pattern: Container component (`DashboardContainer`) switches based on role

**Base Service:**
- Purpose: Common CRUD operations for backend services
- Examples: `BaseService` in `backend/app/services/base_service.py`
- Pattern: Generic service class with standard methods

## Entry Points

**Frontend Entry:**
- Location: `frontend/src/main.jsx`
- Triggers: Browser loads `/index.html`
- Responsibilities: Mount React app to DOM

**App Router:**
- Location: `frontend/src/App.jsx`
- Triggers: React app initialization
- Responsibilities: Set up routing, providers, toast notifications

**Backend Entry:**
- Location: `backend/app/main.py`
- Triggers: `uvicorn app.main:app`
- Responsibilities: Configure FastAPI app, CORS, include routers

## Error Handling

**Strategy:**
- Frontend: Axios interceptor catches 401, redirects to auth
- Backend: FastAPI exception handlers return structured JSON errors

**Patterns:**
- Frontend shows toast notifications for errors (`react-hot-toast`)
- Backend uses HTTP status codes (400, 401, 404, 500)
- Auth errors trigger automatic logout and redirect

## Cross-Cutting Concerns

**Logging:**
- Console.log for development debugging
- No structured logging configured

**Validation:**
- Backend: Pydantic models for request validation
- Frontend: Basic form validation in components

**Authentication:**
- Supabase JWT tokens
- Axios interceptor adds Authorization header
- Backend middleware validates tokens

**Accessibility:**
- Font size adjustment (small/medium/large)
- Contrast mode (normal/high)
- Reduced motion support
- Multi-language support (en, zh, ms, ta)
- Text-to-speech (planned)

---

*Architecture analysis: 2026-01-19*
*Update when major patterns change*
