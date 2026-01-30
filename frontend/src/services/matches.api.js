import api from './api'
import {
  getAvailableActivitiesMock,
  createVolunteerMatch,
  getVolunteerMatches,
  cancelVolunteerMatch
} from '../mocks/volunteerMatches.mock'

// Toggle to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true

export const matchesApi = {
  // Get available activities for swiping (excludes already matched, past activities)
  getAvailable: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const available = getAvailableActivitiesMock()
      return { data: available }
    }
    
    const response = await api.get('/matches/available')
    return { data: response.data }
  },

  // Create a new match (volunteer signs up for activity)
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const match = createVolunteerMatch({
        ...data,
        volunteer_id: data.volunteer_id || 'user-3'
      })
      return { data: match }
    }
    
    const response = await api.post('/matches', data)
    return { data: response.data }
  },

  // Get volunteer's current matches
  getAll: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const matches = getVolunteerMatches(userId || 'user-3')
      return { data: matches }
    }
    
    const response = await api.get(`/matches/user/${userId}`)
    return { data: response.data }
  },

  // Get matches for specific user (alias for dashboard)
  getByUser: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const matches = getVolunteerMatches(userId || 'user-3')
      return { data: matches }
    }
    
    const response = await api.get(`/matches/user/${userId}`)
    return { data: response.data }
  },

  // Cancel a match
  cancel: async (matchId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      cancelVolunteerMatch(matchId)
      return { data: { success: true } }
    }
    
    await api.delete(`/matches/${matchId}`)
    return { data: { success: true } }
  }
}
