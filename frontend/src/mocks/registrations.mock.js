/**
 * Mock Registrations Data
 * For testing without backend
 */

import { mockActivities } from './activities.mock'

// In-memory registrations store
let mockRegistrations = [
  {
    id: 'reg-1',
    user_id: 'user-1',
    activity_id: '1', // Morning Yoga
    status: 'confirmed',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z'
  },
  {
    id: 'reg-2',
    user_id: 'user-1',
    activity_id: '13', // Past board games
    status: 'confirmed',
    created_at: '2026-01-14T10:00:00Z',
    updated_at: '2026-01-14T10:00:00Z'
  }
]

/**
 * Get all registrations for current user with activity details
 */
export const getRegistrations = () => {
  return mockRegistrations.map(reg => {
    const activity = mockActivities.find(a => a.id === reg.activity_id)
    return {
      ...reg,
      activity
    }
  })
}

/**
 * Create a new registration
 */
export const createRegistration = (data) => {
  // Check if already registered
  const existingReg = mockRegistrations.find(
    r => r.activity_id === data.activity_id && r.status === 'confirmed'
  )
  
  if (existingReg) {
    throw new Error('You are already registered for this activity')
  }

  const newReg = {
    id: `reg-${Date.now()}`,
    user_id: 'user-1',
    activity_id: data.activity_id,
    status: data.status || 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  mockRegistrations.push(newReg)

  // Update activity participant count
  const activity = mockActivities.find(a => a.id === data.activity_id)
  if (activity) {
    activity.current_participants += 1
  }

  return newReg
}

/**
 * Cancel a registration
 */
export const cancelRegistration = (id) => {
  const index = mockRegistrations.findIndex(r => r.id === id)
  if (index !== -1) {
    const reg = mockRegistrations[index]
    
    // Update activity participant count
    const activity = mockActivities.find(a => a.id === reg.activity_id)
    if (activity && reg.status === 'confirmed') {
      activity.current_participants = Math.max(0, activity.current_participants - 1)
    }

    // Remove registration
    mockRegistrations.splice(index, 1)
    return true
  }
  return false
}

/**
 * Get registrations by activity ID
 */
export const getRegistrationsByActivity = (activityId) => {
  return mockRegistrations.filter(reg => reg.activity_id === activityId)
}

/**
 * Reset registrations (for testing)
 */
export const resetRegistrations = () => {
  mockRegistrations = [
    {
      id: 'reg-1',
      user_id: 'user-1',
      activity_id: '1',
      status: 'confirmed',
      created_at: '2026-01-18T10:00:00Z',
      updated_at: '2026-01-18T10:00:00Z'
    },
    {
      id: 'reg-2',
      user_id: 'user-1',
      activity_id: '13',
      status: 'confirmed',
      created_at: '2026-01-14T10:00:00Z',
      updated_at: '2026-01-14T10:00:00Z'
    }
  ]
}
