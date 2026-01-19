# Supabase Authentication Setup Guide

## ✅ Database Setup - COMPLETED
The database tables have been successfully created in your Supabase PostgreSQL instance:
- `users` table
- `activities` table
- `registrations` table
- `volunteer_matches` table

## 🔐 Supabase Auth Configuration (IMPORTANT)

To enable authentication, you need to configure Supabase Auth settings:

### 1. Disable Email Confirmation (For Development)

1. Go to your Supabase dashboard: https://app.supabase.com/project/zgmlkisxxzfqnognixss
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth** section
4. **Disable** "Confirm email" option (for easier testing)
5. Click **Save**

### 2. Configure Email Templates (Optional)

If you want to keep email confirmation enabled:

1. Go to **Authentication** → **Email Templates**
2. Customize the templates if needed:
   - Confirmation email
   - Magic link email
   - Password reset email

### 3. Set Site URL (Important for Redirects)

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:5173`
3. Add to **Redirect URLs**:
   - `http://localhost:5173/**`
   - `http://localhost:5173/dashboard`
4. Click **Save**

## 🚀 Testing Authentication

### Create Test Accounts

You can now test authentication by:

1. **Visit**: http://localhost:5173
2. Click **"Get Started"**
3. Switch to **"Sign Up"** tab
4. Create accounts with different roles:
   - **Participant**: Select "Participant" role, choose membership type
   - **Volunteer**: Select "Volunteer" role
   - **Staff**: Select "Staff" role

### Test Flow

1. **Sign Up** → Should create account and redirect to dashboard
2. **Log Out** → Should redirect to landing page
3. **Sign In** → Should authenticate and redirect to dashboard
4. **Protected Routes** → Try accessing `/dashboard` without login (should redirect to `/auth`)

## 📝 User Roles & Dashboards

Each role sees a different dashboard:

- **Participant** (`/dashboard`): View and register for activities
- **Volunteer** (`/dashboard`): Swipe on activities to volunteer
- **Staff** (`/dashboard`): View analytics, manage activities

## 🔧 Current Configuration

- **Frontend**: Now uses real Supabase Auth (mock data disabled)
- **Backend**: FastAPI server running at http://127.0.0.1:8000
- **Database**: Supabase PostgreSQL with all tables created
- **Auth Provider**: Supabase Auth

## 🐛 Troubleshooting

### "Email not confirmed" error
- Go to Authentication → Settings and disable "Confirm email"

### "Invalid credentials" on signup
- Check that email doesn't already exist
- Password must be at least 6 characters

### Can't access dashboard
- Make sure you're logged in
- Check browser console for errors

### Token expired
- Log out and log back in

## 📱 Test Accounts (After Creation)

After creating test accounts, you can use:

```
Participant:
- Email: participant@test.com
- Password: test123

Volunteer:
- Email: volunteer@test.com
- Password: test123

Staff:
- Email: staff@test.com
- Password: test123
```

## 🔗 Useful Links

- Supabase Project: https://app.supabase.com/project/zgmlkisxxzfqnognixss
- API Docs: http://127.0.0.1:8000/docs
- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000

## ✅ What's Working Now

1. ✅ Database tables created
2. ✅ Frontend authentication pages built
3. ✅ Protected routes configured
4. ✅ Supabase Auth integration complete
5. ✅ Role-based access control ready
6. ⚠️ Email confirmation needs configuration (see step 1 above)

---

**Note**: For production, you'll want to:
- Enable email confirmation
- Add proper password reset flow
- Configure production URLs
- Add rate limiting
- Enable RLS (Row Level Security) on Supabase tables
