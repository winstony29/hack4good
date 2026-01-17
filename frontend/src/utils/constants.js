export const ROLES = {
  PARTICIPANT: 'participant',
  VOLUNTEER: 'volunteer',
  STAFF: 'staff'
}

export const MEMBERSHIP_TYPES = {
  AD_HOC: 'ad_hoc',
  ONCE_WEEKLY: 'once_weekly',
  TWICE_WEEKLY: 'twice_weekly',
  THREE_PLUS: '3_plus'
}

export const MEMBERSHIP_LABELS = {
  [MEMBERSHIP_TYPES.AD_HOC]: 'Ad-hoc',
  [MEMBERSHIP_TYPES.ONCE_WEEKLY]: 'Once Weekly',
  [MEMBERSHIP_TYPES.TWICE_WEEKLY]: 'Twice Weekly',
  [MEMBERSHIP_TYPES.THREE_PLUS]: '3+ Times Weekly'
}

export const LANGUAGES = {
  ENGLISH: 'en',
  MANDARIN: 'zh',
  MALAY: 'ms',
  TAMIL: 'ta'
}

export const LANGUAGE_LABELS = {
  [LANGUAGES.ENGLISH]: 'English',
  [LANGUAGES.MANDARIN]: '中文',
  [LANGUAGES.MALAY]: 'Malay',
  [LANGUAGES.TAMIL]: 'தமிழ்'
}

export const REGISTRATION_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  WAITLIST: 'waitlist'
}

export const API_ENDPOINTS = {
  AUTH: '/auth',
  ACTIVITIES: '/activities',
  REGISTRATIONS: '/registrations',
  MATCHES: '/matches',
  NOTIFICATIONS: '/notifications',
  STAFF: '/staff',
  ACCESSIBILITY: '/accessibility'
}
