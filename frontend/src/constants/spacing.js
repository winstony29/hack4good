/**
 * Design System: Spacing
 *
 * Centralized spacing definitions for consistent layout.
 * Based on Tailwind's spacing scale (1 unit = 4px).
 */

// Component internal padding
export const PADDING = {
  // Cards and containers
  card: 'p-6',              // 24px - standard card padding
  cardCompact: 'p-4',       // 16px - compact card padding
  cardHeader: 'px-6 py-4',  // standard card header/footer

  // Modal padding
  modal: 'p-6',             // 24px - modal sections

  // Form inputs
  input: 'px-4 py-2',       // 16px horizontal, 8px vertical
  inputWithIcon: 'pl-4 pr-10 py-2', // extra right padding for icon

  // Buttons
  buttonSm: 'px-3 py-1.5',  // 12px horizontal, 6px vertical
  buttonMd: 'px-4 py-2',    // 16px horizontal, 8px vertical
  buttonLg: 'px-6 py-3',    // 24px horizontal, 12px vertical

  // Badges
  badgeSm: 'px-2 py-0.5',   // 8px horizontal, 2px vertical
  badgeMd: 'px-2.5 py-1',   // 10px horizontal, 4px vertical
  badgeLg: 'px-3 py-1.5',   // 12px horizontal, 6px vertical

  // Page sections
  section: 'px-4 py-8',     // page section padding
  sectionLg: 'px-6 py-12',  // large section padding
};

// Vertical stacking (space-y)
export const STACK = {
  // Tight - related items, validation messages
  tight: 'space-y-1',       // 4px

  // Compact - list items, related fields
  compact: 'space-y-2',     // 8px

  // Normal - standard list items
  normal: 'space-y-3',      // 12px

  // Relaxed - form field groups, card content
  relaxed: 'space-y-4',     // 16px

  // Loose - major form sections
  loose: 'space-y-6',       // 24px

  // Section - top-level page sections
  section: 'space-y-8',     // 32px
};

// Grid gaps
export const GAP = {
  // Tight - dense grids, icon groups
  tight: 'gap-2',           // 8px

  // Compact - button groups, tags
  compact: 'gap-3',         // 12px

  // Normal - card grids, form layouts
  normal: 'gap-4',          // 16px

  // Relaxed - dashboard grids
  relaxed: 'gap-6',         // 24px

  // Loose - feature grids, landing sections
  loose: 'gap-8',           // 32px
};

// Margins (for specific use cases)
export const MARGIN = {
  // Label to input
  labelBottom: 'mb-2',      // 8px

  // Helper text spacing
  helperTop: 'mt-1',        // 4px

  // Section title spacing
  sectionTitle: 'mb-4',     // 16px

  // Card/section separation
  cardBottom: 'mb-6',       // 24px

  // Major section separation
  sectionBottom: 'mb-8',    // 32px
};

// Combine all spacing into single export
export const SPACING = {
  padding: PADDING,
  stack: STACK,
  gap: GAP,
  margin: MARGIN,
};

export default SPACING;
