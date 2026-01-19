import api from './api'

// Use real backend API for registrations
export const registrationsApi = {
  // Get all registrations for current user
  getAll: async () => {
    const response = await api.get('/registrations')
    return { data: response.data }
  },
  
  // Get registrations for specific user (for staff viewing other users)
  getByUser: async (userId) => {
    const response = await api.get(`/registrations/user/${userId}`)
    return { data: response.data }
  },
  
  // Create a new registration
  create: async (data) => {
    const response = await api.post('/registrations', data)
    return { data: response.data }
  },
  
  // Cancel a registration
  cancel: async (registrationId) => {
    await api.delete(`/registrations/${registrationId}`)
    return { message: 'Registration cancelled successfully' }
  },
  
  // Get registrations for specific activity
  getByActivity: async (activityId) => {
    const response = await api.get(`/registrations/activity/${activityId}`)
    return { data: response.data }
  }
}
