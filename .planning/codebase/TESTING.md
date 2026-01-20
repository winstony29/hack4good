# Testing Patterns

**Analysis Date:** 2026-01-20

## Test Framework

**Frontend Runner:**
- Vitest 4.0.17 (`frontend/package.json`)
- Config: `frontend/vitest.config.js`

**Frontend Assertion Library:**
- Vitest built-in expect
- @testing-library/jest-dom for DOM matchers
- @testing-library/react for component rendering

**Backend Runner:**
- pytest 7.4.3 (`backend/requirements.txt`)
- Config: `backend/pytest.ini`

**E2E Framework:**
- Playwright 1.57.0 (`frontend/package.json`)
- Config: `frontend/playwright.config.js`

**Run Commands:**
```bash
# Frontend
npm test                              # Run all tests (watch mode)
npm run test:run                      # Run all tests once
npm run test:coverage                 # Run with coverage report

# Backend
pytest                                # Run all tests
pytest -v                             # Verbose output
pytest tests/specific_test.py         # Single file

# E2E
npx playwright test                   # Run Playwright tests
```

## Test File Organization

**Frontend Location:**
- `*.test.jsx` co-located alongside source files
- Example: `Card.jsx` + `Card.test.jsx` in same directory

**Backend Location:**
- `backend/tests/` directory (separate from source)

**Naming:**
- Frontend: `{ComponentName}.test.jsx`
- Backend: `test_{module}.py`

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

backend/
  tests/
    (test files here)
```

## Test Structure

**Frontend Suite Organization:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Component from './Component'

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const { user } = render(<Component />)
    await user.click(screen.getByRole('button'))
    expect(/* assertion */).toBe(true)
  })
})
```

**Patterns:**
- Use `describe` to group related tests
- Use `beforeEach` for setup, `vi.clearAllMocks()` for mock reset
- One assertion focus per test
- Testing Library queries: `getByText`, `getByRole`, `getByTestId`

## Mocking

**Framework:**
- Vitest built-in mocking (`vi`)
- Module mocking via `vi.mock()`

**Patterns:**
```javascript
import { vi } from 'vitest'

// Mock a module
vi.mock('../services/activities.api', () => ({
  fetchActivities: vi.fn()
}))

// Mock in test
import { fetchActivities } from '../services/activities.api'

it('fetches data', async () => {
  vi.mocked(fetchActivities).mockResolvedValue([{ id: 1 }])
  // test code
})
```

**Context Mocking:**
```javascript
// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', user_metadata: { role: 'staff' } },
    loading: false
  })
}))
```

**What to Mock:**
- API service calls
- Context providers
- External libraries (framer-motion, etc.)

**What NOT to Mock:**
- Component internals
- Simple utility functions

## Fixtures and Factories

**Test Data:**
- Mock data files in `frontend/src/mocks/`
- Can be imported directly into tests

```javascript
import { getMockActivities } from '../mocks/activities.mock'
import { getMockUser } from '../mocks/users.mock'

const testActivity = getMockActivities()[0]
```

**Location:**
- Shared mocks: `frontend/src/mocks/`
- Test-specific data: Inline in test file

## Coverage

**Requirements:**
- No enforced coverage target
- Coverage available via `npm run test:coverage`

**Configuration:**
```javascript
// vitest.config.js
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  include: ['src/**/*.{js,jsx}'],
  exclude: ['src/test/**', 'src/mocks/**'],
}
```

**View Coverage:**
```bash
npm run test:coverage
# Coverage report in coverage/ directory
```

## Test Types

**Unit Tests (Frontend):**
- Scope: Individual component rendering and behavior
- Location: `*.test.jsx` files
- Mocking: Mock API calls, contexts
- Examples: `Card.test.jsx`, `Layout.test.jsx`

**Integration Tests (Frontend):**
- Scope: Component + context interaction
- Location: Same as unit tests
- Mocking: External APIs only
- Examples: `StaffDashboard.test.jsx`

**E2E Tests:**
- Framework: Playwright
- Scope: Full user flows
- Location: Separate Playwright config
- Status: Config present but tests minimal

**Backend Unit Tests:**
- Framework: pytest
- Location: `backend/tests/`
- Mocking: External services, database

## Common Patterns

**Async Testing:**
```javascript
it('should load data', async () => {
  render(<Component />)
  await screen.findByText('Loaded')
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

**Error Testing:**
```javascript
it('should show error state', async () => {
  vi.mocked(fetchData).mockRejectedValue(new Error('Failed'))
  render(<Component />)
  await screen.findByText('Error')
})
```

**User Event Testing:**
```javascript
import userEvent from '@testing-library/user-event'

it('handles click', async () => {
  const user = userEvent.setup()
  render(<Button onClick={mockFn} />)
  await user.click(screen.getByRole('button'))
  expect(mockFn).toHaveBeenCalled()
})
```

**Snapshot Testing:**
- Not used in this codebase
- Prefer explicit assertions

## Current Test Coverage

**Components with Tests:**
- `frontend/src/components/shared/Card.test.jsx`
- `frontend/src/components/layout/Layout.test.jsx`
- `frontend/src/components/staff/AnalyticsCharts.test.jsx`
- `frontend/src/components/dashboard/StaffDashboard.test.jsx`
- `frontend/src/mocks/analytics.mock.test.js`

**Components without Tests:**
- Most page components
- Auth components
- Activity components
- Volunteer swiper components

---

*Testing analysis: 2026-01-20*
*Update when test patterns change*
