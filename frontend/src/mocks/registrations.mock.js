/**
 * Mock Registrations Data
 * For testing without backend
 */

import { mockActivities, ACTIVITY_UUIDS } from './activities.mock'

// Mock users for testing with registrations
const mockUsers = [
  {
    id: 'user-1',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+65 9123 4567',
    caregiver_phone: '+65 8123 4567',
    wheelchair_required: true,
    role: 'participant'
  },
  {
    id: 'user-2',
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+65 9234 5678',
    caregiver_phone: null,
    wheelchair_required: false,
    role: 'participant'
  },
  {
    id: 'user-3',
    full_name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+65 9345 6789',
    caregiver_phone: '+65 8234 5678',
    wheelchair_required: true,
    role: 'participant'
  },
  {
    id: 'user-4',
    full_name: 'Sarah Lee',
    email: 'sarah.lee@example.com',
    phone: '+65 9456 7890',
    caregiver_phone: null,
    wheelchair_required: false,
    role: 'participant'
  },
  {
    id: 'user-5',
    full_name: 'David Tan',
    email: 'david.tan@example.com',
    phone: '+65 9567 8901',
    caregiver_phone: '+65 8345 6789',
    wheelchair_required: false,
    role: 'participant'
  }
]

// In-memory registrations store
let mockRegistrations = [
  {
    id: 'reg-1',
    user_id: 'user-1',
    activity_id: ACTIVITY_UUIDS[0], // Morning Yoga
    status: 'confirmed',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z'
  },
  {
    id: 'reg-2',
    user_id: 'user-2',
    activity_id: ACTIVITY_UUIDS[0], // Morning Yoga
    status: 'confirmed',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z'
  },
  {
    id: 'reg-3',
    user_id: 'user-3',
    activity_id: ACTIVITY_UUIDS[1], // Arts & Crafts
    status: 'confirmed',
    created_at: '2026-01-18T11:00:00Z',
    updated_at: '2026-01-18T11:00:00Z'
  },
  {
    id: 'reg-4',
    user_id: 'user-4',
    activity_id: ACTIVITY_UUIDS[1], // Arts & Crafts
    status: 'confirmed',
    created_at: '2026-01-18T11:00:00Z',
    updated_at: '2026-01-18T11:00:00Z'
  },
  {
    id: 'reg-5',
    user_id: 'user-5',
    activity_id: ACTIVITY_UUIDS[1], // Arts & Crafts
    status: 'confirmed',
    created_at: '2026-01-18T11:00:00Z',
    updated_at: '2026-01-18T11:00:00Z'
  },
  {
    id: 'reg-6',
    user_id: 'user-1',
    activity_id: ACTIVITY_UUIDS[4], // Swimming
    status: 'confirmed',
    created_at: '2026-01-19T10:00:00Z',
    updated_at: '2026-01-19T10:00:00Z'
  },
  {
    id: 'reg-7',
    user_id: 'user-2',
    activity_id: ACTIVITY_UUIDS[4], // Swimming
    status: 'confirmed',
    created_at: '2026-01-19T10:00:00Z',
    updated_at: '2026-01-19T10:00:00Z'
  }
]

/**
 * Get all registrations for current user with activity details
 */
export const getRegistrations = (userId = 'user-1') => {
  return mockRegistrations
    .filter(reg => reg.user_id === userId)
    .map(reg => {
      const activity = mockActivities.find(a => a.id === reg.activity_id)
      return {
        ...reg,
        activity
      }
    })
}

/**
 * Get ALL registrations (for staff) with activity and user details
 */
export const getAllRegistrations = () => {
  return mockRegistrations.map(reg => {
    const activity = mockActivities.find(a => a.id === reg.activity_id)
    const user = mockUsers.find(u => u.id === reg.user_id)
    return {
      ...reg,
      activity,
      user
    }
  })
}

/**
 * Create a new registration
 */
export const createRegistration = (data) => {
  const userId = data.user_id || 'user-1'
  
  // Check if already registered
  const existingReg = mockRegistrations.find(
    r => r.user_id === userId && r.activity_id === data.activity_id && r.status === 'confirmed'
  )
  
  if (existingReg) {
    throw new Error('You are already registered for this activity')
  }

  const newReg = {
    id: `reg-${Date.now()}`,
    user_id: userId,
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
      activity_id: ACTIVITY_UUIDS[0],
      status: 'confirmed',
      created_at: '2026-01-18T10:00:00Z',
      updated_at: '2026-01-18T10:00:00Z'
    },
    {
      id: 'reg-2',
      user_id: 'user-2',
      activity_id: ACTIVITY_UUIDS[0],
      status: 'confirmed',
      created_at: '2026-01-18T10:00:00Z',
      updated_at: '2026-01-18T10:00:00Z'
    }
  ]
}

export { mockUsers }
