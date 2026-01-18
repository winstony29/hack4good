# Mock Data Setup for Testing

This directory contains mock data for testing the Activities flow without a backend.

When backend is ready, simply change these flags to false:
- activities.api.js → USE_MOCK_DATA = false
- registrations.api.js → USE_MOCK_DATA = false
- AuthContext.jsx → USE_MOCK_DATA = false


## 🎯 Quick Start

1. **Mock data is already enabled!** Just run the app:
   ```bash
   npm run dev
   ```

2. **Navigate to test:**
   - `/activities` - Browse activities
   - `/dashboard` - View participant dashboard

3. **Mock user is automatically logged in:**
   - Name: Alex Chen
   - Membership: Once Weekly
   - Already registered for: Morning Yoga (Jan 22)

## 📁 Mock Data Files

### `activities.mock.js`
- 13 activities (12 upcoming, 1 past)
- Various program types: sports, arts, music, wellness, social, educational
- Different dates from Jan 22-29, 2026
- One full activity (Swimming Lessons)
- Activities with overlapping times for conflict testing

### `registrations.mock.js`
- User pre-registered for 2 activities:
  - Morning Yoga (upcoming)
  - Board Games Day (past)
- In-memory store that updates when you register/cancel
- Automatically updates activity participant counts

### `users.mock.js`
- Default user: Participant with "once_weekly" membership
- Additional test users with different membership types
- Staff and volunteer users (for future testing)

## 🧪 Test Scenarios

### Scenario 1: Valid Registration
1. Go to `/activities`
2. Click "Arts & Crafts Workshop" (Jan 22, 2-4pm)
3. See green checkmark ✅
4. Click "Confirm Registration"
5. Go to `/dashboard` - see it in your list

### Scenario 2: Time Conflict
1. User is already registered for "Morning Yoga" (Jan 22, 9-10:30am)
2. Try to register for another activity on Jan 22 at 10-12pm
3. See red error ❌ - Time conflict detected

### Scenario 3: Activity Full
1. Try to register for "Swimming Lessons" (10/10 capacity)
2. See red error ❌ - Activity is full

### Scenario 4: Membership Limit Warning
1. User has "once_weekly" membership (1 activity/week limit)
2. Already registered for Morning Yoga (Jan 22)
3. Try to register for another activity same week
4. See yellow warning ⚠️ - Weekly limit reached
5. Can still register (warning, not error)

### Scenario 5: Cancel Registration
1. Go to `/dashboard`
2. Click "Cancel" on any upcoming activity
3. Confirm the dialog
4. Activity removed, participant count decreases

## 🔧 Configuration

### Switching Between Mock and Real Backend

**In `activities.api.js`:**
```javascript
const USE_MOCK_DATA = true  // Set to false when backend is ready
```

**In `registrations.api.js`:**
```javascript
const USE_MOCK_DATA = true  // Set to false when backend is ready
```

**In `AuthContext.jsx`:**
```javascript
const USE_MOCK_DATA = true  // Set to false when Supabase is configured
```

### Adjusting Mock Delay

To simulate network conditions, adjust the delay:

```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In mock API methods
await delay(500)  // Change to 100 for fast, 2000 for slow
```

## 🎭 Changing Mock User

To test with different membership types, edit `AuthContext.jsx`:

```javascript
import { 
  mockUser,              // Once weekly
  mockParticipantAdHoc,  // Ad-hoc (no limit)
  mockParticipantTwiceWeekly,  // Twice weekly
  mockStaffUser,         // Staff role
  mockVolunteerUser      // Volunteer role
} from '../mocks/users.mock'

// Then change:
setUser(mockParticipantAdHoc)  // Switch to ad-hoc user
```

## 📊 Mock Data Summary

| Activity | Date | Time | Capacity | Type |
|----------|------|------|----------|------|
| Morning Yoga | Jan 22 | 9-10:30am | 12/20 | Wellness |
| Arts & Crafts | Jan 22 | 2-4pm | 8/15 | Arts |
| Basketball | Jan 23 | 10am-12pm | 18/25 | Sports |
| Music Jam | Jan 23 | 3-5pm | 10/12 | Music |
| Swimming (FULL) | Jan 24 | 11am-12:30pm | 10/10 | Sports |
| Cooking Class | Jan 25 | 10am-12pm | 7/12 | Educational |
| Dance Party | Jan 25 | 3-4:30pm | 22/30 | Social |
| Gardening | Jan 26 | 9-11am | 9/15 | Educational |
| Movie Afternoon | Jan 26 | 2-4:30pm | 28/40 | Social |
| Painting | Jan 27 | 10am-12pm | 11/15 | Arts |
| Table Tennis | Jan 28 | 2-4pm | 14/16 | Sports |
| Meditation | Jan 29 | 9-10am | 13/20 | Wellness |

## 🐛 Troubleshooting

### Activities not showing?
- Check console for errors
- Verify mock data is being imported correctly
- Check that `USE_MOCK_DATA = true`

### Can't register for activities?
- Check if mock registrations store is working
- Open browser DevTools → Console
- Look for "Mock" prefixed messages

### Changes not persisting?
- Mock data is in-memory only
- Refreshing the page resets everything
- This is expected behavior for testing

### Want to reset registrations?
Refresh the page - mock data resets automatically.

## 🚀 When Ready for Backend

1. Set all `USE_MOCK_DATA` flags to `false`
2. Configure `.env` with real Supabase credentials
3. Ensure backend API is running at `VITE_API_BASE_URL`
4. Test each flow to ensure API contracts match

## 📝 Adding More Mock Data

### Add Activities
Edit `activities.mock.js`:
```javascript
{
  id: '14',
  title: 'New Activity',
  description: 'Description here',
  date: '2026-02-01',
  start_time: '10:00:00',
  end_time: '11:30:00',
  location: 'Main Hall',
  max_capacity: 20,
  current_participants: 5,
  program_type: 'sports'
}
```

### Add Registrations
Edit `registrations.mock.js` initial data:
```javascript
{
  id: 'reg-3',
  user_id: 'user-1',
  activity_id: '2',
  status: 'confirmed',
  created_at: '2026-01-18T11:00:00Z'
}
```

---

**Happy Testing! 🎉**

For questions, see:
- [ACTIVITIES_IMPLEMENTATION.md](../../../ACTIVITIES_IMPLEMENTATION.md)
- [INTEGRATION_CHECKLIST.md](../../../INTEGRATION_CHECKLIST.md)
