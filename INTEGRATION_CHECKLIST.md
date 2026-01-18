# ✅ MINDS ActivityHub - Integration Checklist

## For Activities Lead (Person 2)

Before testing with the full team, verify each item below.

---

## 🔧 Prerequisites

### Backend Setup
- [ ] Supabase project is created and accessible
- [ ] Database schema is applied (from `backend/sql/init_schema.sql`)
- [ ] Environment variables are set:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_API_BASE_URL` (if using FastAPI backend)

### Frontend Setup
- [ ] Dependencies installed: `npm install` in `frontend/`
- [ ] Dev server runs: `npm run dev`
- [ ] No build errors in console

---

## 📋 Component Checklist

### 1. ActivityCalendar Component
File: `frontend/src/components/activities/ActivityCalendar.jsx`

- [ ] Imports without errors
- [ ] Shows loading spinner initially
- [ ] Displays activities when data loads
- [ ] Date filters work (Upcoming, This Week, This Month, All)
- [ ] View toggle works (List ↔ Grid)
- [ ] Activities grouped by date
- [ ] Empty state shows when no activities
- [ ] Click handler fires `onActivityClick`

**Test Data Needed:**
- At least 3 activities with different dates

---

### 2. ActivityDetailModal Component
File: `frontend/src/components/activities/ActivityDetailModal.jsx`

- [ ] Modal opens when activity selected
- [ ] Activity details display correctly
- [ ] TTS button shows (implemented by Person 3)
- [ ] Validation runs on open (when `action="register"`)
- [ ] Green checkmark shows for valid registration
- [ ] Red error shows for conflicts/full activities
- [ ] Yellow warning shows for membership limits
- [ ] "Confirm Registration" button disabled when invalid
- [ ] Registration succeeds and modal closes
- [ ] Error messages display on failure

**Test Scenarios:**
1. Valid registration (no conflicts, spots available)
2. Time conflict (user already registered for overlapping activity)
3. Activity full (current_participants >= max_capacity)
4. Membership limit (once weekly member trying 2nd activity)

---

### 3. Activities Page
File: `frontend/src/pages/Activities.jsx`

- [ ] Page loads at `/activities`
- [ ] Search input filters activities
- [ ] Program type dropdown filters activities
- [ ] Active filters display as badges
- [ ] "Clear all" button resets filters
- [ ] Mobile filter toggle works
- [ ] Activity click opens modal
- [ ] Registration updates user's registration list

**Test:**
1. Search for "yoga" → only yoga activities show
2. Select "Sports" → only sports activities show
3. Combine search + filter → both apply
4. Clear filters → all activities return

---

### 4. ParticipantDashboard Component
File: `frontend/src/components/dashboard/ParticipantDashboard.jsx`

- [ ] Dashboard loads at `/dashboard`
- [ ] Welcome message shows user's name
- [ ] Membership badge displays
- [ ] Quick action cards navigate correctly
- [ ] Upcoming activities load and display
- [ ] Past activities section shows (if any)
- [ ] "Cancel" button works with confirmation
- [ ] "View Details" opens modal
- [ ] Empty state shows when no registrations
- [ ] Loading spinner shows during fetch

**Test Data Needed:**
- User with 2+ upcoming registrations
- User with 1+ past registration
- User with zero registrations (empty state)

---

### 5. Activity Utilities
File: `frontend/src/utils/activityUtils.js`

#### Test `checkTimeOverlap()`
```javascript
// Should return true (same day, overlapping times)
checkTimeOverlap('2026-01-20', '09:00:00', '11:00:00', '2026-01-20', '10:00:00', '12:00:00')

// Should return false (different days)
checkTimeOverlap('2026-01-20', '09:00:00', '11:00:00', '2026-01-21', '10:00:00', '12:00:00')

// Should return false (same day, non-overlapping)
checkTimeOverlap('2026-01-20', '09:00:00', '10:00:00', '2026-01-20', '11:00:00', '12:00:00')
```

- [ ] Time overlap detection works correctly
- [ ] Different dates return false
- [ ] Non-overlapping times return false

#### Test `checkMembershipLimit()`
```javascript
const registrations = [
  { date: '2026-01-20', status: 'confirmed' }, // This week
  { date: '2026-01-22', status: 'confirmed' }  // This week
]

// Should return { allowed: false, limit: 1, current: 2 }
checkMembershipLimit('once_weekly', '2026-01-24', registrations)

// Should return { allowed: true, limit: null, current: 0 }
checkMembershipLimit('ad_hoc', '2026-01-24', registrations)
```

- [ ] Ad-hoc always returns allowed: true
- [ ] Once weekly blocks after 1 activity
- [ ] Twice weekly blocks after 2 activities
- [ ] Week boundaries calculated correctly

#### Test `validateRegistration()`
```javascript
const activity = {
  id: '1',
  title: 'Test Activity',
  date: '2026-01-25',
  start_time: '09:00:00',
  end_time: '10:00:00',
  max_capacity: 20,
  current_participants: 15
}

const user = {
  membership_type: 'once_weekly'
}

const registrations = [] // No existing registrations

// Should return { valid: true, errors: [], warnings: [] }
validateRegistration(activity, user, registrations)
```

- [ ] Valid registration returns valid: true
- [ ] Full activity returns error
- [ ] Time conflict returns error
- [ ] Past activity returns error
- [ ] Membership limit returns warning (not error)

---

## 🔗 Integration Points

### With Auth Context (Person 1)
- [ ] `useAuth()` hook provides `user` object
- [ ] `user.user_metadata.role` is accessible
- [ ] `user.user_metadata.membership_type` is accessible
- [ ] `user.user_metadata.full_name` is accessible
- [ ] Auth redirects work (protected routes)

**Test:** Log in as participant → should see participant dashboard

---

### With Accessibility Context (Person 3)
- [ ] `AccessibilityContext` is imported (if needed)
- [ ] TTSButton component works
- [ ] Font size changes apply globally
- [ ] High contrast mode toggles (if implemented)

**Test:** Toggle accessibility settings → verify UI updates

---

### With API Services (Existing)
- [ ] `activitiesApi.getAll()` returns activities array
- [ ] `activitiesApi.getById(id)` returns single activity
- [ ] `registrationsApi.getAll()` returns user's registrations
- [ ] `registrationsApi.create(data)` creates registration
- [ ] `registrationsApi.cancel(id)` cancels registration
- [ ] Auth token is automatically added to requests
- [ ] 401 errors redirect to login

**Test:** Check browser Network tab → verify API calls succeed

---

## 🎨 Visual/UX Checklist

### Responsive Design
- [ ] Desktop (1920px): Grid view shows 3 columns
- [ ] Tablet (768px): Grid view shows 2 columns
- [ ] Mobile (375px): All content stacks, no horizontal scroll
- [ ] Filter button shows on mobile
- [ ] Touch targets are at least 44px

### Loading States
- [ ] Spinners show during data fetch
- [ ] Buttons show loading state during actions
- [ ] No "flash of empty content"

### Empty States
- [ ] Activities page: "No activities found"
- [ ] Dashboard: "No upcoming activities"
- [ ] Each has appropriate icon and call-to-action

### Error States
- [ ] API errors show user-friendly messages
- [ ] Validation errors show in modal
- [ ] Cancel confirmation dialog appears
- [ ] Network errors are handled gracefully

### Success States
- [ ] Registration succeeds → modal closes
- [ ] Dashboard updates after registration
- [ ] Cancellation succeeds → item removed

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot read property 'data' of undefined"
**Cause:** API response format doesn't match expected structure  
**Fix:** Check API response in Network tab, update code to match

### Issue: Activities not showing
**Cause:** Empty database or API not returning data  
**Fix:** Add test data via Supabase dashboard or SQL insert

### Issue: Validation not working
**Cause:** `userRegistrations` prop not passed to modal  
**Fix:** Ensure parent component passes registrations array

### Issue: Membership type not displaying
**Cause:** User metadata not set during registration  
**Fix:** Update signup flow to include membership_type

### Issue: Time conflict not detected
**Cause:** Date/time format mismatch  
**Fix:** Ensure dates are 'YYYY-MM-DD' and times are 'HH:MM:SS'

---

## 🧪 Full User Journey Test

### Journey 1: New Participant Registration
1. [ ] Sign up as new participant
2. [ ] Navigate to Activities page
3. [ ] Search for an activity
4. [ ] Click activity → modal opens
5. [ ] See green validation checkmark
6. [ ] Click "Confirm Registration"
7. [ ] Navigate to Dashboard
8. [ ] See newly registered activity
9. [ ] Click "Cancel" → confirm
10. [ ] Activity removed from dashboard

### Journey 2: Conflict Detection
1. [ ] Register for Activity A (Jan 20, 9am-11am)
2. [ ] Try to register for Activity B (Jan 20, 10am-12pm)
3. [ ] See red error: "Time conflict with Activity A"
4. [ ] Button is disabled
5. [ ] Cannot register

### Journey 3: Membership Limit
1. [ ] User has "once_weekly" membership
2. [ ] Register for Activity A (this week)
3. [ ] Try to register for Activity B (same week)
4. [ ] See yellow warning about weekly limit
5. [ ] Can still register (warning, not error)

---

## 📝 Before Team Demo

- [ ] All checklist items above are verified
- [ ] Test data is realistic and varied
- [ ] Screenshots taken for backup
- [ ] Demo script reviewed
- [ ] Browser console has no errors
- [ ] Mobile view tested
- [ ] Loading states tested (use network throttling)
- [ ] At least 2 test accounts ready (different membership types)

---

## 🤝 Team Coordination

### Before Integration:
- [ ] Confirm with Person 1: Auth working, user metadata structure
- [ ] Confirm with Person 3: TTSButton component available
- [ ] Confirm backend: API endpoints returning expected format

### After Integration:
- [ ] Test with Person 1's auth flow
- [ ] Test with Person 3's accessibility features
- [ ] Test with Person 4's staff dashboard (activity creation)

---

## 📞 Quick Contacts

- **Auth issues** → Person 1 (Auth Lead)
- **Accessibility features** → Person 3 (Accessibility Lead)
- **Backend API** → Backend Team Lead
- **Staff features** → Person 4 (Staff Lead)

---

**Last Updated:** 18 January 2026  
**Status:** Ready for integration testing

---

## ✨ Success Criteria

You're ready to integrate when:
1. ✅ All main features work in isolation
2. ✅ No console errors during normal flow
3. ✅ All 3 test journeys complete successfully
4. ✅ Mobile view is fully functional
5. ✅ Demo script can be completed in <3 minutes

**Good luck! 🚀**
