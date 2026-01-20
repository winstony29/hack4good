# Hack4Good Roadmap

## Completed Milestones

- [v1.0](milestones/v1.0-ROADMAP.md) (Phases 1-5) — SHIPPED 2026-01-19

## Current Milestone

- 🚧 **v1.1 UX Polish** - Phases 6-9 (in progress)

## Upcoming Milestone

- 📋 **v2.0 Inclusive Design Overhaul** - Phases 10-14 (planned)

---

### 🚧 v1.1 UX Polish (In Progress)

**Milestone Goal:** Refine the user experience across animations, feedback, mobile responsiveness, and visual consistency.

**Constraints:**
- No new features - focus purely on polish and refinement
- Must maintain all existing functionality
- Accessibility features must remain fully functional

#### Phase 6: Animations & Transitions

**Goal**: Smooth swipe gestures on activity cards, page transitions between routes, micro-interactions on buttons/inputs, celebratory effects refinement
**Depends on**: v1.0 complete
**Research**: Unlikely (Framer Motion already in project)
**Plans**: 2

Plans:
- [x] 06-01: Button & Input micro-interactions
- [x] 06-02: Modal animations & page transitions

#### Phase 7: Error Handling & Feedback

**Goal**: Consistent loading states across all async operations, clear error messages with recovery options, success/failure toast notifications, form validation feedback
**Depends on**: Phase 6
**Research**: Unlikely (react-hot-toast already in project)
**Plans**: 2

Plans:
- [x] 07-01: Loading states & async error handling
- [x] 07-02: Form validation feedback

#### Phase 8: Mobile Responsiveness

**Goal**: Touch-friendly tap targets, responsive layouts at all breakpoints, swipe gestures optimized for mobile, navigation adaptations for small screens
**Depends on**: Phase 7
**Research**: Unlikely (Tailwind CSS responsive utilities)
**Plans**: TBD

Plans:
- [x] 08-01: Touch target sizes
- [x] 08-02: Swiper mobile optimization

#### Phase 9: Visual Consistency

**Goal**: Unified spacing system, typography scale refinement, color usage audit and consistency, component style standardization
**Depends on**: Phase 8
**Research**: Unlikely (internal design system refinement)
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

---

### 📋 v2.0 Inclusive Design Overhaul (Planned)

**Milestone Goal:** Complete visual redesign with warm, inclusive aesthetic inspired by Zebra Strategies. Focus on cognitive accessibility for persons with intellectual disabilities (PWIDs).

**Constraints:**
- All changes must improve accessibility (WCAG 2.1 AA minimum)
- Maintain all existing functionality
- Test with screen readers and keyboard navigation
- Keep language simple and clear

**Design Direction:**
- Warm, welcoming colors (cream background, coral primary)
- Larger touch targets (48px minimum)
- Clear visual hierarchy
- Rounded, friendly shapes
- Cognitive accessibility features

#### Phase 10: Design Foundation

**Goal**: Update Tailwind theme with MINDS color palette (coral, teal, amber, cream), install Nunito + DM Sans fonts, establish CSS custom properties for accessibility modes
**Depends on**: v1.1 complete (or can run in parallel)
**Research**: Unlikely (Tailwind already configured)
**Plans**: 2

Plans:
- [x] 10-01: Color palette & typography configuration
- [x] 10-02: Core component restyling (Button, Input, Card)

#### Phase 11: Accessibility Enhancement

**Goal**: Floating accessibility toolbar (text size, high contrast, readable font, reduce motion), skip-to-content link, improved keyboard navigation, visible focus states
**Depends on**: Phase 10
**Research**: Unlikely (building on existing AccessibilityContext)
**Plans**: 2

Plans:
- [x] 11-01: Floating accessibility toolbar
- [ ] 11-02: Skip link, focus states, OpenDyslexic font

#### Phase 12: Navigation Redesign

**Goal**: Warm cream navbar, prominent coral CTAs, improved mobile hamburger menu with large touch targets
**Depends on**: Phase 11
**Research**: Unlikely
**Plans**: 1

Plans:
- [ ] 12-01: Navbar redesign (desktop + mobile)

#### Phase 13: Landing Page Redesign

**Goal**: Hero section with "Everyone Belongs Here" message, warm gradient background, features section, community CTA
**Depends on**: Phase 12
**Research**: Unlikely
**Plans**: 1

Plans:
- [ ] 13-01: Landing page hero & features

#### Phase 14: Activity Cards Redesign

**Goal**: Warm activity cards with color accent bars, icon boxes, accessibility badges, keyboard navigation
**Depends on**: Phase 13
**Research**: Unlikely
**Plans**: 1

Plans:
- [ ] 14-01: ActivityCard & Badge redesign

---

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Volunteer Swiper | v1.0 | 5/5 | Complete | 2026-01-18 |
| 2. Experience Lead | v1.0 | 4/4 | Complete | 2026-01-18 |
| 3. Integration | v1.0 | 1/1 | Complete | 2026-01-18 |
| 4. Person 3 Backend | v1.0 | 3/3 | Complete | 2026-01-19 |
| 5. Person 4 Staff API | v1.0 | 2/2 | Complete | 2026-01-19 |
| 6. Animations & Transitions | v1.1 | 2/2 | Complete | 2026-01-19 |
| 7. Error Handling & Feedback | v1.1 | 2/2 | Complete | 2026-01-19 |
| 8. Mobile Responsiveness | v1.1 | 2/3 | In progress | - |
| 9. Visual Consistency | v1.1 | 0/? | Not started | - |
| 10. Design Foundation | v2.0 | 2/2 | Complete | 2026-01-20 |
| 11. Accessibility Enhancement | v2.0 | 1/2 | In progress | - |
| 12. Navigation Redesign | v2.0 | 0/1 | Planned | - |
| 13. Landing Page Redesign | v2.0 | 0/1 | Planned | - |
| 14. Activity Cards Redesign | v2.0 | 0/1 | Planned | - |
