/**
 * Mock User Switcher
 * Quick way to switch between different user types for testing
 */

import { mockUser, mockStaffUser, mockVolunteerUser } from './users.mock'

// Change this to switch users
// Options: 'participant' | 'volunteer' | 'staff'
export const ACTIVE_USER_TYPE = 'staff'

export const getCurrentMockUser = () => {
  switch (ACTIVE_USER_TYPE) {
    case 'staff':
      return mockStaffUser
    case 'volunteer':
      return mockVolunteerUser
    case 'participant':
    default:
      return mockUser
  }
}

// For quick testing in console
if (typeof window !== 'undefined') {
  window.switchMockUser = (type) => {
    console.log(`To switch users, change ACTIVE_USER_TYPE in userSwitcher.mock.js to: '${type}'`)
    console.log('Available types: participant, volunteer, staff')
    console.log('Then refresh the page.')
  }
}
