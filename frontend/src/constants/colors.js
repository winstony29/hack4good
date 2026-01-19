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

// Chart/visualization colors (hex values for Recharts)
export const CHART_COLORS = {
  primary: '#2563eb',     // blue-600 - registrations, primary metrics
  secondary: '#10b981',   // green-500 - volunteers, positive trends
  tertiary: '#f59e0b',    // amber-500 - social activities, warnings
  quaternary: '#8b5cf6',  // purple-500 - music/arts
  quinary: '#ec4899',     // pink-500 - additional category

  // Specific chart uses
  registrations: '#2563eb',
  volunteers: '#10b981',
  covered: '#10b981',
  uncovered: '#d1d5db',   // gray-300

  // Grid/axis
  grid: '#e5e7eb',        // gray-200
  axis: '#6b7280',        // gray-500
};

// Program/pie chart colors
export const PROGRAM_COLORS = {
  exercise: '#10b981',      // green-500
  artsAndCrafts: '#3b82f6', // blue-500
  socialActivities: '#f59e0b', // amber-500
  musicTherapy: '#8b5cf6',  // purple-500
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
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-900',
    hex: { bg: '#f0fdf4', border: '#4ade80', text: '#14532d' },
  },
  social: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    text: 'text-amber-900',
    hex: { bg: '#fffbeb', border: '#fbbf24', text: '#78350f' },
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

// Confetti colors for match celebration
export const CONFETTI_COLORS = [
  '#22c55e', // green-500
  '#16a34a', // green-600
  '#4ade80', // green-400
  '#86efac', // green-300
];

// Toast notification colors (hex for react-hot-toast)
export const TOAST_COLORS = {
  success: {
    icon: '#10b981',      // green-500
    background: '#ffffff',
    text: '#1f2937',      // gray-800
  },
  error: {
    icon: '#ef4444',      // red-500
    background: '#ffffff',
    text: '#1f2937',
  },
  info: {
    icon: '#3b82f6',      // blue-500
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
