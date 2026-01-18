/**
 * Mock User Data
 * For testing without backend
 */

export const mockUser = {
  id: 'user-1',
  email: 'participant@example.com',
  user_metadata: {
    role: 'participant',
    full_name: 'Alex Chen',
    membership_type: 'once_weekly',
    phone: '+65 9123 4567',
    caregiver_phone: '+65 9876 5432',
    preferred_language: 'en',
    font_size_preference: 'medium',
    high_contrast: false
  },
  created_at: '2026-01-01T00:00:00Z'
}

export const mockStaffUser = {
  id: 'user-2',
  email: 'staff@example.com',
  user_metadata: {
    role: 'staff',
    full_name: 'Sarah Wong',
    preferred_language: 'en'
  },
  created_at: '2026-01-01T00:00:00Z'
}

export const mockVolunteerUser = {
  id: 'user-3',
  email: 'volunteer@example.com',
  user_metadata: {
    role: 'volunteer',
    full_name: 'David Tan',
    phone: '+65 8123 4567',
    preferred_language: 'en'
  },
  created_at: '2026-01-01T00:00:00Z'
}

// Different membership types for testing
export const mockParticipantAdHoc = {
  ...mockUser,
  id: 'user-4',
  email: 'adhoc@example.com',
  user_metadata: {
    ...mockUser.user_metadata,
    full_name: 'Jamie Lee',
    membership_type: 'ad_hoc'
  }
}

export const mockParticipantTwiceWeekly = {
  ...mockUser,
  id: 'user-5',
  email: 'twice@example.com',
  user_metadata: {
    ...mockUser.user_metadata,
    full_name: 'Robin Kumar',
    membership_type: 'twice_weekly'
  }
}
