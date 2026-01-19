import api from './api'

// Use real backend API for volunteer matches
export const matchesApi = {
  // Get available activities for swiping (excludes already matched, past activities)
  getAvailable: async () => {
    const response = await api.get('/matches/available')
    return { data: response.data }
  },

  // Create a new match (volunteer signs up for activity)
  create: async (data) => {
    const response = await api.post('/matches', data)
    return { data: response.data }
  },

  // Get volunteer's current matches
  getAll: async (userId) => {
    const response = await api.get(`/matches/user/${userId}`)
    return { data: response.data }
  },

  // Get matches for specific user (alias for dashboard)
  getByUser: async (userId) => {
    if (USE_MOCK_DATA) {
      const matches = getVolunteerMatches()
      return { data: matches }
    }
    return api.get(`/matches/user/${userId}`)
  },

  // Cancel a match
  cancel: async (matchId) => {
    await api.delete(`/matches/${matchId}`)
    return { data: { success: true } }
  }
}
