import api, { createCrudApi } from './api'
import { USE_MOCK_DATA } from '../utils/env'
import {
  getAvailableActivitiesMock,
  createVolunteerMatch,
  cancelVolunteerMatch,
  getVolunteerMatches
} from '../mocks/volunteerMatches.mock'

export const matchesApi = {
  // Get available activities for swiping
  getAvailable: async () => {
    if (USE_MOCK_DATA) {
      const activities = getAvailableActivitiesMock()
      return { data: activities }
    }
    return api.get('/matches/available')
  },

  // Create a new match (volunteer signs up)
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const match = createVolunteerMatch(data)
      return { data: match }
    }
    return api.post('/matches', data)
  },

  // Get volunteer's current matches
  getAll: async () => {
    if (USE_MOCK_DATA) {
      const matches = getVolunteerMatches()
      return { data: matches }
    }
    return api.get('/matches')
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
    if (USE_MOCK_DATA) {
      cancelVolunteerMatch(matchId)
      return { data: { success: true } }
    }
    return api.delete(`/matches/${matchId}`)
  }
}
