# Team Workflow & Task Distribution

## Team Structure

```
Person 1: Foundation Lead (Backend + Frontend Infrastructure)
Person 2: Activities Lead (Registration System)
Person 3: Engagement Lead (Volunteers + Notifications)
Person 4: Experience Lead (Staff Dashboard + Accessibility)
```

---

## Detailed Task Breakdown by Person

### **Person 1: Foundation Lead** 🏗️

**Skills Required**: FastAPI, React, Authentication, Database Design

#### Backend Tasks (8 hours)

**Phase 1: Initial Setup (2 hours)**
- [ ] Initialize FastAPI project structure
  ```bash
  mkdir -p backend/app/{api,core,db,models,services,integrations,utils}
  touch backend/app/main.py backend/requirements.txt
  ```
- [ ] Create `backend/requirements.txt`
  ```
  fastapi==0.104.1
  uvicorn[standard]==0.24.0
  supabase==2.0.0
  sqlalchemy==2.0.23
  alembic==1.12.1
  pydantic-settings==2.1.0
  python-dotenv==1.0.0
  pytest==7.4.3
  ```
- [ ] Create `backend/app/main.py`
  - FastAPI app initialization
  - CORS middleware for `http://localhost:5173`
  - Include routers
  - Health check endpoint

**Phase 2: Configuration (1 hour)**
- [ ] Create `backend/app/core/config.py`
  - Load environment variables using `pydantic-settings`
  - Database URL, Supabase keys, JWT secret
- [ ] Create `backend/.env.example`
  ```
  SUPABASE_URL=
  SUPABASE_ANON_KEY=
  DATABASE_URL=
  JWT_SECRET_KEY=
  ```

**Phase 3: Database (2 hours)**
- [ ] Create `backend/sql/init_schema.sql`
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('participant', 'volunteer', 'staff')),
    membership_type VARCHAR(20) CHECK (membership_type IN ('ad_hoc', 'once_weekly', 'twice_weekly', '3_plus')),
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    max_capacity INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    program_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, activity_id)
  );

  CREATE TABLE volunteer_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed',
    matched_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(volunteer_id, activity_id)
  );

  CREATE INDEX idx_registrations_user ON registrations(user_id);
  CREATE INDEX idx_registrations_activity ON registrations(activity_id);
  CREATE INDEX idx_activities_date ON activities(date);
  ```
- [ ] Create `backend/app/db/models.py` (SQLAlchemy ORM models)

**Phase 4: Authentication (3 hours)**
- [ ] Create `backend/app/core/auth.py`
  ```python
  from fastapi import Depends, HTTPException, status
  from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
  from supabase import create_client
  
  security = HTTPBearer()
  
  async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
      token = credentials.credentials
      # Verify JWT with Supabase
      user = supabase.auth.get_user(token)
      if not user:
          raise HTTPException(status_code=401, detail="Invalid token")
      return user
  
  async def get_current_staff(current_user = Depends(get_current_user)):
      if current_user.role != 'staff':
          raise HTTPException(status_code=403, detail="Staff only")
      return current_user
  ```
- [ ] Create `backend/app/models/user.py`
  ```python
  from pydantic import BaseModel, EmailStr
  
  class UserCreate(BaseModel):
      email: EmailStr
      password: str
      role: str
      membership_type: str | None = None
  
  class UserResponse(BaseModel):
      id: str
      email: str
      role: str
      membership_type: str | None
  ```
- [ ] Create `backend/app/api/auth.py`
  ```python
  from fastapi import APIRouter
  
  router = APIRouter(prefix="/auth", tags=["auth"])
  
  @router.post("/signup")
  async def signup(user: UserCreate):
      # Create user in Supabase Auth
      # Store metadata in users table
      pass
  
  @router.post("/login")
  async def login(email: str, password: str):
      # Login with Supabase
      pass
  
  @router.get("/me")
  async def get_me(current_user = Depends(get_current_user)):
      return current_user
  ```

#### Frontend Tasks (8 hours)

**Phase 1: Setup (2 hours)**
- [ ] Initialize React + Vite
  ```bash
  npm create vite@latest frontend -- --template react
  cd frontend
  npm install
  ```
- [ ] Install dependencies
  ```bash
  npm install react-router-dom axios @supabase/supabase-js
  npm install react-hot-toast
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configure Tailwind in `tailwind.config.js`
- [ ] Create `frontend/.env.example`
  ```
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
  VITE_API_BASE_URL=http://localhost:8000
  ```

**Phase 2: Routing & Layout (2 hours)**
- [ ] Create `frontend/src/App.jsx`
  ```jsx
  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import { AuthProvider } from './contexts/AuthContext'
  import ProtectedRoute from './components/auth/ProtectedRoute'
  
  function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    )
  }
  ```
- [ ] Create `frontend/src/components/layout/Layout.jsx`
  ```jsx
  import Navbar from './Navbar'
  
  export default function Layout({ children }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    )
  }
  ```
- [ ] Create `frontend/src/components/layout/Navbar.jsx`
  - Logo, navigation links (role-aware)
  - Accessibility menu button
  - Logout button

**Phase 3: Shared Components (2 hours)**
- [ ] Create `frontend/src/components/shared/Button.jsx`
  ```jsx
  export default function Button({ children, variant = 'primary', ...props }) {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    }
    
    return (
      <button 
        className={`px-4 py-2 rounded-lg font-medium transition ${variants[variant]}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  ```
- [ ] Create `frontend/src/components/shared/Input.jsx`
- [ ] Create `frontend/src/components/shared/Modal.jsx`
- [ ] Create `frontend/src/components/shared/Spinner.jsx`
- [ ] Create `frontend/src/components/shared/Card.jsx`

**Phase 4: Authentication (2 hours)**
- [ ] Create `frontend/src/contexts/AuthContext.jsx`
  ```jsx
  import { createContext, useState, useEffect } from 'react'
  import { supabase } from '../services/supabase'
  
  export const AuthContext = createContext()
  
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
      })
      
      return () => subscription.unsubscribe()
    }, [])
    
    const login = async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    }
    
    const signup = async (email, password, userData) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: userData }
      })
      if (error) throw error
      return data
    }
    
    const logout = async () => {
      await supabase.auth.signOut()
    }
    
    return (
      <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }
  ```
- [ ] Create `frontend/src/components/auth/AuthForm.jsx`
  - Shared form for login/signup
  - Mode prop: 'login' | 'signup'
- [ ] Create `frontend/src/components/auth/ProtectedRoute.jsx`
- [ ] Create `frontend/src/pages/Auth.jsx`
- [ ] Create `frontend/src/services/api.js` (Axios instance)

**Deliverables:**
- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ Auth working (signup, login, logout)
- ✅ Protected routes functional

---

### **Person 2: Activities Lead** 📅

**Skills Required**: Backend APIs, React Calendar, Form Validation

**Dependencies**: Wait for Person 1 to complete auth system (Hour 8)

#### Backend Tasks (5 hours)

**Phase 1: Activity Models (1 hour)**
- [ ] Create `backend/app/models/activity.py`
  ```python
  from pydantic import BaseModel
  from datetime import date, time
  
  class ActivityCreate(BaseModel):
      title: str
      description: str
      date: date
      start_time: time
      end_time: time
      location: str
      max_capacity: int
      program_type: str
  
  class ActivityResponse(ActivityCreate):
      id: str
      current_participants: int
  ```

**Phase 2: Activity Service (2 hours)**
- [ ] Create `backend/app/services/activity_service.py`
  ```python
  class ActivityService:
      async def get_activities(self, filters: dict):
          # Get activities with optional filters (date, program_type)
          pass
      
      async def create_activity(self, activity: ActivityCreate):
          # Create activity (staff only)
          pass
      
      async def update_activity(self, id: str, activity: ActivityCreate):
          # Update activity
          pass
  ```
- [ ] Create `backend/app/api/activities.py`
  ```python
  @router.get("/activities")
  async def get_activities(
      date: date | None = None,
      program_type: str | None = None
  ):
      return await activity_service.get_activities({...})
  
  @router.post("/activities")
  async def create_activity(
      activity: ActivityCreate,
      current_user = Depends(get_current_staff)
  ):
      return await activity_service.create_activity(activity)
  ```

**Phase 3: Registration Service (2 hours)**
- [ ] Create `backend/app/services/registration_service.py`
  ```python
  class RegistrationService:
      async def validate_membership_limit(self, user_id: str, activity_date: date):
          """Check if user exceeded weekly registration limit"""
          user = await get_user(user_id)
          
          if user.membership_type == 'once_weekly':
              # Check registrations in same week
              count = await count_registrations_this_week(user_id, activity_date)
              if count >= 1:
                  raise ConflictError("Weekly limit exceeded")
          
          elif user.membership_type == 'twice_weekly':
              count = await count_registrations_this_week(user_id, activity_date)
              if count >= 2:
                  raise ConflictError("Weekly limit exceeded")
      
      async def check_time_conflict(self, user_id: str, activity_id: str):
          """Check if user has overlapping activity"""
          activity = await get_activity(activity_id)
          registrations = await get_user_registrations_on_date(user_id, activity.date)
          
          for reg in registrations:
              reg_activity = await get_activity(reg.activity_id)
              if time_overlaps(activity.start_time, activity.end_time, 
                             reg_activity.start_time, reg_activity.end_time):
                  raise ConflictError("Time conflict detected")
      
      async def register_for_activity(self, user_id: str, activity_id: str):
          """Main registration logic"""
          activity = await get_activity(activity_id)
          
          # Validate capacity
          if activity.current_participants >= activity.max_capacity:
              raise ConflictError("Activity full")
          
          # Validate membership limit
          await self.validate_membership_limit(user_id, activity.date)
          
          # Check time conflict
          await self.check_time_conflict(user_id, activity_id)
          
          # Create registration
          registration = await create_registration(user_id, activity_id)
          
          # Increment count
          await increment_participant_count(activity_id)
          
          return registration
  ```
- [ ] Create `backend/app/api/registrations.py`
  ```python
  @router.post("/registrations")
  async def register(
      activity_id: str,
      current_user = Depends(get_current_user)
  ):
      try:
          registration = await registration_service.register_for_activity(
              current_user.id, activity_id
          )
          return registration
      except ConflictError as e:
          raise HTTPException(status_code=409, detail=str(e))
  ```

#### Frontend Tasks (5 hours)

**Phase 1: Activity Calendar (3 hours)**
- [ ] Install FullCalendar
  ```bash
  npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
  ```
- [ ] Create `frontend/src/components/activities/ActivityCalendar.jsx`
  ```jsx
  import FullCalendar from '@fullcalendar/react'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  
  export default function ActivityCalendar({ mode = 'view', onActivityClick }) {
    const [activities, setActivities] = useState([])
    
    useEffect(() => {
      // Fetch activities
      activitiesApi.getAll().then(data => {
        const events = data.map(activity => ({
          id: activity.id,
          title: activity.title,
          start: `${activity.date}T${activity.start_time}`,
          end: `${activity.date}T${activity.end_time}`,
          extendedProps: activity
        }))
        setActivities(events)
      })
    }, [])
    
    return (
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={activities}
        eventClick={({ event }) => onActivityClick(event.extendedProps)}
        selectable={mode === 'select'}
      />
    )
  }
  ```
- [ ] Create CSS overrides in `frontend/src/styles/calendar.css`

**Phase 2: Activity Components (2 hours)**
- [ ] Create `frontend/src/components/activities/ActivityCard.jsx`
  ```jsx
  export default function ActivityCard({ activity, showCapacity = true }) {
    return (
      <Card>
        <h3 className="text-xl font-bold">{activity.title}</h3>
        <p className="text-gray-600">{activity.description}</p>
        <div className="flex gap-4 mt-4">
          <span>📅 {activity.date}</span>
          <span>⏰ {activity.start_time} - {activity.end_time}</span>
          <span>📍 {activity.location}</span>
        </div>
        {showCapacity && (
          <Badge>{activity.current_participants}/{activity.max_capacity} spots</Badge>
        )}
      </Card>
    )
  }
  ```
- [ ] Create `frontend/src/components/activities/ActivityDetailModal.jsx`
  ```jsx
  export default function ActivityDetailModal({ activity, action, onConfirm }) {
    const getActionButton = () => {
      switch (action) {
        case 'register':
          return <Button onClick={() => onConfirm('registration')}>Register</Button>
        case 'match':
          return <Button onClick={() => onConfirm('match')}>Volunteer</Button>
        case 'view':
          return <Button variant="secondary" onClick={onClose}>Close</Button>
      }
    }
    
    return (
      <Modal title={activity.title}>
        <ActivityCard activity={activity} />
        <TTSButton text={`${activity.title}. ${activity.description}`} />
        {getActionButton()}
      </Modal>
    )
  }
  ```

**Phase 3: Participant Dashboard (Remaining time)**
- [ ] Create `frontend/src/components/dashboard/ParticipantDashboard.jsx`
- [ ] Create `frontend/src/components/dashboard/RegistrationsList.jsx`
- [ ] Create API clients in `frontend/src/services/`

**Deliverables:**
- ✅ Activities displayed in calendar
- ✅ Registration flow working
- ✅ Double-booking prevention
- ✅ Membership validation

---

### **Person 3: Engagement Lead** 🤝

**Skills Required**: Animations (Framer Motion), Twilio API, Backend Services

**Dependencies**: Wait for Person 2 to complete activities (Hour 14)

#### Backend Tasks (5 hours)

**Phase 1: Volunteer Matching (2 hours)**
- [ ] Create `backend/app/api/matches.py`
  ```python
  @router.get("/matches/available")
  async def get_available_activities(current_user = Depends(get_current_user)):
      # Get activities needing volunteers
      # Filter out activities user already matched
      pass
  
  @router.post("/matches")
  async def create_match(
      activity_id: str,
      current_user = Depends(get_current_user)
  ):
      # Reuse registration_service validation
      match = await registration_service.register_for_activity(
          current_user.id, activity_id, match_type='match'
      )
      return match
  ```

**Phase 2: Twilio Integration (2 hours)**
- [ ] Install Twilio
  ```bash
  pip install twilio
  ```
- [ ] Create `backend/app/integrations/twilio_client.py`
  ```python
  from twilio.rest import Client
  
  class TwilioClient:
      def __init__(self):
          self.client = Client(settings.TWILIO_SID, settings.TWILIO_TOKEN)
      
      def send_sms(self, to: str, message: str):
          return self.client.messages.create(
              body=message,
              from_=settings.TWILIO_PHONE,
              to=to
          )
      
      def send_whatsapp(self, to: str, message: str):
          return self.client.messages.create(
              body=message,
              from_=f'whatsapp:{settings.TWILIO_WHATSAPP}',
              to=f'whatsapp:{to}'
          )
  ```

**Phase 3: Notification Service (1 hour)**
- [ ] Create `backend/app/services/notification_service.py`
  ```python
  class NotificationService:
      async def send_registration_confirmation(self, user_id: str, activity_id: str):
          user = await get_user(user_id)
          activity = await get_activity(activity_id)
          
          message = f"Confirmed: {activity.title} on {activity.date} at {activity.start_time}"
          
          # Send SMS to participant
          twilio.send_sms(user.phone, message)
          
          # Send WhatsApp to caregiver (if participant)
          if user.role == 'participant' and user.caregiver_phone:
              twilio.send_whatsapp(user.caregiver_phone, message)
      
      async def send_volunteer_match_confirmation(self, volunteer_id: str, activity_id: str):
          volunteer = await get_user(volunteer_id)
          activity = await get_activity(activity_id)
          
          message = f"You're matched! {activity.title} on {activity.date}"
          twilio.send_sms(volunteer.phone, message)
  ```
- [ ] Add triggers in `backend/app/api/registrations.py` and `matches.py`

#### Frontend Tasks (5 hours)

**Phase 1: Volunteer Swiper (3 hours)**
- [ ] Install Framer Motion
  ```bash
  npm install framer-motion
  ```
- [ ] Create `frontend/src/components/volunteer/ActivitySwiper.jsx`
  ```jsx
  import { motion, useAnimation } from 'framer-motion'
  
  export default function ActivitySwiper() {
    const [activities, setActivities] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const controls = useAnimation()
    
    const handleSwipe = async (direction) => {
      if (direction === 'right') {
        // Match with activity
        await matchesApi.create({ activity_id: activities[currentIndex].id })
        // Show match animation
      }
      
      // Move to next card
      setCurrentIndex(prev => prev + 1)
    }
    
    return (
      <div className="relative h-[600px]">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) handleSwipe('right')
              else if (offset.x < -100) handleSwipe('left')
            }}
            animate={controls}
            style={{ position: 'absolute', zIndex: activities.length - index }}
          >
            <ActivitySwipeCard activity={activity} />
          </motion.div>
        ))}
      </div>
    )
  }
  ```
- [ ] Create `frontend/src/components/activities/ActivitySwipeCard.jsx`
- [ ] Create `frontend/src/components/volunteer/MatchAnimation.jsx`

**Phase 2: Volunteer Dashboard (2 hours)**
- [ ] Create `frontend/src/components/dashboard/VolunteerDashboard.jsx`
  ```jsx
  export default function VolunteerDashboard() {
    return (
      <Layout>
        <Tabs>
          <Tab label="Browse">
            <ActivitySwiper />
          </Tab>
          <Tab label="Calendar">
            <ActivityCalendar mode="view" />
          </Tab>
          <Tab label="My Matches">
            <RegistrationsList type="matches" />
          </Tab>
        </Tabs>
      </Layout>
    )
  }
  ```
- [ ] Create notification context and toast component

**Deliverables:**
- ✅ Tinder-style swiper working
- ✅ Volunteer matching functional
- ✅ SMS/WhatsApp notifications sent
- ✅ Toast notifications in UI

---

### **Person 4: Experience Lead** 📊

**Skills Required**: Data Visualization, External APIs, CSS

**Dependencies**: Can start accessibility early, staff features after Hour 18

#### Backend Tasks (5 hours)

**Phase 1: Staff Analytics (2 hours)**
- [ ] Create `backend/app/services/analytics_service.py`
  ```python
  class AnalyticsService:
      async def get_dashboard_metrics(self):
          total_activities = await count_activities()
          total_registrations = await count_registrations()
          volunteer_coverage = await calculate_coverage()
          
          return {
              'total_activities': total_activities,
              'total_registrations': total_registrations,
              'volunteer_coverage': volunteer_coverage
          }
      
      async def get_activity_attendance(self, activity_id: str):
          registrations = await get_registrations_by_activity(activity_id)
          return [
              {'name': r.user.name, 'email': r.user.email}
              for r in registrations
          ]
  ```
- [ ] Create `backend/app/api/staff.py`

**Phase 2: Accessibility APIs (2 hours)**
- [ ] Install APIs
  ```bash
  pip install elevenlabs google-cloud-translate
  ```
- [ ] Create `backend/app/integrations/elevenlabs_client.py`
  ```python
  from elevenlabs import generate, set_api_key
  
  class ElevenLabsClient:
      def __init__(self):
          set_api_key(settings.ELEVENLABS_KEY)
      
      def generate_speech(self, text: str, language: str = 'en'):
          audio = generate(text=text, voice="Rachel")
          # Save to S3 or return base64
          return audio_url
  ```
- [ ] Create `backend/app/integrations/google_translate.py`
- [ ] Create `backend/app/api/accessibility.py`

**Phase 3: CSV Export (1 hour)**
- [ ] Create utility for CSV export in `backend/app/utils/formatters.py`

#### Frontend Tasks (5 hours)

**Phase 1: Accessibility (3 hours)**
- [ ] Create `frontend/src/contexts/AccessibilityContext.jsx`
- [ ] Create `frontend/src/components/accessibility/AccessibilityMenu.jsx`
- [ ] Create `frontend/src/components/accessibility/TTSButton.jsx`
- [ ] Create `frontend/src/components/accessibility/LanguageSelector.jsx`
- [ ] Create `frontend/src/components/accessibility/FontSizeControl.jsx`
- [ ] Create `frontend/src/styles/accessibility.css`
  ```css
  .font-small { font-size: 14px; }
  .font-medium { font-size: 16px; }
  .font-large { font-size: 20px; }
  
  .contrast-high {
      --bg: #000;
      --text: #fff;
      --primary: #ffff00;
  }
  ```

**Phase 2: Staff Dashboard (2 hours)**
- [ ] Install Recharts
  ```bash
  npm install recharts
  ```
- [ ] Create `frontend/src/components/staff/StaffDashboard.jsx`
- [ ] Create `frontend/src/components/staff/AnalyticsCharts.jsx`
- [ ] Create `frontend/src/components/staff/AttendanceExporter.jsx`
- [ ] Create `frontend/src/components/staff/ActivityManager.jsx`

**Deliverables:**
- ✅ TTS working for all languages
- ✅ Font size + contrast controls
- ✅ Staff dashboard with charts
- ✅ CSV attendance export

---

## Integration Timeline

```
Hour 0-8:   Person 1 (Foundation)
            ├── Backend: FastAPI + Auth
            └── Frontend: React + Auth

Hour 8-18:  Person 2 (Activities) + Person 3 (Volunteers)
            ├── Person 2: Calendar + Registration
            └── Person 3: Swiper + Notifications

Hour 18-28: Person 4 (Staff + Accessibility)
            ├── Accessibility features
            └── Staff dashboard

Hour 28-32: All (Integration + Testing)
            ├── End-to-end testing
            ├── Bug fixes
            └── Demo prep

Hour 32-36: Deployment + Demo
            ├── Deploy to production
            └── Final rehearsal
```

---

## Communication Schedule

### Daily Sync (15 min at Hour 0, 8, 18, 28)
- Each person shares: completed tasks, current task, blockers
- Quick decisions on integration points

### Async Updates (Slack/Discord)
- Post in team channel when completing major milestone
- Tag next person if they're blocked by your work
- Share screenshots of completed features

---

## GitHub Project Board

Create columns:
- **Backlog** - All tasks from TASKS.md
- **In Progress** - Currently working (max 1 per person)
- **In Review** - PR created, awaiting review
- **Done** - Merged to dev

Each task becomes an issue assigned to person.

---

This structure ensures **zero idle time** and **clear handoffs** between team members!
