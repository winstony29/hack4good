# Authentication Fix - Users Now Stored in PostgreSQL

## What Was Fixed

Previously, users were only being created in Supabase Auth but NOT in the PostgreSQL database. This caused issues where:
- User records didn't exist in the `users` table
- Backend API calls requiring user data failed with 403 errors
- No way to query user information from the database

## Changes Made

### 1. Frontend: Updated AuthContext.jsx

**Changed from:** Calling Supabase Auth directly
```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: userData }
})
```

**Changed to:** Calling backend API
```javascript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, ...userData })
})
```

This ensures all authentication goes through the backend API.

### 2. Backend: Updated auth.py

**Added:**
- User record creation in PostgreSQL database
- Password hashing using bcrypt
- Check for duplicate users
- Transaction rollback on errors

**The signup endpoint now:**
1. Checks if user already exists in database
2. Creates user in Supabase Auth
3. **Also creates user record in PostgreSQL** with:
   - Same ID as Supabase Auth user (for consistency)
   - Hashed password
   - Role, membership type, and all user metadata
4. Returns access token

**Key code added:**
```python
# Create user in PostgreSQL database
db_user = User(
    id=auth_response.user.id,  # Use same ID as Supabase Auth
    email=user_data.email,
    hashed_password=pwd_context.hash(user_data.password),
    role=user_data.role,
    membership_type=user_data.membership_type,
    full_name=user_data.full_name,
    phone=user_data.phone,
    caregiver_phone=user_data.caregiver_phone,
    preferred_language=user_data.preferred_language.value
)
db.add(db_user)
db.commit()
```

## How to Test

### 1. Create a New Account

1. Go to http://localhost:5173/auth
2. Click "Sign Up" tab
3. Fill in the form:
   - Full Name: Test User
   - Role: Participant
   - Membership Type: Once weekly
   - Email: test@example.com
   - Password: test123
4. Click "Create Account"

### 2. Verify User in Database

```bash
PGPASSWORD=wakemeupicantwakeup psql \
  -h aws-1-ap-south-1.pooler.supabase.com -p 5432 \
  -U postgres.zgmlkisxxzfqnognixss -d postgres \
  -c "SELECT id, email, role, full_name FROM users;"
```

You should now see your user record!

### 3. Verify in Supabase Dashboard

1. Go to https://app.supabase.com/project/zgmlkisxxzfqnognixss
2. Navigate to **Authentication** → **Users**
3. You'll see the user in Supabase Auth
4. Navigate to **Table Editor** → **users**
5. You'll also see the user in the PostgreSQL table

## What This Fixes

- Backend API calls now work because users exist in the database
- You can query user information from PostgreSQL
- Foreign key relationships work (registrations, volunteer_matches)
- Analytics and reporting can access user data
- Consistent user ID between Supabase Auth and PostgreSQL

## Architecture

```
Frontend (React)
    ↓
Backend API (/api/auth/signup)
    ↓
    ├── Supabase Auth (Authentication)
    └── PostgreSQL (User Data Storage)
```

**Dual storage approach:**
- **Supabase Auth**: Handles authentication, sessions, JWT tokens
- **PostgreSQL**: Stores user records for queries, relationships, analytics

Both systems use the same user ID for consistency!

## Next Steps

Since you already created accounts before this fix, those users exist in Supabase Auth but not in PostgreSQL. You have two options:

### Option A: Delete old users and create new ones
1. Go to Supabase dashboard → Authentication → Users
2. Delete existing test users
3. Create new accounts via the signup form
4. They'll be properly created in both systems

### Option B: Manually insert existing users into PostgreSQL
For each existing user in Supabase Auth, run:
```sql
INSERT INTO users (id, email, hashed_password, role, full_name, preferred_language)
VALUES (
  'user-id-from-supabase',
  'email@example.com',
  'hashed-password',
  'participant',
  'Full Name',
  'en'
);
```

**Recommendation:** Use Option A (delete and recreate) - it's cleaner!

## Files Modified

1. **frontend/src/contexts/AuthContext.jsx**
   - Lines 48-83: Updated `signup()` function
   - Lines 85-120: Updated `login()` function

2. **backend/app/api/auth.py**
   - Lines 1-13: Added imports (User model, CryptContext)
   - Lines 16-94: Updated `signup()` endpoint to create PostgreSQL records
