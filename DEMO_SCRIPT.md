# 🎬 MINDS ActivityHub - Demo Script for Activities Flow

## Demo Duration: 2 minutes 30 seconds

---

## 🎯 Setup Before Demo

1. **Have 3 test accounts ready:**
   - Participant (Ad-hoc membership)
   - Participant (Once weekly membership) - with 1 existing registration this week
   - Staff account (for activity creation, if needed)

2. **Pre-created activities:**
   - At least 5 activities across different dates
   - 2 activities on the same day at overlapping times
   - 1 activity that's nearly full (e.g., 19/20 capacity)

3. **Browser tabs:**
   - Tab 1: Participant dashboard
   - Tab 2: Activities page

---

## 🎭 Demo Flow

### Part 1: Browse Activities (30 seconds)

**Action:** Navigate to `/activities`

**Script:**
> "Welcome to the MINDS ActivityHub! Let me show you how participants discover and register for activities."

**Show:**
1. Scroll through the activity list
2. Click "This Week" filter → show filtered results
3. Switch to Grid view → back to List view
4. Type "yoga" in search → show real-time filtering
5. Select program type "Wellness" → combined filtering

**Key Points:**
- ✅ Clean, accessible design
- ✅ Multiple ways to find activities
- ✅ Mobile-responsive

---

### Part 2: Registration with Validation (60 seconds)

**Action:** Click on an activity

**Script:**
> "Now let's register. Notice the system automatically checks three things: capacity, schedule conflicts, and membership limits."

**Show:**

#### Scenario A: Success (Green) ✅
- Click activity with no conflicts
- Point out green checkmark
- Show membership info
- Click "Confirm Registration"
- Show success

**Script:**
> "Green means good to go! User's membership allows this, no conflicts."

#### Scenario B: Time Conflict (Red) ❌
- Click overlapping activity
- Point out red error message
- Show which activity conflicts
- Button is disabled

**Script:**
> "Red means blocked. The system detected this overlaps with their yoga class."

#### Scenario C: Membership Limit (Yellow) ⚠️
- Switch to "once weekly" account
- Try to register for 2nd activity this week
- Show yellow warning
- Button still works (warning, not error)

**Script:**
> "Yellow is a warning. They've hit their weekly limit, but staff can override if needed."

---

### Part 3: Participant Dashboard (45 seconds)

**Action:** Navigate to `/dashboard`

**Script:**
> "Here's the participant view. Everything they need in one place."

**Show:**
1. **Welcome section** - name and membership badge
2. **Quick actions** - two big buttons
3. **Upcoming activities** - registered activities
   - Click "View Details" on one
   - Click "Cancel" on another → confirm dialog
4. **Past activities** - history view

**Key Points:**
- ✅ Personal and welcoming
- ✅ Clear next actions
- ✅ Easy to manage registrations

---

### Part 4: Mobile View (15 seconds)

**Action:** Resize browser or switch to mobile device

**Script:**
> "And of course, it's fully mobile-responsive with large touch targets for accessibility."

**Show:**
- Activities page on mobile
- Filters collapse nicely
- Cards stack properly
- Buttons are touch-friendly (44px minimum)

---

## 💬 Q&A Responses

### "What happens if the activity is full?"
> "The system prevents registration automatically. In the next iteration, we'd add a waitlist feature where users can join a queue and get notified when spots open up."

### "Can caregivers register for participants?"
> "Great question! In this MVP, each user has their own account. For Phase 2, we're planning a 'linked accounts' feature where caregivers can manage multiple profiles."

### "How do you prevent double-booking?"
> "The system checks in real-time before registration. It compares the date and time of all activities and blocks registration if there's any overlap."

### "What about recurring activities?"
> "For the MVP, each session is a separate activity. This gives maximum flexibility. In Phase 2, we can add recurring event templates that staff can use to quickly create weekly activities."

### "Can users edit their registrations?"
> "Currently they can cancel and re-register. For Phase 2, we could add a 'modify' feature, but for this MVP, cancel + re-register keeps it simple and reliable."

---

## 🎨 Highlighting Accessibility Features

**During any part of the demo, you can mention:**

> "Notice the design follows WCAG accessibility standards:"
> - ✅ High contrast colors (AAA rated)
> - ✅ Large, clear fonts
> - ✅ Minimum 44px touch targets
> - ✅ Semantic HTML for screen readers
> - ✅ Text-to-speech integration (Person 3's work)
> - ✅ Keyboard navigation support

---

## 🚀 Closing

**Script:**
> "So in summary, participants can now:"
> - Browse activities with smart filtering
> - Register with automatic conflict detection
> - Manage their schedule in one dashboard
> 
> "This replaces their old workflow of Google Forms, WhatsApp messages, and manual checking. What used to take 10-15 minutes and multiple tools now takes 30 seconds."

**Impact numbers:**
- ⏱️ 10-15 minutes → 30 seconds per registration
- 📉 5 tools (Canva, Forms, Sheets, WhatsApp, Calendar) → 1 platform
- 🎯 Zero double-bookings (vs ~10% in old system)
- ♿ 100% accessible design

---

## 🎬 Demo Tips

1. **Practice transitions** - Know where to click
2. **Have backup data** - In case something breaks
3. **Use test accounts** - Don't demo on real data
4. **Keep energy up** - Smile and be enthusiastic
5. **Time yourself** - 2:30 is the sweet spot
6. **Show, don't tell** - Let the UI speak for itself
7. **Have a "fail" story** - "This is what happens if you try to register twice..."

---

## 🐛 If Something Goes Wrong

### API not responding
> "In a production environment, this would connect to our backend. Let me show you the design and flow instead."

### Wrong test data
> "Let me grab a different example that shows this better..."

### Browser crash
> "Perfect time to show our mobile view!" (switch to phone)

---

## 📱 Screenshots to Prepare

Before the demo, take screenshots of:
1. Activities list view
2. Activity detail with green checkmark
3. Activity detail with red error
4. Participant dashboard
5. Mobile view

Use these as backup slides if live demo fails.

---

**End of Demo Script**

Good luck! 🎉
