/**
 * Design System: Colors
 *
 * Centralized color definitions for consistent usage across the app.
 * Use these constants instead of hardcoding color values.
 */

// Semantic colors for status/feedback
// Usage: SEMANTIC_COLORS.success.DEFAULT for buttons, .light for backgrounds, .dark for text
export const SEMANTIC_COLORS = {
  success: {
    light: 'green-50',
    lighter: 'green-100',
    DEFAULT: 'green-600',
    dark: 'green-700',
    text: 'green-800',
  },
  error: {
    light: 'red-50',
    lighter: 'red-100',
    DEFAULT: 'red-600',
    dark: 'red-700',
    text: 'red-800',
  },
  warning: {
    light: 'amber-50',
    lighter: 'amber-100',
    DEFAULT: 'amber-500',
    dark: 'amber-600',
    text: 'amber-800',
  },
  info: {
    light: 'blue-50',
    lighter: 'blue-100',
    DEFAULT: 'blue-600',
    dark: 'blue-700',
    text: 'blue-800',
  },
};

// Person 3: Volunteer Swiper Colors (Warm coral/sage palette)
export const SWIPER_COLORS = {
  // Primary action - Match/Like
  match: {
    DEFAULT: '#56965a',    // sage-500
    light: '#a7d0a9',      // sage-300
    dark: '#38623b',       // sage-700
    glow: 'rgba(86, 150, 90, 0.4)',
    gradient: 'linear-gradient(135deg, #56965a 0%, #78b37c 100%)',
  },
  // Secondary action - Pass/Skip
  pass: {
    DEFAULT: '#ff6b4a',    // coral-500
    light: '#ffb3a3',      // coral-300
    dark: '#c93d21',       // coral-700
    glow: 'rgba(255, 107, 74, 0.4)',
    gradient: 'linear-gradient(135deg, #ff6b4a 0%, #ff8a73 100%)',
  },
  // Card backgrounds
  card: {
    bg: '#fff5f3',         // coral-50
    border: '#ffd4cb',     // coral-200
  },
  // Celebration
  celebration: {
    primary: '#56965a',
    secondary: '#78b37c',
    tertiary: '#a7d0a9',
    accent: '#ff6b4a',
  },
};

// Person 4: Staff Analytics Colors (Deep navy/gold palette)
export const ANALYTICS_COLORS = {
  // Primary chart color
  primary: '#6271f1',      // navy-500
  // Secondary chart color
  secondary: '#d4a106',    // gold-500
  // Supporting colors for multi-series charts
  tertiary: '#8093f8',     // navy-400
  quaternary: '#fde047',   // gold-300
  // Background
  bg: {
    card: '#f0f4ff',       // navy-50
    highlight: '#fefce8',  // gold-50
  },
  // Grid/axis
  grid: '#c7d6fe',         // navy-200
  axis: '#3435a3',         // navy-800
  // Stats cards
  stats: {
    activities: '#6271f1',  // navy-500
    registrations: '#56965a', // sage-500
    volunteers: '#8b5cf6',  // purple-500
    coverage: '#d4a106',    // gold-500
  },
};

// Chart/visualization colors (hex values for Recharts)
export const CHART_COLORS = {
  // Updated to use new palette
  primary: '#6271f1',     // navy-500
  secondary: '#56965a',   // sage-500 - volunteers, positive trends
  tertiary: '#d4a106',    // gold-500 - warnings, highlights
  quaternary: '#8b5cf6',  // purple-500 - music/arts
  quinary: '#ff6b4a',     // coral-500 - additional category

  // Specific chart uses
  registrations: '#6271f1',
  volunteers: '#56965a',
  covered: '#56965a',
  uncovered: '#e5e7eb',   // gray-200

  // Grid/axis
  grid: '#e5e7eb',        // gray-200
  axis: '#6b7280',        // gray-500
};

// Program/pie chart colors (updated)
export const PROGRAM_COLORS = {
  exercise: '#56965a',       // sage-500
  artsAndCrafts: '#6271f1',  // navy-500
  socialActivities: '#d4a106', // gold-500
  musicTherapy: '#8b5cf6',   // purple-500
};

// Activity type colors for calendar/cards
// Each type has bg (background), border, and text colors
export const ACTIVITY_TYPE_COLORS = {
  sports: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-900',
    hex: { bg: '#eff6ff', border: '#60a5fa', text: '#1e3a8a' },
  },
  arts: {
    bg: 'bg-purple-50',
    border: 'border-purple-400',
    text: 'text-purple-900',
    hex: { bg: '#faf5ff', border: '#c084fc', text: '#4c1d95' },
  },
  music: {
    bg: 'bg-pink-50',
    border: 'border-pink-400',
    text: 'text-pink-900',
    hex: { bg: '#fdf2f8', border: '#f472b6', text: '#831843' },
  },
  wellness: {
    bg: 'bg-sage-50',
    border: 'border-sage-400',
    text: 'text-sage-900',
    hex: { bg: '#f4f9f4', border: '#78b37c', text: '#28412b' },
  },
  social: {
    bg: 'bg-gold-50',
    border: 'border-gold-400',
    text: 'text-gold-900',
    hex: { bg: '#fefce8', border: '#facc15', text: '#654711' },
  },
  educational: {
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    text: 'text-orange-900',
    hex: { bg: '#fff7ed', border: '#fb923c', text: '#7c2d12' },
  },
  default: {
    bg: 'bg-gray-50',
    border: 'border-gray-400',
    text: 'text-gray-900',
    hex: { bg: '#f9fafb', border: '#9ca3af', text: '#111827' },
  },
};

// Confetti colors for match celebration (updated to sage/coral)
export const CONFETTI_COLORS = [
  '#56965a', // sage-500
  '#78b37c', // sage-400
  '#a7d0a9', // sage-300
  '#ff6b4a', // coral-500
  '#ff8a73', // coral-400
  '#ffd4cb', // coral-200
];

// Toast notification colors (hex for react-hot-toast)
export const TOAST_COLORS = {
  success: {
    icon: '#56965a',      // sage-500
    background: '#ffffff',
    text: '#1f2937',      // gray-800
  },
  error: {
    icon: '#ff6b4a',      // coral-500
    background: '#ffffff',
    text: '#1f2937',
  },
  info: {
    icon: '#6271f1',      // navy-500
    background: '#f3f4f6', // gray-100
    text: '#6b7280',      // gray-500
  },
};

// Neutral/gray scale reference
export const NEUTRALS = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

// Helper to get activity type colors
export function getActivityTypeColors(type) {
  const normalizedType = type?.toLowerCase() || 'default';
  return ACTIVITY_TYPE_COLORS[normalizedType] || ACTIVITY_TYPE_COLORS.default;
}

// Helper to get activity type Tailwind classes as a string
export function getActivityTypeClasses(type) {
  const colors = getActivityTypeColors(type);
  return `${colors.bg} ${colors.border} ${colors.text}`;
}
