# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- PascalCase.jsx - React components (`ActivityCard.jsx`, `Button.jsx`)
- camelCase.js - Utilities and services (`dateUtils.js`, `validators.js`)
- kebab-case.api.js - API services (`activities.api.js`, `matches.api.js`)
- kebab-case.mock.js - Mock data (`analytics.mock.js`, `users.mock.js`)
- *.test.jsx - Component tests (`Card.test.jsx`)
- *.spec.js - E2E tests (`accessibility.spec.js`)
- snake_case.py - Python backend files (`activity_service.py`)

**Functions:**
- camelCase for all functions (`formatDate`, `handleLogout`)
- `handle` prefix for event handlers (`handleClick`, `handleSubmit`, `handleChange`)
- `is`, `has`, `can` prefixes for boolean functions (`isFull`, `isUpcoming`, `isPast`)
- No special prefix for async functions

**Variables:**
- camelCase for variables (`userData`, `activityList`)
- UPPER_SNAKE_CASE for constants (`USE_MOCK_DATA`, `TOAST_COLORS`)
- No underscore prefix for private members

**Types (Python):**
- PascalCase for classes (`ActivityService`, `TwilioClient`)
- PascalCase for Enums (`Role`, `MembershipType`, `RegistrationStatus`)
- snake_case for function and method names

## Code Style

**Formatting:**
- 2 space indentation (consistent across all files)
- Single quotes for strings, backticks for template literals
- Semicolons present in JavaScript (mixed in JSX)
- No Prettier config file (uses ESLint defaults)

**Linting:**
- ESLint 8.55.0 with React plugins (`frontend/package.json`)
- Command: `npm run lint` (eslint . --ext js,jsx)
- Rules: eslint-plugin-react, eslint-plugin-react-hooks
- No explicit Prettier configuration

**Python:**
- PEP 8 style (inferred from code patterns)
- Type hints used in function signatures
- Pydantic models for data validation

## Import Organization

**Frontend Order:**
1. External packages (React, framer-motion, lucide-react)
2. React hooks (useState, useEffect)
3. Context hooks (useAuth, useAccessibility)
4. Internal components (relative imports)
5. Utils/services (relative imports)

**Example from `frontend/src/components/layout/Navbar.jsx`:**
```javascript
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../shared/Button'
```

**Grouping:**
- Blank line between groups
- No alphabetical sorting enforced

**Path Aliases:**
- Relative paths used throughout (no @/ aliases)
- Consistent `../../` for parent navigation

## Error Handling

**Frontend Patterns:**
- Try/catch in async operations
- Toast notifications for user feedback via react-hot-toast
- Error state with `useState` for component-level errors
- Console.log for development debugging

**Backend Patterns:**
- HTTPException for API errors with status codes
- Generic `except Exception as e:` blocks (should be more specific)
- Print statements for error logging (should migrate to logging module)
- Mock fallback for integration failures

**Example:**
```javascript
try {
  const data = await activitiesApi.getAll()
  setActivities(data)
} catch (err) {
  console.error('Failed to fetch activities:', err)
  toast.error('Failed to load activities')
}
```

## Logging

**Frontend:**
- Console.log for development debugging
- No structured logging framework
- Toast notifications for user-facing messages

**Backend:**
- Print statements (current state - not recommended)
- Should migrate to Python logging module
- Integrations use print for mock mode indication

**Patterns:**
- Log errors with context before handling
- No production logging framework configured

## Comments

**When to Comment:**
- Explain complex logic or algorithms
- Document component sections with JSX comments
- Explain workarounds or non-obvious behavior

**JSX Comments:**
```javascript
{/* Logo */}
{/* Desktop Navigation */}
{/* Mobile Navigation */}
```

**Module-Level Comments:**
```javascript
/**
 * Design System Constants
 *
 * Central export for all design system tokens.
 * Usage:
 *   import { TYPOGRAPHY, SPACING } from '@/constants';
 */
```

**TODO Comments:**
- Format: `// TODO: description` or `# TODO: description`
- No linked issues in TODO comments

## Function Design

**Size:**
- Keep components under 300 lines (some exceed this)
- Extract hooks for complex state logic
- Extract sub-components for repeated UI patterns

**Parameters:**
- Destructure props in function signature
- Default values inline: `{ variant = 'primary', size = 'medium' }`
- Spread remaining props: `...props`

**Return Values:**
- Components return JSX
- Service methods return data or throw errors
- Early returns for guard clauses

**Example:**
```javascript
export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  ...props
}) {
  // Implementation
}
```

## Module Design

**Frontend Exports:**
- Default export for main component
- Named exports for sub-components
- Named exports for utilities

**Example (Compound Component):**
```javascript
export default function Card({ children, className = '' }) { ... }
export function CardHeader({ children, className = '' }) { ... }
export function CardBody({ children, className = '' }) { ... }
export function CardFooter({ children, className = '' }) { ... }
```

**Backend Exports:**
- Classes exported directly
- No barrel files (import from specific modules)

**Barrel Files:**
- `frontend/src/constants/index.js` - Exports all design tokens
- Components import directly from files (no component barrel)

## Component Patterns

**Functional Components:**
- All components are functional (no class components)
- Hooks for state and effects
- Props destructuring with defaults

**Styling:**
- Tailwind CSS utility classes as primary styling
- CSS variables for accessibility theming
- Variant objects for component variations

**Variant Pattern:**
```javascript
const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}
```

**Context Pattern:**
- Create context with createContext()
- Custom hook with error for missing provider
- Provider component wraps children

---

*Convention analysis: 2026-01-19*
*Update when patterns change*
