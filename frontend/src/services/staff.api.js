import api from './api'
import { USE_MOCK_DATA } from '../utils/env'
import { getRegistrationsByActivity, mockUsers } from '../mocks/registrations.mock'
import { getMatchesByActivity } from '../mocks/volunteerMatches.mock'
import { mockActivities } from '../mocks/activities.mock'

/**
 * Build attendance data from live in-memory mock state.
 * Reads registrations and volunteer matches at call time,
 * so adds/removes/cancels are reflected immediately.
 */
function getMockAttendance(activityId) {
  // Participants: confirmed registrations for this activity
  const regs = getRegistrationsByActivity(activityId)
  const participants = regs
    .filter(r => r.status === 'confirmed')
    .map(r => {
      const user = mockUsers.find(u => u.id === r.user_id)
      return {
        id: r.user_id,
        name: user?.full_name || 'Unknown',
        email: user?.email || null,
        phone: user?.phone || null
      }
    })

  // Volunteers: confirmed matches for this activity
  const matches = getMatchesByActivity(activityId)
  const volunteers = matches
    .filter(m => m.status === 'confirmed')
    .map(m => {
      const user = mockUsers.find(u => u.id === m.volunteer_id)
      return {
        id: m.volunteer_id,
        name: user?.full_name || 'Unknown',
        email: user?.email || null,
        phone: user?.phone || null
      }
    })

  return { participants, volunteers }
}

/**
 * Build mock analytics from live in-memory state.
 */
function getMockAnalytics() {
  const totalActivities = mockActivities.length
  const totalParticipants = mockActivities.reduce((sum, a) => sum + (a.current_participants || 0), 0)
  const totalCapacity = mockActivities.reduce((sum, a) => sum + (a.max_capacity || 0), 0)

  return {
    total_activities: totalActivities,
    total_registrations: totalParticipants,
    total_capacity: totalCapacity,
    utilization_rate: totalCapacity > 0 ? Math.round((totalParticipants / totalCapacity) * 100) : 0,
    activities_by_type: mockActivities.reduce((acc, a) => {
      acc[a.program_type] = (acc[a.program_type] || 0) + 1
      return acc
    }, {})
  }
}

export const staffApi = {
  getAnalytics: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: getMockAnalytics() }
    }
    return api.get('/staff/analytics')
  },

  getActivityAttendance: async (activityId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: getMockAttendance(activityId) }
    }
    return api.get(`/staff/attendance/${activityId}`)
  },

  exportAttendanceCSV: async (activityId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const { participants, volunteers } = getMockAttendance(activityId)
      // Build CSV
      const rows = [['Name', 'Email', 'Phone', 'Role']]
      participants.forEach(p => rows.push([p.name, p.email || '', p.phone || '', 'Participant']))
      volunteers.forEach(v => rows.push([v.name, v.email || '', v.phone || '', 'Volunteer']))
      const csv = rows.map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      return { data: blob }
    }
    return api.get(`/staff/attendance/${activityId}/export`, {
      responseType: 'blob'
    })
  },

  getWeeklyReport: async (startDate, endDate) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: { start_date: startDate, end_date: endDate, activities: mockActivities.length, note: 'Mock report' } }
    }
    return api.get('/staff/reports/weekly', {
      params: { start_date: startDate, end_date: endDate }
    })
  }
}
