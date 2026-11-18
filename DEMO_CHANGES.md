# demo-ready Branch — Changes from main

**Branch:** `demo-ready` (2 commits ahead of `main`)  
**Purpose:** Make the app fully functional with mock data for demo on Jan 31, 2026. No backend or API keys needed.

---

## Commit 1: `9b46e6d` — Enable mock data mode + fix dates

### Files Changed (7)

#### 1. `frontend/src/contexts/AuthContext.jsx`
- **Change:** `USE_MOCK_DATA = false` → `true`
- **Why:** Enables mock user authentication without Supabase

#### 2. `frontend/src/services/activities.api.js`
- **Change:** `USE_MOCK_DATA = false` → `true`
- **Why:** Uses mock activities instead of backend API
- **Added:** Mock implementations for `getById`, `create`, `update`, `delete`, `getUpcoming`, `getByDate`
- **Added:** Search filtering in `getAll` mock (title + description)

#### 3. `frontend/src/services/registrations.api.js`
- **Change:** `USE_MOCK_DATA = false` → `true`
- **Why:** Uses mock registrations instead of backend API
- **Added:** `getAvailable` mock — returns future activities user hasn't registered for (needed for participant swiper)

#### 4. `frontend/src/services/matches.api.js`
- **Change:** Added `USE_MOCK_DATA = true` (had NO mock support at all)
- **Added:** Full mock implementations for `getAvailable`, `create`, `getAll`, `getByUser`, `cancel`
- **Why:** Volunteer swiper was completely broken without backend — now works with mock volunteer match data

#### 5. `frontend/src/mocks/activities.mock.js`
- **Change:** Updated all 13 activity dates from Jan 15–29 → Jan 31 – Feb 6, 2026
- **Why:** Activities need to look current/upcoming for demo

#### 6. `frontend/src/mocks/registrations.mock.js`
- **Change:** Fixed `ACTIVITY_UUIDS[0]` → `ACTIVITY_UUIDS[1]` (UUIDs are 1-indexed, index 0 is undefined)
- **Change:** Updated registration timestamps from Jan 18-19 → Jan 28-29
- **Why:** Bug fix — registrations were pointing to undefined activity IDs

#### 7. `frontend/src/components/staff/ActivityManager.jsx`
- **Change:** `response.data.activities || []` → `response.data.activities || response.data || []`
- **Why:** Mock API returns `{ data: [...] }` not `{ data: { activities: [...] } }` — this fallback handles both formats

---

## Commit 2: `c0b764d` — Add Web Speech API for browser-native TTS

### Files Changed (1)

#### 1. `frontend/src/contexts/AccessibilityContext.jsx`
- **Change:** Added Web Speech API (`window.speechSynthesis`) as primary TTS engine
- **Fallback:** Still falls back to backend ElevenLabs API if speechSynthesis unavailable
- **Languages:** Maps `en` → `en-US`, `zh` → `zh-CN`, `ms` → `ms-MY`, `ta` → `ta-IN`
- **Settings:** Rate 0.9 (slightly slower for accessibility), pitch 1.0
- **Why:** Removes need for ElevenLabs API key and backend for TTS demo

---

## Summary

| Feature | main branch | demo-ready branch |
|---------|------------|-------------------|
| Auth | Requires Supabase | Mock users (participant/volunteer/staff) |
| Activities | Requires backend API | Mock data, 13 activities with future dates |
| Registrations | Requires backend API | Full mock CRUD |
| Volunteer Matching | Requires backend API | Full mock CRUD |
| Staff Activity Manager | Broken with mocks | Fixed response format handling |
| TTS | Requires ElevenLabs API | Browser-native Web Speech API |
| Translation | Requires Google Translate API | Already works client-side (mock data has all 4 languages) |

### To switch user roles during demo:
Edit `src/mocks/userSwitcher.mock.js`:
```js
export const ACTIVE_USER_TYPE = 'participant' // or 'volunteer' or 'staff'
```
Save → HMR auto-reloads.

### To revert to production mode:
Merge `main` or just set all `USE_MOCK_DATA` flags back to `false`.
