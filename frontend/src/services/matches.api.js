import api, { createCrudApi } from './api'

export const matchesApi = {
  ...createCrudApi('matches'),
  
  // Get available activities for swiping
  getAvailable: () =>
    api.get('/matches/available'),
  
  // Cancel volunteer match
  cancel: (matchId) =>
    api.delete(`/matches/${matchId}`)
}
