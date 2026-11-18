/**
 * Mock Volunteer Matches Data
 * For testing volunteer flow
 */

import { mockActivities, ACTIVITY_UUIDS } from './activities.mock'

// In-memory volunteer matches store — populated for realistic demo
let mockVolunteerMatches = [
  {
    id: 'match-1',
    volunteer_id: 'user-3',
    activity_id: ACTIVITY_UUIDS[1], // Morning Yoga — Jan 31
    status: 'confirmed',
    matched_at: '2026-01-27T10:00:00Z',
    updated_at: '2026-01-27T10:00:00Z'
  },
  {
    id: 'match-2',
    volunteer_id: 'user-3',
    activity_id: ACTIVITY_UUIDS[3], // Basketball Practice — Feb 1
    status: 'confirmed',
    matched_at: '2026-01-28T09:00:00Z',
    updated_at: '2026-01-28T09:00:00Z'
  },
  {
    id: 'match-3',
    volunteer_id: 'user-3',
    activity_id: ACTIVITY_UUIDS[5], // Swimming — Feb 2
    status: 'confirmed',
    matched_at: '2026-01-28T14:00:00Z',
    updated_at: '2026-01-28T14:00:00Z'
  },
  {
    id: 'match-4',
    volunteer_id: 'user-3',
    activity_id: ACTIVITY_UUIDS[7], // Dance Party — Feb 3
    status: 'confirmed',
    matched_at: '2026-01-29T11:00:00Z',
    updated_at: '2026-01-29T11:00:00Z'
  },
  {
    id: 'match-5',
    volunteer_id: 'user-3',
    activity_id: ACTIVITY_UUIDS[10], // Painting Workshop — Feb 5
    status: 'confirmed',
    matched_at: '2026-01-30T08:00:00Z',
    updated_at: '2026-01-30T08:00:00Z'
  }
]
// Volunteer user-3 (David Tan): 5 upcoming matches across the week

/**
 * Get all volunteer matches for current user with activity details
 */
export const getVolunteerMatches = (volunteerId = 'user-3') => {
  return mockVolunteerMatches
    .filter(match => match.volunteer_id === volunteerId)
    .map(match => {
      const activity = mockActivities.find(a => a.id === match.activity_id)
      return {
        ...match,
        activity
      }
    })
}

/**
 * Create a new volunteer match
 */
export const createVolunteerMatch = (data) => {
  // Check if already matched
  const existingMatch = mockVolunteerMatches.find(
    m => m.activity_id === data.activity_id && m.volunteer_id === data.volunteer_id && m.status === 'confirmed'
  )
  
  if (existingMatch) {
    throw new Error('You are already volunteering for this activity')
  }

  const newMatch = {
    id: `match-${Date.now()}`,
    volunteer_id: data.volunteer_id || 'user-3',
    activity_id: data.activity_id,
    status: data.status || 'confirmed',
    matched_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  mockVolunteerMatches.push(newMatch)
  return newMatch
}

/**
 * Cancel a volunteer match
 */
export const cancelVolunteerMatch = (id) => {
  const index = mockVolunteerMatches.findIndex(m => m.id === id)
  if (index !== -1) {
    mockVolunteerMatches.splice(index, 1)
    return true
  }
  return false
}

/**
 * Get volunteer matches by activity ID
 */
export const getMatchesByActivity = (activityId) => {
  return mockVolunteerMatches.filter(match => match.activity_id === activityId)
}

/**
 * Get activities available for volunteer to swipe on
 * Excludes activities they've already matched with
 * Only returns future activities (date >= today)
 */
export const getAvailableActivitiesMock = (volunteerId = 'user-3') => {
  const today = new Date().toISOString().split('T')[0]

  // Get IDs of activities volunteer already matched with
  const matchedActivityIds = mockVolunteerMatches
    .filter(match => match.volunteer_id === volunteerId && match.status === 'confirmed')
    .map(match => match.activity_id)

  // Return future activities not yet matched
  return mockActivities.filter(activity =>
    activity.date >= today &&
    !matchedActivityIds.includes(activity.id)
  )
}

/**
 * Reset volunteer matches (for testing)
 */
export const resetVolunteerMatches = () => {
  // Reset not needed for demo — data persists in memory until page refresh
}
