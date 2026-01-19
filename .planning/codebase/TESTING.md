# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Frontend Unit/Component Tests:**
- Runner: Vitest 4.0.17
- Config: `frontend/vitest.config.js`
- Environment: jsdom
- Setup file: `frontend/src/test/setup.js`

**Frontend E2E Tests:**
- Runner: Playwright 1.57.0
- Config: `frontend/playwright.config.js`
- Browser: Chromium only
- Base URL: http://localhost:5173

**Backend Tests:**
- Runner: Pytest 7.4.3
- Config: `backend/tests/conftest.py`
- HTTP client: httpx for async testing

**Assertion Libraries:**
- Vitest: Built-in expect (toBe, toEqual, toThrow, toMatchObject)
- Playwright: Built-in expect (toHaveTitle, toBeVisible, etc.)
- React Testing Library: @testing-library/jest-dom matchers

**Run Commands:**
```bash
# Frontend
npm test                    # Run Vitest in watch mode
npm run test:run           # Run Vitest once
npm run test:coverage      # Generate coverage report

# E2E (requires dev server running)
npx playwright test        # Run Playwright tests

# Backend
pytest                     # Run all backend tests
pytest tests/unit/         # Run unit tests only
pytest tests/integration/  # Run integration tests only
```

## Test File Organization

**Frontend Location:**
- Unit/component tests: Colocated with source (e.g., `Card.test.jsx` next to `Card.jsx`)
- E2E tests: `frontend/tests/e2e/` directory
- Mock data tests: `frontend/src/mocks/*.test.js`

**Backend Location:**
- Unit tests: `backend/tests/unit/`
- Integration tests: `backend/tests/integration/`
- Fixtures: `backend/tests/conftest.py`

**Naming:**
- Component tests: `ComponentName.test.jsx`
- E2E tests: `feature.spec.js`
- Backend tests: `test_feature_name.py`

**Structure:**
```
frontend/
├── src/
│   ├── components/
│   │   └── shared/
│   │       ├── Card.jsx
│   │       └── Card.test.jsx     # Colocated test
│   └── mocks/
│       ├── analytics.mock.js
│       └── analytics.mock.test.js
└── tests/
    └── e2e/
        └── accessibility.spec.js  # E2E tests

backend/
└── tests/
    ├── conftest.py               # Fixtures
    ├── unit/
    │   ├── test_accessibility_service.py
    │   ├── test_elevenlabs_client.py
    │   ├── test_google_translate.py
    │   └── test_notification_service.py
    └── integration/
        └── test_accessibility_api.py
```

## Test Structure

**Vitest/React Testing Library Pattern:**
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card, { CardHeader, CardBody } from './Card'

describe('Card Component', () => {
  describe('Card', () => {
    it('renders children content', () => {
      render(<Card>Test Content</Card>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Card className="custom-class">Content</Card>)
      const card = screen.getByText('Content').parentElement
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('renders with correct styles', () => {
      // Test sub-component
    })
  })
})
```

**Patterns:**
- Nested `describe()` blocks for component sections
- Single responsibility per test case
- Arrange/Act/Assert pattern (comments optional)
- Test both rendering and CSS class application

## Mocking

**Vitest Module Mocking:**
```javascript
import { describe, it, expect, vi } from 'vitest'

// Mock module at top of file
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User', role: 'staff' }
  })
}))

describe('StaffDashboard', () => {
  it('displays stats for staff user', () => {
    render(<StaffDashboard />)
    expect(screen.getByText('Total Activities')).toBeInTheDocument()
  })
})
```

**What to Mock:**
- React Contexts (AuthContext, AccessibilityContext)
- API service calls
- External libraries (ResizeObserver, matchMedia)
- Browser APIs

**What NOT to Mock:**
- Pure utility functions
- Simple component props
- CSS classes

**Test Setup (`frontend/src/test/setup.js`):**
```javascript
import '@testing-library/jest-dom'

// Mock ResizeObserver (Recharts dependency)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query) => ({
    matches: false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
  })
})
```

## E2E Testing (Playwright)

**Configuration (`frontend/playwright.config.js`):**
```javascript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  }],
})
```

**E2E Test Pattern:**
```javascript
import { test, expect } from '@playwright/test'

test.describe('Accessibility Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/MINDS ActivityHub/)
  })

  test('font size persists via localStorage', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('fontSize', 'large')
    })
    await page.reload()
    // Assert font size applied
  })
})
```

**API Mocking with Playwright:**
```javascript
test('displays activities from API', async ({ page }) => {
  await page.route('**/api/activities', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: '1', title: 'Test Activity' }
      ])
    })
  })

  await page.goto('/activities')
  await expect(page.locator('text=Test Activity')).toBeVisible()
})
```

## Backend Testing (Pytest)

**Test Pattern:**
```python
import pytest
from unittest.mock import Mock, patch

class TestAccessibilityService:
    def test_text_to_speech_returns_audio(self):
        # Arrange
        service = AccessibilityService()

        # Act
        result = service.generate_speech("Hello", "en")

        # Assert
        assert result is not None
        assert "audio" in result
```

**Fixtures (`backend/tests/conftest.py`):**
```python
import pytest

@pytest.fixture
def test_db():
    # Setup test database
    yield db_session
    # Cleanup

@pytest.fixture
def auth_headers():
    return {"Authorization": "Bearer test-token"}
```

## Coverage

**Frontend Configuration:**
```javascript
// vitest.config.js
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  include: ['src/**/*.{js,jsx}'],
  exclude: ['src/test/**', 'src/mocks/**'],
}
```

**Requirements:**
- No enforced coverage target
- Coverage tracked for awareness
- Focus on critical paths (auth, API calls)

**View Coverage:**
```bash
npm run test:coverage
open coverage/index.html
```

## Test Types

**Unit Tests:**
- Scope: Single function/component in isolation
- Location: Colocated with source
- Mocking: Mock all external dependencies
- Speed: Each test <100ms
- Examples: `Card.test.jsx`, `StaffDashboard.test.jsx`

**Integration Tests:**
- Scope: Multiple modules together
- Location: `backend/tests/integration/`
- Mocking: Mock external services only
- Examples: `test_accessibility_api.py`

**E2E Tests:**
- Scope: Full user flows
- Location: `frontend/tests/e2e/`
- Mocking: API responses when needed
- Framework: Playwright
- Examples: `accessibility.spec.js`

## Common Patterns

**Async Testing:**
```javascript
it('fetches data on mount', async () => {
  render(<Component />)

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

**Error Testing:**
```javascript
it('shows error toast on API failure', async () => {
  vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

  render(<Component />)

  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument()
  })
})
```

**Snapshot Testing:**
- Not used in this codebase
- Prefer explicit assertions for clarity

---

*Testing analysis: 2026-01-19*
*Update when test patterns change*
