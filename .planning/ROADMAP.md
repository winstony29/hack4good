# Hack4Good Roadmap

## Phase 1: Volunteer Swiper (Person 3)

**Status:** Complete (5/5 plans complete)

### Plans

- [x] **01-01: Dependencies & Environment Setup** - Install animation libs, create env toggle
- [x] **01-02: Mock Data Integration** - Update API with mock toggle, add mock functions
- [x] **01-03: SwipeableCard Component** - Framer Motion drag gestures and animations
- [x] **01-04: SwipeButtons & ActivitySwiper** - Accessible buttons, orchestrator refactor
- [x] **01-05: MatchAnimation & Integration** - Celebration overlay, complete flow

### Goal
Build a Tinder-style activity swiper for volunteers with drag gestures, match celebration, and seamless mock/real API switching.

### Success Criteria
- [x] Cards can be swiped left/right with drag gestures
- [x] Cards can be passed/matched with accessible buttons
- [x] Match triggers celebration animation with confetti
- [x] Mock data works when VITE_USE_MOCK_DATA=true
- [x] Swiper accessible at /swiper route

---

## Phase 2: Experience Lead - Accessibility & Staff Dashboard (Person 4)

**Status:** Complete (4/4 plans complete)

### Plans

- [x] **02-01: Accessibility CSS & Visual Settings** - Font sizes, contrast modes, CSS classes
- [x] **02-02: Backend TTS Integration** - Wire ElevenLabs client, implement /tts endpoint
- [x] **02-03: Backend Translation Integration** - Wire Google Translate client, implement /translate endpoint
- [x] **02-04: Staff Analytics Charts** - Implement Recharts visualizations with mock data

### Goal
Build accessibility features (TTS, translation, font sizing, contrast) and staff dashboard with analytics charts. Uses mock data - no dependency on Person 2/3 backends.

### Dependencies
- **None for plans 02-01 to 02-04** - All use mock data or existing stubs
- **Future (after Person 2/3)**: Real activity attendance data for CSV export, volunteer coverage metrics

### Success Criteria
- [x] Font size toggle works (small/medium/large)
- [x] High contrast mode works
- [x] TTS endpoint returns audio (mock or real)
- [x] Translation endpoint returns translated text (mock or real)
- [x] Staff dashboard shows charts with mock data
- [x] Accessibility menu fully functional

---

## Phase 3: Integration - Accessibility + Swiper (Person 4)

**Status:** Complete (1/1 plans)

### Plans

- [x] **03-01: Wire Accessibility into Volunteer Swiper** - Reduce motion support, TTS on activity cards

### Goal
Integrate Person 4's accessibility features with Person 3's volunteer swiper. Ensure animations respect reduce motion preference and add TTS support for activity cards.

### Dependencies
- **Phase 1 complete** - Volunteer swiper exists
- **Phase 2 complete** - Accessibility context and components exist

### Success Criteria
- [x] Swiper animations disabled when reduceMotion=true
- [x] Confetti disabled when reduceMotion=true
- [x] Activity cards in swiper have TTS button option
- [x] All existing tests pass

---

## Phase 4: Person 3 Backend Completion (Person 3)

**Status:** In progress (1/3 plans complete)

### Plans

- [x] **04-01: Matches API Implementation** - Complete 4 stub endpoints with full CRUD
- [ ] **04-02: Notification Service Wiring** - Mock Twilio mode, wire into matches API
- [ ] **04-03: Toast Notification Enhancements** - Add toast feedback to swiper actions

### Goal
Complete Person 3's backend work: implement the matches API endpoints, wire the notification service with mock mode, and enhance frontend toast notifications for better user feedback.

### Dependencies
- **Phase 1 complete** - Swiper frontend exists
- **Backend stubs exist** - api/matches.py and notification_service.py have structure

### Success Criteria
- [ ] All 4 matches API endpoints return real data (no 501s)
- [ ] Notification service logs to console in mock mode
- [ ] Notification service sends via Twilio in live mode
- [ ] Toast notifications appear for swipe actions
- [ ] Error states communicated via toast

---

## Phase 5: Person 4 Staff API Completion (Person 4)

**Status:** Planned (0/2 plans complete)

### Plans

- [ ] **05-01: Staff API Wiring** - Wire staff.py endpoints to use AnalyticsService
- [ ] **05-02: Weekly Report Implementation** - Add date-range methods, implement weekly report

### Goal
Wire the Staff API endpoints to use the already-implemented AnalyticsService, replacing stub responses with real database queries. This work is independent of Person 2/3 and can run in parallel with Phase 4.

### Dependencies
- **None** - AnalyticsService is already implemented
- **Phase 2 complete** - Staff frontend components exist

### Success Criteria
- [ ] /staff/analytics returns real metrics from database
- [ ] /staff/attendance/{id} returns real participant/volunteer lists
- [ ] /staff/attendance/{id}/export generates real CSV data
- [ ] /staff/reports/weekly returns aggregated statistics for date range
- [ ] 404 handling for invalid activity IDs
