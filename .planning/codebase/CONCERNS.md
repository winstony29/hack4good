# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Backend API handlers are stubs:**
- Issue: Most API endpoints return placeholder data with TODO comments
- Files: `backend/app/api/activities.py`, `backend/app/api/registrations.py`, `backend/app/api/matches.py`, `backend/app/api/notifications.py`, `backend/app/api/staff.py`
- Why: Rapid prototyping during hackathon
- Impact: Backend is non-functional; frontend relies entirely on mock data
- Fix approach: Implement each endpoint with actual database queries using SQLAlchemy models

**Third-party integrations not implemented:**
- Issue: ElevenLabs, Google Translate, and Twilio clients have placeholder implementations
- Files: `backend/app/integrations/elevenlabs_client.py`, `backend/app/integrations/google_translate.py`, `backend/app/integrations/twilio_client.py`, `backend/app/services/notification_service.py`, `backend/app/services/accessibility_service.py`
- Why: External API credentials not available during development
- Impact: Accessibility features (TTS, translation) and notifications (SMS, WhatsApp) don't work
- Fix approach: Implement API calls when credentials are available

**Frontend hardcoded to mock mode:**
- Issue: `USE_MOCK_DATA = true` hardcoded in AuthContext
- File: `frontend/src/contexts/AuthContext.jsx`
- Why: Backend not functional yet
- Impact: Cannot test real authentication or API calls
- Fix approach: Make configurable via environment variable

## Known Bugs

**No actual bugs identified** - codebase is in early development with placeholders rather than broken implementations.

## Security Considerations

**Placeholder credentials in Supabase client:**
- Risk: Fallback to placeholder URL/key when env vars missing
- File: `frontend/src/services/supabase.js`
- Current mitigation: Console warning logged
- Recommendations: Fail explicitly if credentials missing in production

**No input validation on frontend forms:**
- Risk: Invalid data submitted to backend
- Files: `frontend/src/components/auth/AuthForm.jsx`, `frontend/src/components/activities/ActivityForm.jsx`
- Current mitigation: Backend Pydantic validation (when implemented)
- Recommendations: Add frontend validation before submission

**JWT secret handling:**
- Risk: JWT_SECRET_KEY needs to be properly secured
- File: `backend/app/core/config.py`
- Current mitigation: Loaded from environment
- Recommendations: Ensure strong secret in production, rotate periodically

## Performance Bottlenecks

**None identified** - application is not yet functional enough to have performance issues.

**Potential future concerns:**
- Activity calendar loads all activities (may need pagination for large datasets)
- No caching layer configured

## Fragile Areas

**Dashboard role switching:**
- File: `frontend/src/components/dashboard/DashboardContainer.jsx`
- Why fragile: Relies on `user?.user_metadata?.role` path that could be undefined
- Common failures: Unknown role falls through to error message
- Safe modification: Ensure role is always set during user creation
- Test coverage: None

**Mock user switcher:**
- File: `frontend/src/mocks/userSwitcher.mock.js`
- Why fragile: Development-only feature that could leak to production
- Common failures: Mock mode accidentally enabled in production
- Safe modification: Use environment variable, strip in production build

## Scaling Limits

**Not applicable** - application not yet deployed or under load.

## Dependencies at Risk

**react-hot-toast:**
- Risk: Last updated over a year ago, React 19 compatibility unknown
- Impact: Toast notifications could break on React upgrade
- Migration plan: Consider switching to `sonner` (actively maintained)

**elevenlabs SDK:**
- Risk: Version 0.2.26 is old; SDK has had breaking changes
- Impact: TTS integration may need significant rework when implemented
- Migration plan: Upgrade to latest when implementing TTS feature

## Missing Critical Features

**Backend implementation:**
- Problem: All API endpoints are stubs
- Current workaround: Frontend uses mock data
- Blocks: Real user registration, activity management, data persistence
- Implementation complexity: Medium-High (many endpoints to implement)

**Environment configuration:**
- Problem: No `.env.example` file documenting required variables
- Current workaround: Reading code to find env vars
- Blocks: Onboarding new developers
- Implementation complexity: Low

**Database migrations:**
- Problem: Alembic installed but no migrations created
- Current workaround: Manual schema creation via `backend/sql/init_schema.sql`
- Blocks: Safe schema evolution
- Implementation complexity: Low

**Error boundaries:**
- Problem: No React error boundaries
- Current workaround: Errors crash entire app
- Blocks: Graceful error handling
- Implementation complexity: Low

## Test Coverage Gaps

**No automated tests:**
- What's not tested: Everything
- Risk: Any change could break functionality unnoticed
- Priority: High
- Difficulty to test: Medium - mock data exists, need to add test framework

**Critical paths needing tests:**
- Authentication flow
- Activity registration
- Role-based dashboard routing
- API request/response handling

## Documentation Gaps

**API documentation:**
- `frontend/src/services/API_REFERENCE.js` exists but backend APIs are stubs
- Need to document actual endpoint behavior once implemented

**Setup instructions:**
- README exists but may be incomplete for local development
- Missing: Database setup, environment configuration

---

*Concerns audit: 2026-01-19*
*Update as issues are fixed or new ones discovered*
