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

**Status:** Not started (0/4 plans complete)

### Plans

- [ ] **02-01: Accessibility CSS & Visual Settings** - Font sizes, contrast modes, CSS classes
- [ ] **02-02: Backend TTS Integration** - Wire ElevenLabs client, implement /tts endpoint
- [ ] **02-03: Backend Translation Integration** - Wire Google Translate client, implement /translate endpoint
- [ ] **02-04: Staff Analytics Charts** - Implement Recharts visualizations with mock data

### Goal
Build accessibility features (TTS, translation, font sizing, contrast) and staff dashboard with analytics charts. Uses mock data - no dependency on Person 2/3 backends.

### Dependencies
- **None for plans 02-01 to 02-04** - All use mock data or existing stubs
- **Future (after Person 2/3)**: Real activity attendance data for CSV export, volunteer coverage metrics

### Success Criteria
- [ ] Font size toggle works (small/medium/large)
- [ ] High contrast mode works
- [ ] TTS endpoint returns audio (mock or real)
- [ ] Translation endpoint returns translated text (mock or real)
- [ ] Staff dashboard shows charts with mock data
- [ ] Accessibility menu fully functional
