---
phase: 03-integration
plan: 01
subsystem: frontend
tags: [accessibility, framer-motion, reduce-motion, tts]

# Dependency graph
requires:
  - phase: 01-05
    provides: ActivitySwiper with MatchAnimation and SwipeableCard
  - phase: 02-01
    provides: AccessibilityContext with reduceMotion setting
provides:
  - Reduce motion support in volunteer swiper
  - TTS button on activity cards
affects: [volunteer-features, accessibility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useAccessibility hook for accessing accessibility state
    - Conditional animation transitions based on reduceMotion

key-files:
  created: []
  modified:
    - frontend/src/components/volunteer/SwipeableCard.jsx
    - frontend/src/components/volunteer/MatchAnimation.jsx
    - frontend/src/components/activities/ActivityCard.jsx

key-decisions:
  - "Use tween with 0.01s duration instead of removing animations"
  - "Skip confetti entirely when reduceMotion enabled"
  - "Only top swipe card shows TTS button to avoid clutter"

patterns-established:
  - "Conditional animation type based on reduceMotion preference"

issues-created: []

# Metrics
duration: 15min
completed: 2026-01-19
---

# Phase 03 Plan 01: Accessibility Integration Summary

**Wired Person 4's accessibility features into Person 3's volunteer swiper - reduce motion and TTS support**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-19
- **Completed:** 2026-01-19
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- SwipeableCard now respects reduceMotion preference - animations instant when enabled
- MatchAnimation skips confetti and uses instant transitions when reduceMotion enabled
- ActivityCard has optional TTS button support via `showTTS` prop
- Top swipe card shows "Read Aloud" button for accessibility

## Task Commits

1. **Task 1: SwipeableCard reduce motion** - `ef55576` (feat)
2. **Task 2: MatchAnimation reduce motion** - `69b865f` (feat)
3. **Task 3: TTS button on activity cards** - `195fcc9` (feat)

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/components/volunteer/SwipeableCard.jsx` | Import useAccessibility, use animDuration variable, conditional snap-back transition |
| `frontend/src/components/volunteer/MatchAnimation.jsx` | Import useAccessibility, skip confetti when reduceMotion, use tween transitions |
| `frontend/src/components/activities/ActivityCard.jsx` | Import TTSButton, add showTTS prop, render TTS button when enabled |

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Use instant transitions (0.01s) not removal | Preserves visual feedback while respecting preference |
| Skip confetti entirely | Confetti particles are the main source of motion discomfort |
| TTS only on top card | Avoid visual clutter on stacked cards |
| Option A (ActivityCard prop) | More reusable than swiper-specific implementation |

## Issues Encountered

None - plan executed as specified.

## Verification Results

- [x] `npm run build` succeeds
- [x] SwipeableCard imports and uses reduceMotion
- [x] MatchAnimation imports and uses reduceMotion
- [x] ActivityCard has optional TTS support
- [x] Build output increased by ~0.15kb (minimal impact)

## Next Phase Readiness

Phase 03 complete. Integration of Person 3 + Person 4 work finished.

### Manual Testing Recommended

1. Visit /swiper with reduceMotion OFF - verify smooth animations
2. Enable reduceMotion in Accessibility Menu - verify instant transitions
3. Swipe right - verify no confetti when reduceMotion ON
4. Click TTS button on top card - verify audio plays
