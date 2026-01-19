# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Frontend Runner:**
- Vitest 4.0.17 (`frontend/package.json`)
- Config: `frontend/vitest.config.js` (if exists) or Vite config

**Frontend Assertion Library:**
- Vitest built-in expect
- @testing-library/jest-dom 6.9.1 for DOM matchers

**Backend Runner:**
- Pytest 7.4.3 (`backend/requirements.txt`)
- Config: `backend/pytest.ini`

**Run Commands:**
```bash
# Frontend
npm test                              # Run all tests (watch mode)
npm run test:run                      # Run all tests (single run)
npm run test:coverage                 # Coverage report

# Backend
cd backend && pytest                  # Run all tests
pytest tests/unit/                    # Unit tests only
pytest tests/integration/             # Integration tests only
```

## Test File Organization

**Frontend Location:**
- Co-located with source: `src/components/**/*.test.jsx`
- Example: `src/components/shared/Card.test.jsx`

**Backend Location:**
- Separate tests directory: `backend/tests/`
- Unit tests: `backend/tests/unit/`
- Integration tests: `backend/tests/integration/`
- Fixtures: `backend/tests/conftest.py`

**Naming:**
- Frontend: `{ComponentName}.test.jsx`
- Backend: `test_{module_name}.py`

**Structure:**
```
frontend/src/
  components/
    shared/
      Card.jsx
      Card.test.jsx
    staff/
      AnalyticsCharts.jsx
      AnalyticsCharts.test.jsx
    dashboard/
      StaffDashboard.jsx
      StaffDashboard.test.jsx
    layout/
      Layout.jsx
      Layout.test.jsx
  mocks/
    analytics.mock.test.js

backend/tests/
  __init__.py
  conftest.py              # Shared fixtures
  unit/
    test_*.py
  integration/
    test_*.py
```

## Test Structure

**Frontend Suite Organization (Vitest + React Testing Library):**
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  beforeEach(() => {
    // Reset state, clear mocks
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const mockHandler = vi.fn()
    render(<ComponentName onClick={mockHandler} />)

    await userEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalled()
  })
})
```

**Backend Suite Organization (Pytest):**
```python
import pytest
from app.services.activity_service import ActivityService

class TestActivityService:
    @pytest.fixture
    def service(self, db_session):
        return ActivityService(db_session)

    def test_create_activity(self, service):
        # arrange
        activity_data = {"title": "Test", ...}

        # act
        result = service.create(activity_data)

        # assert
        assert result.title == "Test"

    def test_get_nonexistent_activity(self, service):
        result = service.get_by_id(uuid.uuid4())
        assert result is None
```

**Patterns:**
- Use beforeEach/setUp for per-test setup
- Clear mocks between tests
- Arrange/Act/Assert structure
- One assertion focus per test

## Mocking

**Frontend Framework:**
- Vitest built-in mocking (`vi.fn()`, `vi.mock()`)

**Frontend Patterns:**
```javascript
import { vi } from 'vitest'

// Mock module
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

// Mock in test
const mockFn = vi.fn()
mockFn.mockReturnValue('mocked result')

// Mock async
mockFn.mockResolvedValue({ data: 'test' })
```

**Backend Framework:**
- pytest fixtures
- unittest.mock (pytest-mock)

**What to Mock:**
- External API calls (Supabase, Twilio)
- Database connections (in unit tests)
- Time/dates

**What NOT to Mock:**
- Pure utility functions
- Simple data transformations

## Fixtures and Factories

**Frontend Test Data:**
- Mock files in `frontend/src/mocks/`
- `activities.mock.js` - Mock activity data
- `registrations.mock.js` - Mock registration data
- `users.mock.js` - Mock user data
- `userSwitcher.mock.js` - Switch mock user roles

**Backend Fixtures:**
```python
# backend/tests/conftest.py
import pytest

@pytest.fixture
def db_session():
    """Create test database session"""
    # Setup
    yield session
    # Teardown

@pytest.fixture
def test_user(db_session):
    """Create test user"""
    return User(email="test@example.com", ...)
```

**Location:**
- Frontend: `frontend/src/mocks/*.mock.js`
- Backend: `backend/tests/conftest.py`

## Coverage

**Requirements:**
- No enforced coverage target
- Coverage tracked for visibility

**Configuration:**
- Frontend: Vitest with @vitest/coverage-v8
- Backend: pytest-cov (if configured)

**View Coverage:**
```bash
# Frontend
npm run test:coverage
# Opens coverage/index.html

# Backend
pytest --cov=app tests/
```

## Test Types

**Unit Tests:**
- Frontend: Component rendering, prop handling
- Backend: Service methods, utility functions
- Scope: Single function/component in isolation
- Location: Co-located (frontend), `tests/unit/` (backend)

**Integration Tests:**
- Backend: API endpoints with database
- Location: `backend/tests/integration/`
- Setup: Test database, fixtures

**E2E Tests:**
- Framework: Playwright 1.57.0 (configured but usage unclear)
- Location: Not found in source files
- Status: Available but may not be implemented

## Common Patterns

**Async Testing (Frontend):**
```javascript
it('handles async operation', async () => {
  render(<AsyncComponent />)

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

**Error Testing (Frontend):**
```javascript
it('shows error on API failure', async () => {
  api.get.mockRejectedValue(new Error('API Error'))

  render(<Component />)

  await waitFor(() => {
    expect(screen.getByText('Error loading')).toBeInTheDocument()
  })
})
```

**Async Testing (Backend):**
```python
@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result == expected
```

**Snapshot Testing:**
- Not widely used in this codebase
- React Testing Library preferred for assertions

## Current Test Files

- `frontend/src/mocks/analytics.mock.test.js`
- `frontend/src/components/staff/AnalyticsCharts.test.jsx`
- `frontend/src/components/dashboard/StaffDashboard.test.jsx`
- `frontend/src/components/layout/Layout.test.jsx`
- `frontend/src/components/shared/Card.test.jsx`

---

*Testing analysis: 2026-01-19*
*Update when test patterns change*
