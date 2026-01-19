# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Frontend:**
- No test framework configured
- No test files found (`**/*.test.*` returned no results)
- No Jest, Vitest, or similar in `package.json`

**Backend:**
- pytest 7.4.3 (`backend/requirements.txt`)
- httpx 0.25.2 for async HTTP testing
- No test files found in `backend/`

**Run Commands:**
```bash
# Frontend - not configured
# Backend
cd backend && pytest                    # Run all tests (no tests exist yet)
```

## Test File Organization

**Current State:**
- No test files exist in either frontend or backend
- Testing infrastructure is partially set up (pytest installed) but unused

**Recommended Location:**
- Frontend: `frontend/src/**/*.test.jsx` (co-located) or `frontend/tests/`
- Backend: `backend/tests/` or `backend/app/**/*_test.py`

## Test Structure

**Not yet established.** Recommended patterns:

**Frontend (if Vitest added):**
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

**Backend (pytest):**
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

## Mocking

**Frontend Mock Data:**
- Mock data files exist in `frontend/src/mocks/`
- `activities.mock.js` - Sample activities
- `users.mock.js` - Sample users by role
- `registrations.mock.js` - Sample registrations
- `userSwitcher.mock.js` - Dev tool for switching mock users
- `volunteerMatches.mock.js` - Sample volunteer matches

**Mock Mode Toggle:**
- `USE_MOCK_DATA = true` in `frontend/src/contexts/AuthContext.jsx`
- When true, frontend operates without backend
- Useful for UI development and testing

**Backend Mocking:**
- Not established

## Fixtures and Factories

**Existing Mock Data (Frontend):**
```javascript
// frontend/src/mocks/users.mock.js
export const mockUsers = {
  participant: { id: '...', email: 'participant@test.com', ... },
  volunteer: { id: '...', email: 'volunteer@test.com', ... },
  staff: { id: '...', email: 'staff@test.com', ... }
}
```

**Backend Fixtures:**
- Not established

## Coverage

**Requirements:**
- No coverage requirements configured
- No coverage tool configured

**Configuration:**
- None

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

**Manual Testing:**
- Frontend mock mode enables manual UI testing
- User switcher allows testing all three roles

## Current Testing Approach

**Development Testing:**
1. Frontend runs in mock mode (`USE_MOCK_DATA = true`)
2. Switch between user roles via `userSwitcher.mock.js`
3. Manual verification of UI behavior

**User Roles for Testing:**
- Participant: `participant@test.com`
- Volunteer: `volunteer@test.com`
- Staff: `staff@test.com`

## Recommendations

**Priority 1 - Backend API Tests:**
- Add `backend/tests/` directory
- Test API endpoints with TestClient
- Mock external services (Supabase, Twilio, etc.)

**Priority 2 - Frontend Component Tests:**
- Add Vitest + React Testing Library
- Test critical components (AuthForm, ActivityCalendar, DashboardContainer)
- Test utility functions

**Priority 3 - E2E Tests:**
- Add Playwright or Cypress
- Test critical user flows (login, registration, activity signup)

---

*Testing analysis: 2026-01-19*
*Update when test patterns are established*
