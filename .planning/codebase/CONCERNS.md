# Codebase Concerns

**Analysis Date:** 2026-01-20

## Tech Debt

**Incomplete Backend API Implementations:**
- Issue: Many backend API endpoints have TODO comments instead of actual implementation
- Files: `backend/app/api/activities.py`, `backend/app/api/registrations.py`
- Why: Rapid prototyping during hackathon
- Impact: Backend endpoints return placeholder responses, not real data
- Fix approach: Implement actual database queries and business logic

**Hardcoded Mock Data Toggle:**
- Issue: `USE_MOCK_DATA = true` hardcoded in `AuthContext.jsx`
- File: `frontend/src/contexts/AuthContext.jsx:6`
- Why: Development convenience
- Impact: Must manually change code to switch to real backend
- Fix approach: Move to environment variable `VITE_USE_MOCK_DATA`

## Known Bugs

**None detected during analysis**
- Codebase appears stable for current scope
- Most functionality relies on mock data which is predictable

## Security Considerations

**No JWT Secret Rotation:**
- Risk: JWT secret is static, no rotation mechanism
- File: `backend/.env.example` - `JWT_SECRET_KEY`
- Current mitigation: Long, random secret
- Recommendations: Implement secret rotation for production

**Missing Input Validation:**
- Risk: Some API endpoints lack thorough input validation
- Files: `backend/app/api/activities.py`, `backend/app/api/registrations.py`
- Current mitigation: Pydantic schemas provide basic type validation
- Recommendations: Add business rule validation (e.g., date ranges, capacity limits)

**CORS Configuration:**
- Risk: CORS allows multiple localhost ports
- File: `backend/app/main.py:16-24`
- Current mitigation: Only affects development
- Recommendations: Tighten CORS for production (only allow specific frontend domain)

## Performance Bottlenecks

**No issues detected for current scale**
- Application is in development/hackathon phase
- Mock data eliminates database queries
- When real data is used, consider:
  - Pagination for activity lists
  - Caching for frequently accessed data
  - Database indexes for common queries

## Fragile Areas

**Mock/Real Data Switching:**
- File: `frontend/src/contexts/AuthContext.jsx`
- Why fragile: Toggle affects all auth behavior
- Common failures: Forgetting to switch for demos/testing
- Safe modification: Use environment variables consistently
- Test coverage: No tests for switching behavior

**Role-Based Dashboard Rendering:**
- File: `frontend/src/components/dashboard/DashboardContainer.jsx`
- Why fragile: Complex conditional logic based on user role
- Common failures: Missing role handling, undefined user state
- Safe modification: Add explicit handling for each role
- Test coverage: `StaffDashboard.test.jsx` exists, but not comprehensive

## Scaling Limits

**Current State:**
- Application uses mock data - no real scaling concerns yet
- When backend is fully implemented:
  - Database connection pooling needed
  - Consider caching for activity listings
  - Monitor notification service (Twilio) rate limits

## Dependencies at Risk

**react-hot-toast:**
- Risk: Last major update was some time ago
- Impact: Toast notifications
- Migration plan: Can switch to sonner if needed (similar API)

**No Critical Risks:**
- Most dependencies are well-maintained (React, FastAPI, Supabase)
- Tailwind CSS, Vite, Vitest all actively developed

## Missing Critical Features

**Real Database Integration:**
- Problem: Backend API endpoints have TODO placeholders
- Current workaround: Frontend uses mock data
- Blocks: Cannot demo with real user data
- Implementation complexity: Medium - models exist, need query logic

**Edit Profile Functionality:**
- Problem: Profile page has TODO for edit functionality
- File: `frontend/src/pages/Profile.jsx:57`
- Current workaround: Users cannot edit profiles
- Blocks: User self-service
- Implementation complexity: Low

**Registration Cancellation:**
- Problem: Cancel button has TODO for implementation
- File: `frontend/src/components/dashboard/RegistrationsList.jsx:101`
- Current workaround: None
- Blocks: Users cannot cancel registrations
- Implementation complexity: Low

## Test Coverage Gaps

**Page Components:**
- What's not tested: `Landing.jsx`, `Auth.jsx`, `Dashboard.jsx`, `Activities.jsx`, `Profile.jsx`, `Swiper.jsx`
- Risk: UI regressions could go unnoticed
- Priority: Medium
- Difficulty to test: Low - straightforward component tests

**Auth Flow:**
- What's not tested: `AuthContext.jsx`, `AuthForm.jsx`, `ProtectedRoute.jsx`
- Risk: Authentication bugs could break entire app
- Priority: High
- Difficulty to test: Medium - need to mock Supabase

**Volunteer Swiper:**
- What's not tested: `ActivitySwiper.jsx`, `SwipeableCard.jsx`, `SwipeButtons.jsx`
- Risk: Core volunteer feature untested
- Priority: High
- Difficulty to test: Medium - complex gesture interactions

**Backend:**
- What's not tested: All API endpoints
- Risk: Backend changes could break silently
- Priority: High (when backend is implemented)
- Difficulty to test: Low - FastAPI provides good testing utilities

## Documentation Gaps

**No API Documentation:**
- Missing: OpenAPI/Swagger docs not configured
- Impact: Frontend developers must read backend code
- Fix: FastAPI auto-generates docs, just need to enable

**No Deployment Guide:**
- Missing: Instructions for deploying to production
- Impact: Difficult to deploy beyond local development
- Fix: Add deployment section to README

---

*Concerns audit: 2026-01-20*
*Update as issues are fixed or new ones discovered*
