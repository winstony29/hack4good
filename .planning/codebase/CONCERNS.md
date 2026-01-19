# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**TODO Comments Throughout API Layer:**
- Issue: Many API route handlers have placeholder TODO comments instead of implementation
- Files:
  - `backend/app/api/activities.py` (5 TODOs: lines 30, 43, 62, 76, 90)
  - `backend/app/api/registrations.py` (4 TODOs: lines 34, 56, 73, 90)
  - `backend/app/api/notifications.py` (3 TODOs: lines 29, 50, 67)
- Why: Rapid prototyping, endpoints defined before full implementation
- Impact: API endpoints may return mock/placeholder data instead of real database operations
- Fix approach: Implement actual database operations using service layer

**Hardcoded Mock Mode Toggle:**
- Issue: `USE_MOCK_DATA = true` hardcoded in AuthContext
- File: `frontend/src/contexts/AuthContext.jsx` (line 6)
- Why: Development convenience
- Impact: Production deployment would require code change, not environment variable
- Fix approach: Move to environment variable (`VITE_USE_MOCK_DATA`)

**No Health Check Database Validation:**
- Issue: Health endpoint returns hardcoded "connected" without actual DB check
- File: `backend/app/main.py` (line 41)
- Why: Quick placeholder
- Impact: Health checks don't detect actual database connection issues
- Fix approach: Add actual database ping in health check

## Known Bugs

**None identified during analysis**

## Security Considerations

**Placeholder Supabase Credentials:**
- Risk: Frontend falls back to placeholder credentials if env vars missing
- File: `frontend/src/services/supabase.js` (lines 10-12)
- Current mitigation: Console warning logged
- Recommendations: Fail fast instead of using placeholders; throw error if credentials missing

**JWT Secret in Environment:**
- Risk: JWT_SECRET_KEY could be weak if not properly generated
- File: `backend/.env.example` shows example value
- Current mitigation: Example file shows it needs changing
- Recommendations: Document secure secret generation, validate minimum entropy

**Mock Data Bypass:**
- Risk: Mock auth mode bypasses real authentication completely
- File: `frontend/src/contexts/AuthContext.jsx`
- Current mitigation: Only for development
- Recommendations: Ensure mock mode cannot be enabled in production builds

## Performance Bottlenecks

**No significant performance issues detected**

The codebase is still in development phase with limited data volumes.

## Fragile Areas

**API Route Handlers with Placeholder Logic:**
- Files: `backend/app/api/activities.py`, `backend/app/api/registrations.py`, `backend/app/api/notifications.py`
- Why fragile: Returning mock data instead of real database operations
- Common failures: Frontend expects real data, gets placeholder responses
- Safe modification: Implement full service layer integration
- Test coverage: Limited - needs integration tests

**Mock User Switching:**
- File: `frontend/src/mocks/userSwitcher.mock.js`
- Why fragile: Global state for development that shouldn't exist in production
- Common failures: Wrong user type persists, role confusion
- Safe modification: Ensure complete removal path for production
- Test coverage: Not tested

## Scaling Limits

**Not applicable** - Development stage, no production deployment yet

## Dependencies at Risk

**react-hot-toast:**
- Risk: Last update unknown, React 19 compatibility uncertain
- Impact: Toast notifications
- Migration plan: Consider switching to sonner if issues arise

**ElevenLabs SDK:**
- Risk: `elevenlabs 0.2.26` is early version, API may change
- Impact: Text-to-speech accessibility feature
- Migration plan: Monitor for breaking changes, abstract behind interface

## Missing Critical Features

**Edit Profile Functionality:**
- Problem: Profile page shows TODO comment for edit functionality
- File: `frontend/src/pages/Profile.jsx` (line 57)
- Current workaround: Users cannot edit their profile
- Blocks: User self-service profile management
- Implementation complexity: Low (form + API endpoint)

**Cancellation Logic:**
- Problem: Registration cancellation has TODO comment
- File: `frontend/src/components/dashboard/RegistrationsList.jsx` (line 101)
- Current workaround: Users cannot cancel registrations
- Blocks: Self-service registration management
- Implementation complexity: Low (API call + state update)

**Activity Manager Implementation:**
- Problem: Staff dashboard references unimplemented ActivityManager
- File: `frontend/src/components/dashboard/StaffDashboard.jsx` (line 68)
- Current workaround: None
- Blocks: Staff cannot manage activities from dashboard
- Implementation complexity: Medium (CRUD interface)

## Test Coverage Gaps

**Backend API Integration Tests:**
- What's not tested: Full request/response cycle for API endpoints
- Risk: API behavior changes could break frontend without detection
- Priority: High
- Difficulty to test: Medium (need test database setup)

**Frontend Component Tests:**
- What's not tested: Most components lack tests
- Current tests: Only 5 test files found
- Risk: UI regressions undetected
- Priority: Medium
- Difficulty to test: Low (React Testing Library available)

**Mock Mode vs Real Mode:**
- What's not tested: Transition between mock and real authentication
- Risk: Production deployment issues
- Priority: High before production
- Difficulty to test: Medium (need to toggle modes)

---

*Concerns audit: 2026-01-19*
*Update as issues are fixed or new ones discovered*
