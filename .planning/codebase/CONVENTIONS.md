# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- PascalCase.jsx for React components (`Button.jsx`, `AuthForm.jsx`, `DashboardContainer.jsx`)
- camelCase.js for utilities and services (`dateUtils.js`, `api.js`, `constants.js`)
- domain.api.js for API service files (`activities.api.js`, `auth.api.js`)
- snake_case.py for Python modules (`activity_service.py`, `notification_service.py`)
- *.mock.js for mock data files (`users.mock.js`, `activities.mock.js`)

**Functions:**
- camelCase for JavaScript functions (`getRoleLabel`, `canAccessStaffFeatures`)
- snake_case for Python functions (`get_activities`, `create_registration`)
- handle* prefix for event handlers (`handleSubmit`, `handleClick`)
- use* prefix for custom hooks (`useAuth`, `useAccessibility`)

**Variables:**
- camelCase for JavaScript variables
- UPPER_SNAKE_CASE for constants (`ROLES`, `MEMBERSHIP_TYPES`, `API_ENDPOINTS`)
- snake_case for Python variables

**Types:**
- No TypeScript in frontend (plain JavaScript with JSX)
- Pydantic models use PascalCase in backend (`User`, `Activity`, `RegistrationCreate`)

## Code Style

**Formatting:**
- No Prettier config found (no `.prettierrc`)
- 2-space indentation (observed in code)
- Single quotes for strings (JavaScript)
- No trailing commas (observed)

**Linting:**
- ESLint configured (`frontend/package.json`)
- Plugins: react, react-hooks, react-refresh
- Run: `npm run lint`

## Import Organization

**Frontend Order (observed):**
1. React imports (`import { useState, useEffect } from 'react'`)
2. External packages (`import { BrowserRouter } from 'react-router-dom'`)
3. Internal contexts (`import { useAuth } from '../contexts/AuthContext'`)
4. Internal components (`import Button from '../shared/Button'`)
5. Internal utilities (`import { ROLES } from '../utils/constants'`)

**Backend Order (observed):**
1. Standard library imports
2. Third-party imports (`from fastapi import FastAPI`)
3. Internal imports (`from app.core.config import settings`)

**Path Aliases:**
- None configured (relative imports used)

## Error Handling

**Frontend Patterns:**
- try/catch in async functions
- Toast notifications for user feedback (`react-hot-toast`)
- Console.error for debugging
- Axios interceptor handles 401 → redirect to `/auth`

```jsx
// Example from AuthContext.jsx
const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}
```

**Backend Patterns:**
- HTTP exceptions for client errors
- TODO: Most error handling not yet implemented

## Logging

**Framework:**
- Console.log/console.warn/console.error (frontend)
- No structured logging (backend)

**Patterns:**
- Emoji prefixes for mock mode: `console.log('🎭 Mock user loaded: ...')`
- Error context logged before throwing

## Comments

**When to Comment:**
- TODO comments for unimplemented features
- Inline comments for complex logic (minimal usage)

**TODO Comments:**
- Format: `// TODO: description` (frontend)
- Format: `# TODO: description` (backend)
- No issue tracking links

**JSDoc:**
- Not used in frontend
- No docstrings in Python (minimal)

## Function Design

**Size:**
- Components kept reasonably small
- Complex logic extracted to utilities

**Parameters:**
- Destructuring for props: `function Button({ variant, size, children })`
- Default values in destructuring: `variant = 'primary'`
- Spread for passthrough: `{...props}`

**Return Values:**
- Early returns for loading states
- Explicit returns in non-JSX functions

## Component Patterns

**React Components:**

```jsx
// Default export pattern
export default function ComponentName({ props }) {
  // hooks at top
  const { user } = useAuth()
  const [state, setState] = useState(null)

  // early returns for loading/error
  if (loading) return <Spinner />

  // main render
  return (
    <div className="...">
      {/* content */}
    </div>
  )
}
```

**Context Pattern:**

```jsx
export const MyContext = createContext()

export const useMyContext = () => {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider')
  }
  return context
}

export function MyProvider({ children }) {
  // state and logic
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>
}
```

## Styling Patterns

**Tailwind CSS:**
- Utility classes inline in className
- Template literal for conditional classes
- Custom colors defined in `tailwind.config.js` (primary palette)

```jsx
className={`
  ${variants[variant]}
  ${sizes[size]}
  ${fullWidth ? 'w-full' : ''}
  rounded-lg font-medium
`}
```

**Accessibility:**
- min-h-[44px] for touch targets
- focus:ring for keyboard navigation
- ARIA attributes where needed

## Module Design

**Exports:**
- Default exports for React components
- Named exports for utilities, constants, hooks
- API modules export object with methods

**Barrel Files:**
- Not used (direct imports)

---

*Convention analysis: 2026-01-19*
*Update when patterns change*
