# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Unimplemented Backend API Endpoints:**
- Issue: Core API endpoints have TODO stubs returning 501/empty responses
- Files:
  - `backend/app/api/registrations.py` - `register_for_activity()`, `get_user_registrations()`, `cancel_registration()` all unimplemented
  - `backend/app/api/activities.py` - `get_activities()`, `get_activity()`, `create_activity()`, `update_activity()`, `delete_activity()` all unimplemented
- Why: Rapid prototyping phase, frontend uses mock data
- Impact: Backend cannot serve real data; app relies entirely on mock mode
- Fix approach: Implement CRUD operations using existing services and ORM models

**Duplicate Twilio Client Implementations:**
- Issue: Two separate TwilioClient classes exist
- Files:
  - `backend/app/integrations/twilio_client.py` - Uses print statements
  - `backend/app/services/twilio_client.py` - Uses logging module
- Why: Likely added by different developers without coordination
- Impact: Confusion about which to use, inconsistent logging behavior
- Fix approach: Consolidate into single client in `integrations/`, remove duplicate

**Large Frontend Components:**
- Issue: Several components exceed 250+ lines, mixing concerns
- Files:
  - `frontend/src/components/dashboard/ParticipantDashboard.jsx` - 330 lines
  - `frontend/src/pages/Activities.jsx` - 316 lines
  - `frontend/src/components/activities/ActivityMonthCalendar.jsx` - 283 lines
  - `frontend/src/components/activities/DayActivitiesModal.jsx` - 256 lines
  - `frontend/src/components/activities/ActivityForm.jsx` - 256 lines
- Why: Features added incrementally without refactoring
- Impact: Difficult to maintain, test, and reason about
- Fix approach: Extract sub-components, custom hooks for state logic

## Known Bugs

**Frontend Cancellation Not Implemented:**
- Symptoms: Cancel button logs to console but doesn't cancel registration
- Trigger: Click "Cancel" on any registration
- Files: `frontend/src/components/dashboard/RegistrationsList.jsx` line 101-102
- Workaround: None - feature doesn't work
- Root cause: TODO placeholder with console.log instead of API call
- Fix: Implement `handleCancel()` to call registrations API

**Profile Edit Not Implemented:**
- Symptoms: Edit profile shows placeholder text
- Trigger: Navigate to Profile page
- File: `frontend/src/pages/Profile.jsx` line 57
- Workaround: None - feature doesn't work
- Root cause: TODO placeholder

## Security Considerations

**Hardcoded Test Secrets:**
- Risk: Test JWT secrets could be accidentally used in production
- Files:
  - `backend/tests/conftest.py` line 14 - `'test-secret-key-for-jwt-testing'`
  - `backend/tests/integration/test_accessibility_api.py` line 23 - `'test-secret-key'`
- Current mitigation: Secrets only in test files
- Recommendations: Use environment variable for test secret, add validation that production secret differs

**Hardcoded CORS Origins:**
- Risk: CORS configuration mixes environment variable with hardcoded localhost URLs
- File: `backend/app/main.py` line 16
- Current mitigation: Only localhost URLs hardcoded
- Recommendations: Move all origins to environment configuration

## Performance Bottlenecks

**N+1 Query Pattern in ParticipantDashboard:**
- Problem: Fetches all registrations, then fetches activity details one-by-one
- File: `frontend/src/components/dashboard/ParticipantDashboard.jsx` lines 38-51
- Measurement: Not profiled (but pattern causes linear API calls)
- Cause: No batch loading endpoint, separate fetch per registration
- Improvement path: Create backend endpoint that returns registrations with activity details joined

**No Database Connection Pooling:**
- Problem: SQLAlchemy configured without pool settings
- File: `backend/app/db/session.py`
- Measurement: Could cause connection exhaustion under load
- Cause: Default configuration used
- Improvement path: Add `pool_pre_ping`, `pool_size`, `max_overflow` settings

## Fragile Areas

**Authentication Middleware:**
- File: `backend/app/core/auth.py`
- Why fragile: Supabase client created as global, no error handling for initialization failure
- Common failures: Invalid credentials cause app startup failure
- Safe modification: Add try/catch around Supabase client creation
- Test coverage: Not tested

**Integration Layer Mock Fallback:**
- Files: `backend/app/integrations/elevenlabs_client.py`, `backend/app/integrations/google_translate.py`, `backend/app/integrations/twilio_client.py`
- Why fragile: Generic `Exception` catches with print statements
- Common failures: Errors swallowed silently, hard to debug
- Safe modification: Add specific exception types, use logging module
- Test coverage: Unit tests exist but mock the external services

## Scaling Limits

**Mock Data Mode:**
- Current capacity: Unlimited (static data)
- Limit: Cannot scale to real users without implementing backend
- Symptoms at limit: N/A (not functional for real use)
- Scaling path: Implement backend API endpoints

**Single-Browser E2E Testing:**
- Current capacity: Tests only Chromium
- Limit: No cross-browser validation
- Symptoms at limit: Browser-specific bugs undetected
- Scaling path: Add Firefox and WebKit to Playwright config

## Dependencies at Risk

**react-hot-toast:**
- Risk: Package update frequency declining
- Impact: Toast notifications, used throughout app
- Migration plan: Consider sonner (actively maintained, similar API)

## Missing Critical Features

**Database Health Check:**
- Problem: Health endpoint returns hardcoded "connected" without checking
- File: `backend/app/main.py` line 41 - `"database": "connected"  # TODO: Add actual DB health check`
- Current workaround: None - health check is misleading
- Blocks: Reliable health monitoring in production
- Fix: Add actual database connectivity check

**Error Boundary:**
- Problem: No React Error Boundary for graceful error handling
- Current workaround: Component-level try/catch (inconsistent)
- Blocks: Graceful degradation when components crash
- Fix: Add Error Boundary wrapper component

## Test Coverage Gaps

**Backend API Endpoints:**
- What's not tested: All CRUD endpoints in `activities.py`, `registrations.py`, `matches.py`
- Risk: Endpoints will break silently when implemented
- Priority: High (core functionality)
- Difficulty to test: Endpoints are stubs; tests blocked until implementation

**Frontend Page Components:**
- What's not tested: `Activities.jsx`, `ParticipantDashboard.jsx`, `Profile.jsx`
- Risk: UI regressions undetected
- Priority: Medium
- Difficulty to test: Large components with many dependencies to mock

**Error States:**
- What's not tested: How components behave when API calls fail
- Risk: Poor user experience on errors
- Priority: Medium
- Difficulty to test: Need to mock API failures

## Error Handling Gaps

**Print Statements Instead of Logging:**
- Issue: Integration clients use print() instead of Python logging
- Files:
  - `backend/app/integrations/elevenlabs_client.py` lines 42-43
  - `backend/app/integrations/google_translate.py` lines 44, 90, 115
  - `backend/app/integrations/twilio_client.py` lines 47, 77
- Impact: Errors lost in production, no log levels
- Fix: Replace print() with logging.logger

**Async/Await Inconsistencies:**
- Issue: Methods marked `async` but perform only synchronous operations
- File: `backend/app/services/notification_service.py` lines 28, 105, 140, 165, 195
- Impact: Misleading API, potential performance issues
- Fix: Either use async DB operations or remove async keyword

**Missing Transaction Rollbacks:**
- Issue: Database commits without try/catch/rollback pattern
- Files:
  - `backend/app/services/base_service.py` lines 33, 47, 58
  - `backend/app/services/notification_service.py` lines 67, 82
- Impact: Partial data on commit failure
- Fix: Add transaction context manager with rollback on exception

---

*Concerns audit: 2026-01-19*
*Update as issues are fixed or new ones discovered*
