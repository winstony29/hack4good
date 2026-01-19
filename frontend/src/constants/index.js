/**
 * Design System Constants
 *
 * Central export for all design system tokens.
 * Import from here for convenient access to all constants.
 *
 * Usage:
 *   import { TYPOGRAPHY, SPACING, COLORS, STYLES } from '@/constants';
 *   import { SEMANTIC_COLORS, getActivityTypeClasses } from '@/constants';
 */

// Colors
export {
  SEMANTIC_COLORS,
  CHART_COLORS,
  PROGRAM_COLORS,
  ACTIVITY_TYPE_COLORS,
  CONFETTI_COLORS,
  TOAST_COLORS,
  NEUTRALS,
  SWIPER_COLORS,
  ANALYTICS_COLORS,
  getActivityTypeColors,
  getActivityTypeClasses,
} from './colors';

// Typography
export {
  HEADINGS,
  BODY,
  FORM as FORM_TYPOGRAPHY,
  STATS,
  SPECIAL,
  DISPLAY,
  TYPOGRAPHY,
} from './typography';

// Spacing
export {
  PADDING,
  STACK,
  GAP,
  MARGIN,
  SPACING,
} from './spacing';

// Styles
export {
  RADIUS,
  SHADOW,
  FOCUS,
  TRANSITION,
  HOVER,
  DISABLED,
  BORDER,
  BACKDROP,
  COMPONENTS,
  STYLES,
} from './styles';
