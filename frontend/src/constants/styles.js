/**
 * Design System: Component Styles
 *
 * Centralized style definitions for consistent component appearance.
 * Includes borders, shadows, transitions, focus states, and hover effects.
 */

// Border radius
export const RADIUS = {
  // Standard rounded corners (cards, buttons, inputs)
  default: 'rounded-lg',

  // Small rounded corners (badges, tags)
  small: 'rounded-md',

  // Full rounded (pills, avatars, icon buttons)
  full: 'rounded-full',

  // No rounding
  none: 'rounded-none',
};

// Shadows - use hierarchically (cards < elevated < modal)
export const SHADOW = {
  // No shadow
  none: 'shadow-none',

  // Subtle shadow (cards at rest)
  card: 'shadow-md',

  // Elevated shadow (hovered cards, dropdowns)
  elevated: 'shadow-lg',

  // Modal/overlay shadow
  modal: 'shadow-xl',

  // Colored shadow for special elements
  colored: (color) => `shadow-lg shadow-${color}-500/50`,
};

// Focus states - standardized across all interactive elements
export const FOCUS = {
  // Standard focus ring (buttons, inputs, links)
  ring: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',

  // Focus ring without offset (for elements with borders)
  ringNoOffset: 'focus:outline-none focus:ring-2 focus:ring-primary-500',

  // Visible focus (keyboard navigation)
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',

  // Error state focus
  error: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',

  // Success state focus
  success: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
};

// Transitions
export const TRANSITION = {
  // Color transitions (text, background, border)
  colors: 'transition-colors duration-200',

  // Shadow transitions (elevation changes)
  shadow: 'transition-shadow duration-200',

  // Transform transitions (scale, rotate)
  transform: 'transition-transform duration-200',

  // All properties (use sparingly)
  all: 'transition-all duration-200',

  // Fast transition (micro-interactions)
  fast: 'transition-all duration-150',

  // Slow transition (page transitions)
  slow: 'transition-all duration-300',
};

// Hover states
export const HOVER = {
  // Card hover (elevation)
  card: 'hover:shadow-lg',

  // Button hover opacity
  button: 'hover:opacity-90',

  // Link hover
  link: 'hover:text-primary-600',

  // Scale up (icons, interactive elements)
  scale: 'hover:scale-105',

  // Scale up more (swipe buttons)
  scaleLarge: 'hover:scale-110',

  // Background highlight
  highlight: 'hover:bg-gray-50',
};

// Disabled states
export const DISABLED = {
  // Standard disabled (reduced opacity, no pointer)
  default: 'disabled:opacity-50 disabled:cursor-not-allowed',

  // Disabled with muted colors
  muted: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
};

// Borders
export const BORDER = {
  // Default border
  default: 'border border-gray-200',

  // Thicker border
  thick: 'border-2 border-gray-200',

  // Bottom border only (dividers)
  bottom: 'border-b border-gray-200',

  // Top border only
  top: 'border-t border-gray-200',

  // Error border
  error: 'border border-red-500',

  // Success border
  success: 'border border-green-500',

  // Focus border (when using border instead of ring)
  focus: 'border-primary-500',
};

// Backdrop/overlay
export const BACKDROP = {
  // Modal backdrop
  modal: 'bg-black/50',

  // Darker backdrop (match animation)
  dark: 'bg-black/60',

  // Light backdrop
  light: 'bg-white/80',

  // Blur effect
  blur: 'backdrop-blur-sm',
};

// Common component class combinations
export const COMPONENTS = {
  // Standard card
  card: `bg-white ${RADIUS.default} ${SHADOW.card} ${BORDER.default}`,

  // Interactive card (with hover)
  cardInteractive: `bg-white ${RADIUS.default} ${SHADOW.card} ${BORDER.default} ${TRANSITION.shadow} ${HOVER.card}`,

  // Modal container
  modal: `bg-white ${RADIUS.default} ${SHADOW.modal}`,

  // Input field
  input: `${RADIUS.default} ${BORDER.default} ${FOCUS.ringNoOffset} ${TRANSITION.colors}`,

  // Primary button
  buttonPrimary: `${RADIUS.default} ${FOCUS.ring} ${TRANSITION.colors} ${DISABLED.default}`,

  // Icon button (circular)
  buttonIcon: `${RADIUS.full} ${FOCUS.ring} ${TRANSITION.all}`,
};

// Combine all styles into single export
export const STYLES = {
  radius: RADIUS,
  shadow: SHADOW,
  focus: FOCUS,
  transition: TRANSITION,
  hover: HOVER,
  disabled: DISABLED,
  border: BORDER,
  backdrop: BACKDROP,
  components: COMPONENTS,
};

export default STYLES;
