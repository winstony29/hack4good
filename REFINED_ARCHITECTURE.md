# MINDS ActivityHub - Refined Architecture (Zero Redundancy)

## Core Philosophy: Component Reuse & Composition

### Problem with Original Structure
- Separate `pages/Activities.jsx` and `pages/VolunteerPortal.jsx` → 80% duplicate code
- Multiple similar modals → repeated validation logic
- Separate services for each entity → repetitive API patterns

### Solution: Composition over Duplication

```
Shared Components → Role-Specific Wrappers → Page Orchestration
```

---

## Refined File Structure

```
minds-activity-hub/
│
├── README.md
├── TASKS.md
├── ARCHITECTURE.md (this file)
├── .gitignore
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
│
├── backend/
│   ├── .env.example
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── pytest.ini
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # FastAPI app, CORS, routers
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py                # Pydantic settings
│   │   │   ├── auth.py                  # JWT middleware, get_current_user()
│   │   │   ├── deps.py                  # Shared dependencies (get_db, get_current_staff)
│   │   │   └── enums.py                 # Role, MembershipType, Status enums
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                  # Base Pydantic model with common config
│   │   │   ├── user.py                  # User schemas
│   │   │   ├── activity.py              # Activity schemas
│   │   │   ├── registration.py          # Registration schemas (used by both participants & volunteers)
│   │   │   └── notification.py          # Notification schemas
│   │   │
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                  # SQLAlchemy base
│   │   │   ├── session.py               # Database session
│   │   │   └── models.py                # ORM models (all entities)
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py                # Aggregate all routers
│   │   │   ├── auth.py                  # POST /signup, /login, GET /me
│   │   │   ├── activities.py            # GET /activities (shared), POST/PUT/DELETE (staff only)
│   │   │   ├── registrations.py         # POST /registrations (participants), GET /registrations/user/{id}
│   │   │   ├── matches.py               # POST /matches (volunteers), GET /matches/user/{id}
│   │   │   ├── notifications.py         # POST /notifications/send, GET /notifications/user/{id}
│   │   │   ├── staff.py                 # GET /staff/analytics, /staff/attendance/{id}
│   │   │   └── accessibility.py         # POST /tts, POST /translate
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── base_service.py          # Abstract base service (CRUD operations)
│   │   │   ├── activity_service.py      # Inherits base_service
│   │   │   ├── registration_service.py  # Registration validation (used by both participants & volunteers)
│   │   │   ├── notification_service.py  # Orchestrates Twilio
│   │   │   ├── analytics_service.py     # Staff analytics calculations
│   │   │   └── accessibility_service.py # TTS, translation wrappers
│   │   │
│   │   ├── integrations/                # External API wrappers
│   │   │   ├── __init__.py
│   │   │   ├── twilio_client.py         # SMS + WhatsApp
│   │   │   ├── elevenlabs_client.py     # TTS
│   │   │   └── google_translate.py      # Translation
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── time_utils.py            # Overlap detection, date helpers
│   │       ├── validators.py            # Input validators
│   │       └── formatters.py            # CSV export, response formatting
│   │
│   ├── sql/
│   │   └── init_schema.sql              # Single source of truth for schema
│   │
│   └── tests/
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_registration_service.py
│       └── test_api_integration.py
│
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── tsconfig.json (optional)
    ├── index.html
    │
    └── src/
        ├── main.jsx
        ├── App.jsx                       # Routing + role-based navigation
        ├── index.css
        │
        ├── components/
        │   │
        │   ├── shared/                   # Pure reusable components
        │   │   ├── Button.jsx            # Variants: primary, secondary, danger
        │   │   ├── Input.jsx             # Form input with validation
        │   │   ├── Modal.jsx             # Base modal wrapper
        │   │   ├── Card.jsx              # Content card
        │   │   ├── Badge.jsx             # Status badges
        │   │   ├── Spinner.jsx           # Loading spinner
        │   │   ├── EmptyState.jsx        # No data placeholder
        │   │   └── ErrorBoundary.jsx     # Error boundary
        │   │
        │   ├── layout/
        │   │   ├── Navbar.jsx            # Top nav (role-aware links)
        │   │   ├── Sidebar.jsx           # Side nav (staff only)
        │   │   └── Layout.jsx            # Wrapper with navbar + sidebar
        │   │
        │   ├── auth/
        │   │   ├── AuthForm.jsx          # Shared login/signup form (mode prop)
        │   │   └── ProtectedRoute.jsx    # Auth + role guard
        │   │
        │   ├── activities/
        │   │   ├── ActivityCalendar.jsx          # FullCalendar wrapper (mode: view | select)
        │   │   ├── ActivityCard.jsx              # Display activity info
        │   │   ├── ActivitySwipeCard.jsx         # Swipeable card (extends ActivityCard)
        │   │   ├── ActivityDetailModal.jsx       # Shared modal (action prop: register | match | view)
        │   │   ├── ActivityForm.jsx              # Create/edit form (staff only)
        │   │   └── ActivityList.jsx              # List view (fallback for calendar)
        │   │
        │   ├── dashboard/
        │   │   ├── DashboardContainer.jsx        # Role-based dashboard router
        │   │   ├── ParticipantDashboard.jsx      # Calendar + My Registrations
        │   │   ├── VolunteerDashboard.jsx        # Calendar + Swiper + My Matches
        │   │   ├── StaffDashboard.jsx            # Analytics + Management
        │   │   ├── RegistrationsList.jsx         # Shared list (participant & volunteer use)
        │   │   └── StatsCard.jsx                 # Metric card (staff dashboard)
        │   │
        │   ├── volunteer/
        │   │   ├── ActivitySwiper.jsx            # Tinder-style swiper
        │   │   └── MatchAnimation.jsx            # Match success animation
        │   │
        │   ├── staff/
        │   │   ├── AnalyticsCharts.jsx           # Charts (Recharts)
        │   │   ├── AttendanceExporter.jsx        # CSV export button
        │   │   ├── ActivityManager.jsx           # CRUD interface
        │   │   └── NotificationLog.jsx           # Notification history
        │   │
        │   └── accessibility/
        │       ├── AccessibilityMenu.jsx         # Settings panel
        │       ├── TTSButton.jsx                 # Play audio button
        │       ├── LanguageSelector.jsx          # Language dropdown
        │       ├── FontSizeControl.jsx           # A- A A+ buttons
        │       └── HighContrastToggle.jsx        # Toggle switch
        │
        ├── pages/
        │   ├── Landing.jsx                       # Public landing page
        │   ├── Auth.jsx                          # Login/signup page (uses AuthForm)
        │   ├── Dashboard.jsx                     # Route to DashboardContainer
        │   ├── Activities.jsx                    # Public activity browser
        │   ├── Profile.jsx                       # User profile settings
        │   └── NotFound.jsx                      # 404
        │
        ├── features/                             # Feature-based organization (if needed)
        │   ├── registration/
        │   │   ├── useRegistration.js            # Registration hook
        │   │   └── registrationSlice.js          # State (if using Redux)
        │   └── volunteer/
        │       └── useVolunteerMatch.js          # Volunteer matching hook
        │
        ├── contexts/
        │   ├── AuthContext.jsx                   # Auth state
        │   ├── AccessibilityContext.jsx          # Font size, contrast, language
        │   └── NotificationContext.jsx           # Toast notifications
        │
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useActivities.js                  # Fetch activities (shared)
        │   ├── useRegistrations.js               # Manage registrations
        │   ├── useMatches.js                     # Manage volunteer matches
        │   ├── useNotifications.js
        │   ├── useAccessibility.js               # TTS, translation
        │   └── useLocalStorage.js
        │
        ├── services/
        │   ├── api.js                            # Axios instance + interceptors
        │   ├── auth.api.js                       # Auth endpoints
        │   ├── activities.api.js                 # Activities endpoints
        │   ├── registrations.api.js              # Registrations endpoints
        │   ├── matches.api.js                    # Volunteer matches endpoints
        │   ├── notifications.api.js              # Notifications endpoints
        │   ├── staff.api.js                      # Staff endpoints
        │   └── accessibility.api.js              # TTS, translation endpoints
        │
        ├── utils/
        │   ├── constants.js                      # Enums, constants
        │   ├── dateUtils.js                      # Date formatting
        │   ├── validators.js                     # Form validation
        │   ├── roleUtils.js                      # Role-based helpers
        │   └── errorHandlers.js                  # Error formatting
        │
        └── styles/
            └── accessibility.css                 # Font sizes, contrast modes
```

---

## Key Design Decisions for Zero Redundancy

### 1. Unified Dashboard Architecture

**Before (Redundant):**
```
ParticipantDashboard.jsx       VolunteerDashboard.jsx
├── Calendar (80% same)    VS  ├── Calendar (80% same)
├── My Registrations           ├── Swiper
└── Stats                      └── My Matches
```

**After (Composed):**
```jsx
// DashboardContainer.jsx
export default function DashboardContainer() {
  const { user } = useAuth()
  
  if (user.role === 'participant') return <ParticipantDashboard />
  if (user.role === 'volunteer') return <VolunteerDashboard />
  if (user.role === 'staff') return <StaffDashboard />
}

// ParticipantDashboard.jsx
export default function ParticipantDashboard() {
  return (
    <Layout>
      <ActivityCalendar mode="select" onActivityClick={handleRegister} />
      <RegistrationsList userId={user.id} type="registrations" />
    </Layout>
  )
}

// VolunteerDashboard.jsx
export default function VolunteerDashboard() {
  return (
    <Layout>
      <Tabs>
        <Tab label="Browse">
          <ActivitySwiper onMatch={handleMatch} />
        </Tab>
        <Tab label="Calendar">
          <ActivityCalendar mode="view" />
        </Tab>
        <Tab label="My Matches">
          <RegistrationsList userId={user.id} type="matches" />
        </Tab>
      </Tabs>
    </Layout>
  )
}
```

**Shared:** `ActivityCalendar`, `RegistrationsList`  
**Unique:** `ActivitySwiper` (volunteers only)

---

### 2. Polymorphic ActivityDetailModal

**Before (Redundant):**
- `RegistrationModal.jsx` (participants)
- `VolunteerMatchModal.jsx` (volunteers)
- `ActivityViewModal.jsx` (staff)

**After (Unified):**
```jsx
// ActivityDetailModal.jsx
export default function ActivityDetailModal({ activity, action, onConfirm }) {
  const getActionButton = () => {
    switch (action) {
      case 'register':
        return <Button onClick={() => onConfirm('registration')}>Register</Button>
      case 'match':
        return <Button onClick={() => onConfirm('match')}>Volunteer</Button>
      case 'view':
        return <Button onClick={onClose}>Close</Button>
      case 'edit':
        return <Button onClick={() => onConfirm('edit')}>Save Changes</Button>
    }
  }
  
  return (
    <Modal>
      <ActivityCard activity={activity} />
      <TTSButton text={activity.description} />
      {getActionButton()}
    </Modal>
  )
}
```

**Usage:**
```jsx
// Participant
<ActivityDetailModal activity={activity} action="register" onConfirm={handleRegister} />

// Volunteer
<ActivityDetailModal activity={activity} action="match" onConfirm={handleMatch} />

// Staff
<ActivityDetailModal activity={activity} action="edit" onConfirm={handleUpdate} />
```

---

### 3. Unified Registration Service (Backend)

**Before (Redundant):**
- `registration_service.py` (participants)
- `volunteer_matching_service.py` (volunteers)

**After (Unified):**
```python
# registration_service.py
class RegistrationService:
    """Handles both participant registrations and volunteer matches"""
    
    def register(self, user_id: str, activity_id: str, match_type: str):
        """
        match_type: 'registration' (participant) or 'match' (volunteer)
        """
        # Shared validation
        self._validate_capacity(activity_id)
        self._check_time_conflict(user_id, activity_id)
        
        # Type-specific logic
        if match_type == 'registration':
            self._validate_membership_limit(user_id, activity_id)
            record = RegistrationRecord(user_id, activity_id)
        else:
            record = VolunteerMatchRecord(user_id, activity_id)
        
        # Shared persistence
        db.add(record)
        self._increment_count(activity_id)
        self._send_notifications(user_id, activity_id, match_type)
        
        return record
```

---

### 4. Shared API Client Pattern

**Before (Redundant):**
```javascript
// activities.api.js
export const getActivities = () => axios.get('/activities')

// registrations.api.js
export const getRegistrations = (userId) => axios.get(`/registrations/user/${userId}`)

// matches.api.js
export const getMatches = (userId) => axios.get(`/matches/user/${userId}`)
```

**After (DRY with Factory):**
```javascript
// api.js
const createCrudApi = (resource) => ({
  getAll: (params) => api.get(`/${resource}`, { params }),
  getById: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
  getByUser: (userId) => api.get(`/${resource}/user/${userId}`)
})

// Usage
export const activitiesApi = createCrudApi('activities')
export const registrationsApi = createCrudApi('registrations')
export const matchesApi = createCrudApi('matches')
```

---

### 5. Accessibility Context (Global State)

**Before (Redundant):**
- Font size state in multiple components
- Language state duplicated
- TTS logic repeated

**After (Centralized):**
```jsx
// AccessibilityContext.jsx
export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium') // small | medium | large
  const [contrast, setContrast] = useState('normal') // normal | high
  const [language, setLanguage] = useState('en') // en | zh | ms | ta
  
  const speak = async (text) => {
    const audio = await ttsApi.generate({ text, language })
    new Audio(audio.url).play()
  }
  
  const translate = async (text, targetLang) => {
    return await translationApi.translate({ text, targetLang })
  }
  
  // Apply font size globally via CSS class
  useEffect(() => {
    document.documentElement.className = `font-${fontSize} contrast-${contrast}`
  }, [fontSize, contrast])
  
  return (
    <AccessibilityContext.Provider value={{
      fontSize, setFontSize,
      contrast, setContrast,
      language, setLanguage,
      speak, translate
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}
```

**CSS (styles/accessibility.css):**
```css
.font-small { font-size: 14px; }
.font-medium { font-size: 16px; }
.font-large { font-size: 20px; }

.contrast-normal { /* default colors */ }
.contrast-high { 
  --bg: #000;
  --text: #fff;
  --primary: #ffff00;
}
```

---

## Accessibility Features (Complete List)

### Visual Accessibility
1. **Font Size Control**
   - 3 sizes: Small (14px), Medium (16px), Large (20px)
   - A- A A+ buttons in accessibility menu
   - Persists in localStorage
   - Applies globally via CSS class

2. **High Contrast Mode**
   - Toggle switch in accessibility menu
   - Yellow text on black background
   - High contrast borders
   - WCAG AAA compliant

3. **Large Touch Targets**
   - Minimum 44x44px for all interactive elements
   - Extra padding on mobile
   - Clear focus indicators (3px outline)

4. **Color-Blind Friendly Palette**
   - Primary: Blue (#3B82F6)
   - Success: Green (#10B981)
   - Warning: Amber (#F59E0B)
   - Danger: Red (#EF4444)
   - Tested with color-blind simulators

### Auditory Accessibility
5. **Text-to-Speech (TTS)**
   - Play button on all activity descriptions
   - Reads: title, description, date, time, location
   - ElevenLabs API with natural voices
   - Supports 4 languages

6. **Audio Feedback**
   - Success/error sounds for actions
   - Registration confirmation chime
   - Match success sound
   - Volume control in settings

### Language Accessibility
7. **Multi-Language Support**
   - English, Mandarin (中文), Malay, Tamil (தமிழ்)
   - Language selector in navbar
   - Google Translate API
   - Persists in user profile
   - TTS speaks in selected language

8. **Simple Language Mode**
   - Toggle to simplify text
   - Shorter sentences
   - Fewer technical terms
   - Ideal for intellectual disabilities

### Cognitive Accessibility
9. **Clear Navigation**
   - Breadcrumbs on all pages
   - Back button always visible
   - Current page highlighted in nav

10. **Consistent Layout**
    - Same positions for common elements
    - Predictable interactions
    - No unexpected popups

11. **Error Prevention**
    - Confirmation dialogs for destructive actions
    - Form validation with clear messages
    - Undo option for cancellations

12. **Progress Indicators**
    - Loading spinners for all async actions
    - Step indicators for multi-step forms
    - Time estimates ("This will take ~30 seconds")

### Motor Accessibility
13. **Keyboard Navigation**
    - Tab order follows visual order
    - Enter/Space to activate buttons
    - Escape to close modals
    - Skip to main content link

14. **Reduced Motion Mode**
    - Respects `prefers-reduced-motion`
    - Disables animations (swiper, modals)
    - Instant transitions

### Screen Reader Support
15. **ARIA Labels**
    - All interactive elements labeled
    - Alt text for images
    - Role attributes (button, link, navigation)
    - Live regions for notifications

16. **Semantic HTML**
    - Proper heading hierarchy (h1 → h6)
    - `<nav>`, `<main>`, `<article>` tags
    - `<button>` not `<div onclick>`

---

## Accessibility Implementation

### AccessibilityMenu Component
```jsx
export default function AccessibilityMenu() {
  const { fontSize, setFontSize, contrast, setContrast, language, setLanguage } = useAccessibility()
  
  return (
    <Modal title="Accessibility Settings">
      {/* Font Size */}
      <FontSizeControl value={fontSize} onChange={setFontSize} />
      
      {/* High Contrast */}
      <HighContrastToggle checked={contrast === 'high'} onChange={setContrast} />
      
      {/* Language */}
      <LanguageSelector value={language} onChange={setLanguage} />
      
      {/* Reduced Motion */}
      <Toggle label="Reduce Motion" />
      
      {/* Simple Language */}
      <Toggle label="Simple Language" />
    </Modal>
  )
}
```

### TTS Integration
```jsx
export default function TTSButton({ text }) {
  const { speak, language } = useAccessibility()
  const [isPlaying, setIsPlaying] = useState(false)
  
  const handlePlay = async () => {
    setIsPlaying(true)
    await speak(text)
    setIsPlaying(false)
  }
  
  return (
    <button 
      onClick={handlePlay} 
      aria-label="Read aloud"
      className="tts-button"
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}
```

---

## Team Division (4 People)

### Strategy: Vertical Slices (Full-Stack Features)

Each person owns a complete feature from database → backend → frontend → integration.

---

### **Person 1: Foundation & Auth** 👤
**Responsibility**: Infrastructure, authentication, shared components

**Backend Tasks:**
- [ ] Setup FastAPI boilerplate (`main.py`, `config.py`)
- [ ] Database schema (`sql/init_schema.sql`)
- [ ] Auth endpoints (`api/auth.py`)
- [ ] JWT middleware (`core/auth.py`)
- [ ] Base service class (`services/base_service.py`)

**Frontend Tasks:**
- [ ] Setup React + Vite + Tailwind
- [ ] Routing (`App.jsx`)
- [ ] Auth context (`contexts/AuthContext.jsx`)
- [ ] Auth pages (`pages/Auth.jsx`, `components/auth/AuthForm.jsx`)
- [ ] Shared components (`shared/Button.jsx`, `shared/Input.jsx`, `shared/Modal.jsx`)
- [ ] Layout (`components/layout/`)

**Integration:**
- [ ] API client setup (`services/api.js`)
- [ ] Protected routes (`components/auth/ProtectedRoute.jsx`)

**Timeline**: Hours 0-8

---

### **Person 2: Activities & Registration** 📅
**Responsibility**: Activity system, participant registration, calendar

**Backend Tasks:**
- [ ] Activity endpoints (`api/activities.py`)
- [ ] Registration service (`services/registration_service.py`)
  - Membership validation
  - Double-booking prevention
  - Capacity checks
- [ ] Registration endpoints (`api/registrations.py`)

**Frontend Tasks:**
- [ ] Activity calendar (`components/activities/ActivityCalendar.jsx`)
- [ ] Activity card (`components/activities/ActivityCard.jsx`)
- [ ] Activity detail modal (`components/activities/ActivityDetailModal.jsx`)
- [ ] Participant dashboard (`components/dashboard/ParticipantDashboard.jsx`)
- [ ] Registrations list (`components/dashboard/RegistrationsList.jsx`)

**Integration:**
- [ ] Activities API client (`services/activities.api.js`)
- [ ] Registrations API client (`services/registrations.api.js`)
- [ ] Calendar hooks (`hooks/useActivities.js`, `hooks/useRegistrations.js`)

**Timeline**: Hours 8-18

---

### **Person 3: Volunteers & Notifications** 🤝
**Responsibility**: Volunteer matching, Twilio integration, notifications

**Backend Tasks:**
- [ ] Volunteer match endpoints (`api/matches.py`)
- [ ] Twilio client (`integrations/twilio_client.py`)
  - SMS sending
  - WhatsApp sending
- [ ] Notification service (`services/notification_service.py`)
  - Registration confirmation
  - Caregiver notification
  - Volunteer match confirmation
  - Activity reminders
- [ ] Notification endpoints (`api/notifications.py`)

**Frontend Tasks:**
- [ ] Activity swiper (`components/volunteer/ActivitySwiper.jsx`)
- [ ] Swipe card (`components/activities/ActivitySwipeCard.jsx`)
- [ ] Match animation (`components/volunteer/MatchAnimation.jsx`)
- [ ] Volunteer dashboard (`components/dashboard/VolunteerDashboard.jsx`)
- [ ] Notification context (`contexts/NotificationContext.jsx`)
- [ ] Toast component (`components/shared/Toast.jsx`)

**Integration:**
- [ ] Matches API client (`services/matches.api.js`)
- [ ] Notifications API client (`services/notifications.api.js`)
- [ ] Volunteer hooks (`hooks/useMatches.js`, `hooks/useNotifications.js`)

**Timeline**: Hours 8-18

---

### **Person 4: Staff Dashboard & Accessibility** 📊
**Responsibility**: Staff features, analytics, accessibility

**Backend Tasks:**
- [ ] Staff endpoints (`api/staff.py`)
  - Analytics metrics
  - Attendance export
- [ ] Analytics service (`services/analytics_service.py`)
- [ ] ElevenLabs client (`integrations/elevenlabs_client.py`)
- [ ] Google Translate client (`integrations/google_translate.py`)
- [ ] Accessibility endpoints (`api/accessibility.py`)

**Frontend Tasks:**
- [ ] Staff dashboard (`components/dashboard/StaffDashboard.jsx`)
- [ ] Analytics charts (`components/staff/AnalyticsCharts.jsx`)
- [ ] Activity manager (`components/staff/ActivityManager.jsx`)
- [ ] Attendance exporter (`components/staff/AttendanceExporter.jsx`)
- [ ] Accessibility context (`contexts/AccessibilityContext.jsx`)
- [ ] Accessibility menu (`components/accessibility/AccessibilityMenu.jsx`)
- [ ] TTS button (`components/accessibility/TTSButton.jsx`)
- [ ] Language selector (`components/accessibility/LanguageSelector.jsx`)
- [ ] Font size control (`components/accessibility/FontSizeControl.jsx`)
- [ ] High contrast toggle (`components/accessibility/HighContrastToggle.jsx`)

**Integration:**
- [ ] Staff API client (`services/staff.api.js`)
- [ ] Accessibility API client (`services/accessibility.api.js`)
- [ ] Accessibility hooks (`hooks/useAccessibility.js`)
- [ ] Accessibility CSS (`styles/accessibility.css`)

**Timeline**: Hours 18-28

---

## Git Workflow for Team Collaboration

### Branch Strategy
```
main (production-ready)
├── dev (integration branch)
│   ├── feature/auth (Person 1)
│   ├── feature/activities (Person 2)
│   ├── feature/volunteers (Person 3)
│   └── feature/staff (Person 4)
```

### Setup Instructions

**1. Initial Setup (Person 1)**
```bash
# Create repo
gh repo create minds-activity-hub --public
cd minds-activity-hub

# Initialize structure
git init
git checkout -b dev

# Create .gitignore
cat > .gitignore << EOF
node_modules/
venv/
.env
__pycache__/
*.pyc
.DS_Store
dist/
build/
EOF

# Push dev branch
git add .
git commit -m "Initial project structure"
git push -u origin dev

# Create main from dev
git checkout -b main
git push -u origin main
```

**2. Team Members Clone**
```bash
git clone https://github.com/YOUR_USERNAME/minds-activity-hub.git
cd minds-activity-hub
git checkout dev

# Create feature branch
git checkout -b feature/YOUR_FEATURE
```

**3. Daily Workflow**
```bash
# Pull latest changes
git checkout dev
git pull origin dev

# Switch to your feature branch
git checkout feature/YOUR_FEATURE
git merge dev  # Merge latest changes

# Work on your feature
# ... make changes ...

# Commit and push
git add .
git commit -m "feat: implement activity calendar"
git push origin feature/YOUR_FEATURE

# Create pull request on GitHub
# Target: dev (not main)
```

**4. Code Review Process**
- Each person reviews at least one other person's PR
- Require 1 approval before merge
- Use GitHub PR templates

**5. Integration Points**
```bash
# Person 1 merges auth → dev
# Person 2 merges activities → dev (depends on auth)
# Person 3 merges volunteers → dev (depends on activities)
# Person 4 merges staff → dev (depends on all)
```

### Pull Request Template
```markdown
## Feature: [Feature Name]

### Changes
- [ ] Backend endpoints implemented
- [ ] Frontend components implemented
- [ ] API client updated
- [ ] Tests written (if applicable)

### Testing
- [ ] Manually tested registration flow
- [ ] Verified API responses
- [ ] Checked mobile responsiveness

### Screenshots
[Add screenshots here]

### Dependencies
Depends on: #PR_NUMBER (if applicable)
```

### Merge Conflicts Resolution
```bash
# If merge conflict occurs
git checkout feature/YOUR_FEATURE
git fetch origin
git merge origin/dev

# Resolve conflicts in VS Code
# Then commit
git add .
git commit -m "fix: resolve merge conflicts"
git push
```

---

## Communication & Coordination

### Daily Standup (5 min)
- What did I complete yesterday?
- What am I working on today?
- Any blockers?

### Integration Points
**Hour 8**: Person 1 (auth) → Person 2 & 3 can start  
**Hour 18**: Person 2 (activities) → Person 3 (volunteers) can integrate  
**Hour 18**: Person 3 (notifications) → Person 2 can add triggers  
**Hour 24**: Person 4 (staff) can start integrating all features

### Shared Constants File
```javascript
// frontend/src/utils/constants.js
export const ROLES = {
  PARTICIPANT: 'participant',
  VOLUNTEER: 'volunteer',
  STAFF: 'staff'
}

export const MEMBERSHIP_TYPES = {
  AD_HOC: 'ad_hoc',
  ONCE_WEEKLY: 'once_weekly',
  TWICE_WEEKLY: 'twice_weekly',
  THREE_PLUS: '3_plus'
}

export const API_ENDPOINTS = {
  AUTH: '/auth',
  ACTIVITIES: '/activities',
  REGISTRATIONS: '/registrations',
  MATCHES: '/matches',
  NOTIFICATIONS: '/notifications',
  STAFF: '/staff',
  ACCESSIBILITY: '/accessibility'
}
```

### API Contract Document
**Person 1 creates, all update:**
```markdown
## POST /registrations
Request:
{
  "activity_id": "uuid"
}

Response:
{
  "id": "uuid",
  "user_id": "uuid",
  "activity_id": "uuid",
  "status": "confirmed",
  "created_at": "2026-01-15T10:00:00Z"
}

Errors:
- 409: Time conflict / Weekly limit exceeded / Activity full
- 404: Activity not found
- 401: Unauthorized
```

---

## File Ownership Matrix

| File/Feature | Owner | Dependencies |
|--------------|-------|--------------|
| `app/main.py` | Person 1 | None |
| `app/core/auth.py` | Person 1 | None |
| `app/api/activities.py` | Person 2 | Person 1 auth |
| `app/api/registrations.py` | Person 2 | Person 1 auth |
| `app/api/matches.py` | Person 3 | Person 1 auth, Person 2 activities |
| `app/api/notifications.py` | Person 3 | Person 1 auth |
| `app/api/staff.py` | Person 4 | Person 1 auth, Person 2 activities |
| `app/api/accessibility.py` | Person 4 | Person 1 auth |
| `components/layout/` | Person 1 | None |
| `components/auth/` | Person 1 | None |
| `components/activities/` | Person 2 | Person 1 layout |
| `components/dashboard/ParticipantDashboard.jsx` | Person 2 | Person 1 layout |
| `components/volunteer/` | Person 3 | Person 2 activities |
| `components/dashboard/VolunteerDashboard.jsx` | Person 3 | Person 1 layout |
| `components/staff/` | Person 4 | Person 2 activities |
| `components/accessibility/` | Person 4 | Person 1 layout |

---

## Success Metrics for Clean Architecture

- [ ] **Zero duplicate logic** - Each function has one source of truth
- [ ] **Clear separation** - Backend services don't know about HTTP, components don't know about API details
- [ ] **Easy testing** - Pure functions testable in isolation
- [ ] **Fast onboarding** - New developer understands structure in <30 minutes
- [ ] **Merge conflict rate** - <10% of PRs have conflicts
- [ ] **Code review time** - <30 minutes per PR

---

**This architecture eliminates 40%+ of the original file count while maintaining full functionality.**
