# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- Python: `snake_case.py` for all modules (`activity_service.py`, `twilio_client.py`)
- React components: `PascalCase.jsx` (`AuthForm.jsx`, `ActivityCalendar.jsx`)
- JavaScript utilities: `camelCase.js` (`dateUtils.js`, `roleUtils.js`)
- Test files: `*.test.jsx` for React, `test_*.py` for Python
- API services: `*.api.js` (`activities.api.js`, `registrations.api.js`)
- Mock files: `*.mock.js` (`users.mock.js`, `activities.mock.js`)

**Functions:**
- Python: `snake_case` for all functions (`get_by_id`, `create_registration`)
- JavaScript: `camelCase` for all functions (`getCurrentMockUser`, `handleSubmit`)
- React event handlers: `handleEventName` pattern (`handleSubmit`, `handleCancel`)
- Async functions: No special prefix (async/await used transparently)

**Variables:**
- Python: `snake_case` for variables and parameters
- JavaScript: `camelCase` for variables
- Constants: `UPPER_SNAKE_CASE` (`USE_MOCK_DATA`, `API_BASE_URL`)
- React state: `[value, setValue]` pattern with useState

**Types:**
- Python Pydantic models: `PascalCase` (`UserBase`, `ActivityCreate`)
- Python Enums: `PascalCase` for name, `UPPER_CASE` for values (`Role.PARTICIPANT`)
- No TypeScript in this project (plain JavaScript)

## Code Style

**Formatting:**
- Python: Standard Python formatting (PEP 8 implied)
- JavaScript: ESLint configuration (`frontend/.eslintrc`)
- Indentation: 2 spaces for JS, 4 spaces for Python
- Quotes: Single quotes preferred in JavaScript
- Semicolons: Omitted in JavaScript (no-semi style)

**Linting:**
- Frontend: ESLint with React plugin
  - Config: `frontend/eslint.config.js` or `.eslintrc`
  - Plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
  - Run: `npm run lint`
- Backend: No explicit linter configured

## Import Organization

**Python (Backend):**
1. Standard library imports
2. Third-party imports (fastapi, sqlalchemy, pydantic)
3. Local imports (app.core, app.db, app.services)

Example from `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router
```

**JavaScript (Frontend):**
1. React imports first
2. Third-party library imports
3. Local service/context imports
4. Local component imports
5. Utility imports

Example from `frontend/src/contexts/AuthContext.jsx`:
```javascript
import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabase'
import { getCurrentMockUser } from '../mocks/userSwitcher.mock'
```

**Path Aliases:**
- None configured (relative imports used: `../services/`, `./components/`)

## Error Handling

**Patterns:**
- Frontend: try/catch with toast notifications
- Backend: FastAPI HTTPException with status codes
- Async: try/catch blocks around async operations

**Frontend Example:**
```javascript
try {
  const result = await api.post('/registrations', data)
  toast.success('Registration successful!')
} catch (error) {
  toast.error(error.response?.data?.detail || 'Registration failed')
}
```

**Backend Example:**
```python
from fastapi import HTTPException

if not activity:
    raise HTTPException(status_code=404, detail="Activity not found")
```

**Error Types:**
- 401: Unauthorized (triggers logout redirect in frontend)
- 404: Not found
- 422: Validation error (Pydantic)
- 500: Server error

## Logging

**Framework:**
- Frontend: `console.log`, `console.warn`, `console.error`
- Backend: No structured logging framework (print statements)

**Patterns:**
- Mock mode logging: Emoji prefixed messages (`🎭 Mock user loaded:`)
- Debug logging with descriptive context
- No production logging configuration

## Comments

**When to Comment:**
- Explain business logic or domain-specific rules
- Mark TODO items for incomplete features
- Document mock/development mode toggles

**JSDoc/TSDoc:**
- Not widely used (no TypeScript)
- Minimal function documentation

**TODO Comments:**
- Format: `# TODO: description` (Python), `// TODO: description` (JS)
- Found in: API route handlers, component files
- Example: `# TODO: Implement registration logic`

## Function Design

**Size:**
- Keep functions focused on single responsibility
- Extract helpers for complex logic

**Parameters:**
- Python: Type hints on parameters and return types
- JavaScript: Destructuring for props in React components
- Use options objects for many parameters

**Return Values:**
- Python: Explicit return types via type hints
- JavaScript: Implicit returns in arrow functions where appropriate
- Early returns for guard clauses

## Module Design

**Exports:**
- Python: `__init__.py` files for package exports
- JavaScript: Named exports preferred (`export const`, `export function`)
- Default exports for React components

**Barrel Files:**
- Python: `__init__.py` re-exports (`from app.models import *`)
- JavaScript: Not widely used (direct imports)

**React Component Pattern:**
```javascript
export function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue)

  const handleAction = () => {
    // handler logic
  }

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

---

*Convention analysis: 2026-01-19*
*Update when patterns change*
