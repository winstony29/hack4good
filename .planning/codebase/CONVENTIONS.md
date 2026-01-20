# Coding Conventions

**Analysis Date:** 2026-01-20

## Naming Patterns

**Files:**
- PascalCase.jsx for React components (`ActivityCard.jsx`, `StaffDashboard.jsx`)
- camelCase.api.js for API services (`activities.api.js`)
- camelCase.mock.js for mock data files (`users.mock.js`)
- *.test.jsx for tests alongside source files
- snake_case.py for Python modules (`activity_service.py`)

**Functions:**
- camelCase for JavaScript functions (`handleSubmit`, `fetchActivities`)
- snake_case for Python functions (`get_activities`, `create_registration`)
- Prefix event handlers with `handle` (`handleClick`, `handleChange`)
- Prefix boolean getters with `is`/`has` where appropriate

**Variables:**
- camelCase for JavaScript variables
- snake_case for Python variables
- UPPER_SNAKE_CASE for constants (`USE_MOCK_DATA`)
- Descriptive names preferred over abbreviations

**Types/Components:**
- PascalCase for React components (`ActivityCard`, `VolunteerDashboard`)
- PascalCase for Python classes (`BaseService`)
- No prefix conventions (no `I` for interfaces)

## Code Style

**Formatting (Frontend):**
- No Prettier config detected - uses Vite defaults
- Single quotes for strings preferred
- Semicolons used inconsistently (some files omit)
- 2-space indentation

**Formatting (Backend):**
- PEP 8 style for Python
- 4-space indentation
- Double quotes for strings

**Linting:**
- ESLint for frontend (`frontend/package.json`)
- eslint-plugin-react and eslint-plugin-react-hooks
- No explicit Python linter configured

## Import Organization

**Frontend Order:**
1. React imports (`import { useState } from 'react'`)
2. Third-party libraries (`import { motion } from 'framer-motion'`)
3. Local components/contexts (`import { useAuth } from '../contexts/AuthContext'`)
4. Local services/utils (`import { fetchActivities } from '../services/activities.api'`)

**Backend Order:**
1. Standard library (`from datetime import datetime`)
2. Third-party (`from fastapi import APIRouter`)
3. Local imports (`from app.services import activity_service`)

**Grouping:**
- Blank lines between import groups
- No alphabetical sorting enforced

**Path Aliases:**
- No path aliases configured (relative imports used)

## Error Handling

**Frontend Patterns:**
- try/catch in async functions
- Toast notifications for user feedback (`react-hot-toast`)
- Error state in components (`const [error, setError] = useState(null)`)

**Backend Patterns:**
- FastAPI HTTPException for API errors
- Status codes: 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- Exception details in response body

**Error Types:**
- Frontend: Generic Error, network errors
- Backend: HTTPException with detail message

## Logging

**Framework:**
- Frontend: console.log for debugging
- Backend: print statements (no structured logging)

**Patterns:**
- Frontend mock mode logs user info: `console.log('Mock user loaded: ...')`
- No production logging strategy detected

## Comments

**When to Comment:**
- JSDoc not used consistently
- Inline comments for complex logic
- TODO comments for incomplete features

**TODO Comments:**
- Format: `// TODO: description` or `# TODO: description`
- Found in: `Profile.jsx`, `RegistrationsList.jsx`, `main.py`, `activities.py`, `registrations.py`

## Function Design

**Size:**
- Components kept reasonably sized (<200 lines)
- Functions vary in size, some could be extracted

**Parameters:**
- Destructuring used for props
- Object parameters for multiple values

**Return Values:**
- Early returns for guard clauses
- Async functions return promises

## Module Design

**Frontend Exports:**
- Named exports for utilities and services
- Default exports for React components (mixed usage)
- Context providers export both context and hook

**Backend Exports:**
- Module-level functions (no classes for most services)
- Service classes where needed (`BaseService`)

**Component Structure:**
```jsx
// Typical component structure
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function ComponentName({ props }) {
  const [state, setState] = useState(initial)
  const { user } = useAuth()

  const handleEvent = () => { /* ... */ }

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## React Patterns

**State Management:**
- useState for local state
- useContext for global state (Auth, Accessibility)
- No Redux or external state library

**Component Patterns:**
- Functional components only (no class components)
- Hooks for logic extraction
- Conditional rendering for role-based views

**Styling:**
- Tailwind CSS utility classes
- Inline styles minimal
- Custom colors defined in `tailwind.config.js`

---

*Convention analysis: 2026-01-20*
*Update when patterns change*
