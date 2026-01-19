/**
 * Design System: Typography
 *
 * Centralized typography definitions for consistent text styling.
 * Use these constants to ensure heading hierarchy and text styling consistency.
 */

// Heading styles - use for semantic headings (h1-h4)
export const HEADINGS = {
  h1: 'text-3xl font-bold text-gray-900',
  h2: 'text-2xl font-semibold text-gray-900',
  h3: 'text-xl font-semibold text-gray-900',
  h4: 'text-lg font-semibold text-gray-900',
};

// Body text styles
export const BODY = {
  // Default body text
  base: 'text-base text-gray-900',

  // Large body text (intros, emphasis)
  large: 'text-lg text-gray-900',

  // Secondary/description text
  secondary: 'text-base text-gray-600',

  // Small body text
  small: 'text-sm text-gray-600',

  // Extra small (hints, timestamps)
  xs: 'text-xs text-gray-500',
};

// Form-related typography
export const FORM = {
  // Input labels
  label: 'text-sm font-medium text-gray-700',

  // Helper text below inputs
  helper: 'text-sm text-gray-500',

  // Error messages
  error: 'text-sm text-red-600',

  // Success messages
  success: 'text-sm text-green-600',

  // Required field indicator
  required: 'text-red-500',
};

// Stats/metrics display
export const STATS = {
  // Large stat value (dashboard numbers)
  value: 'text-2xl font-bold text-gray-900',

  // Stat label
  label: 'text-sm font-medium text-gray-500',

  // Small stat value
  valueSmall: 'text-xl font-semibold text-gray-900',
};

// Special purpose typography
export const SPECIAL = {
  // Badge text
  badge: 'text-xs font-medium',

  // Button text (handled by Button component, but for reference)
  buttonSm: 'text-sm font-medium',
  buttonMd: 'text-base font-medium',
  buttonLg: 'text-lg font-medium',

  // Navigation links
  navLink: 'text-sm font-medium text-gray-700',
  navLinkActive: 'text-sm font-medium text-primary-600',

  // Card title (alias for h3)
  cardTitle: 'text-xl font-semibold text-gray-900',

  // Modal title (alias for h2)
  modalTitle: 'text-2xl font-semibold text-gray-900',

  // Empty state
  emptyTitle: 'text-lg font-semibold text-gray-900',
  emptyDescription: 'text-sm text-gray-500',
};

// Display text (hero sections, 404, etc.)
export const DISPLAY = {
  // Hero heading
  hero: 'text-5xl md:text-6xl font-bold text-gray-900',

  // Large display (404 page)
  xxl: 'text-9xl font-bold text-gray-200',

  // Match animation title
  celebration: 'text-4xl font-bold text-white',
};

// Combine all typography into single export
export const TYPOGRAPHY = {
  ...HEADINGS,
  body: BODY,
  form: FORM,
  stats: STATS,
  special: SPECIAL,
  display: DISPLAY,
};

export default TYPOGRAPHY;
