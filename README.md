# MINDS ActivityHub 🎯

An accessible, inclusive activity management platform designed for individuals with intellectual disabilities. Built for MINDS (Movement for the Intellectually Disabled of Singapore).

## Problem Statement
Built for Hack4Good 2026 (organised by NUS Student Developer Group), tackling the MINDS 1 Problem Statement: "How might we reduce friction in activity sign-ups for both individuals and caregivers, while reducing manual effort for staff in managing and consolidating registration data?"

## 🌟 Features

### For Participants
- **Easy Activity Browsing**: Interactive calendar view of all available activities
- **Simple Registration**: One-click registration with membership validation
- **Accessibility First**: Text-to-speech, multi-language support, high contrast modes
- **Mobile-Friendly**: Responsive design works on all devices

### For Volunteers
- **Tinder-Style Matching**: Swipe right to volunteer for activities you're interested in
- **Activity Calendar**: View all activities you're volunteering for
- **Instant Notifications**: Get SMS/WhatsApp confirmations for your matches

### For Staff
- **Comprehensive Analytics**: Track participation, volunteer coverage, and trends
- **Activity Management**: Create, edit, and manage activities
- **Weekly Schedule**: View all activities and attendees by day
- **Real-Time Reporting**: Monitor registrations and volunteer matches

### Accessibility Features
- ♿ **Text-to-Speech (TTS)**: Read aloud any activity description
- 🌍 **Multi-Language**: English, Mandarin (中文), Malay, Tamil (தமிழ்)
- 🎨 **High Contrast Mode**: For visually impaired users
- 📱 **Large Touch Targets**: Minimum 44x44px for easy interaction
- ⌨️ **Keyboard Navigation**: Full keyboard support
- 🎭 **Reduced Motion**: Respects user preferences
- 📏 **Adjustable Font Sizes**: Small, Medium, Large

## 🏗️ Architecture

### Tech Stack

**Backend**
- FastAPI 0.104.1
- Supabase (PostgreSQL + Auth)
- SQLAlchemy 2.0 (ORM)
- Python 3.11+

**Frontend**
- React 18.2
- Vite 5.0 (Build tool)
- Tailwind CSS 3.4 (Styling)
- React Router 6.20 (Routing)

**External APIs**
- Twilio (SMS + WhatsApp notifications)
- ElevenLabs (Text-to-Speech)
- Google Translate (Multi-language support)

### Project Structure

```
minds-activity-hub/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Auth, config, enums
│   │   ├── db/                # Database models
│   │   ├── models/            # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── integrations/      # External APIs
│   │   └── utils/             # Helpers
│   ├── sql/                   # Database schema
│   └── requirements.txt       # Python dependencies
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/        # React components
    │   │   ├── shared/       # Reusable components
    │   │   ├── layout/       # Layout components
    │   │   ├── auth/         # Authentication
    │   │   ├── dashboard/    # Dashboards
    │   │   ├── activities/   # Activity features
    │   │   ├── volunteer/    # Volunteer features
    │   │   ├── staff/        # Staff features
    │   │   └── accessibility/# Accessibility features
    │   ├── contexts/          # React contexts
    │   ├── pages/             # Page components
    │   ├── services/          # API clients
    │   ├── utils/             # Helpers
    │   └── styles/            # CSS files
    └── package.json           # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (or Supabase account)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/winstony29/hack4good.git
cd hack4good
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run database migrations (if using Alembic)
# alembic upgrade head

# Start development server
python -m uvicorn app.main:app --reload
```

Backend will be running at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URLs

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

### 4. Database Setup

Run the SQL schema:

```bash
# Using psql
psql -U your_user -d your_database -f backend/sql/init_schema.sql

# Or use your Supabase SQL editor
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/minds_activityhub
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Twilio (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# ElevenLabs (optional)
ELEVENLABS_API_KEY=your-elevenlabs-key

# Google Cloud (optional)
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
GOOGLE_PROJECT_ID=your-project-id

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📱 Usage

### User Roles

1. **Participant**: Can browse and register for activities
2. **Volunteer**: Can swipe and match with activities to volunteer
3. **Staff**: Can manage activities, view analytics, and view weekly schedules

### Creating Test Users

```bash
# Use the signup endpoint or Supabase Auth UI
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "participant@test.com",
    "password": "password123",
    "role": "participant",
    "membership_type": "once_weekly",
    "full_name": "Test Participant"
  }'
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend (Railway/Render/Fly.io)

1. Set environment variables
2. Run `pip install -r requirements.txt`
3. Start with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variables in platform settings

## 👥 Team Workflow

### Person 1: Foundation Lead
- ✅ Backend FastAPI structure
- ✅ Authentication system
- ✅ Frontend React setup
- ✅ Shared components

### Person 2: Activities Lead
- ✅ Activity calendar implementation
- ✅ Registration service logic
- ✅ Participant dashboard

### Person 3: Engagement Lead
- ✅ Volunteer swiper
- ✅ Twilio notifications
- ✅ Match animation

### Person 4: Experience Lead
- ✅ Staff analytics
- ✅ Accessibility features (TTS, translation)
- ✅ Weekly schedule view

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/YOUR_FEATURE`
2. Make your changes
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/YOUR_FEATURE`
5. Create a Pull Request to `dev` branch

## 📄 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: winstony29@github.com

## 📜 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- **MINDS Singapore** for the problem statement
- **Hack4Good** hackathon organisers
- Open source community for amazing tools and libraries

---

Built with ❤️ for accessibility and inclusion
