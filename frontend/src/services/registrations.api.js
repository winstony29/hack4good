import api from './api'
import { getRegistrations, createRegistration, cancelRegistration, getAllRegistrations } from '../mocks/registrations.mock'
import { mockActivities } from '../mocks/activities.mock'
import { USE_MOCK_DATA } from '../utils/env'

export const registrationsApi = {
  // Get available activities for participant swiping (excludes already registered, filters by wheelchair if needed)
  getAvailable: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const today = new Date().toISOString().split('T')[0]
      // Get user's existing registrations
      const userRegs = getRegistrations()
      const registeredActivityIds = userRegs.map(r => r.activity_id)
      // Return future activities not yet registered for
      const available = mockActivities.filter(a =>
        a.date >= today &&
        !registeredActivityIds.includes(a.id) &&
        a.current_participants < a.max_capacity
      )
      return { data: available }
    }
    
    const response = await api.get('/registrations/available')
    return { data: response.data }
  },

  // Get all registrations for current user
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      // For staff, return all registrations with user details
      const registrations = getAllRegistrations()
      return { data: registrations }
    }
    
    const response = await api.get('/registrations')
    return { data: response.data }
  },
  
  // Get registrations for specific user (for staff viewing other users)
  getByUser: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const registrations = getRegistrations(userId)
      return { data: registrations }
    }
    
    const response = await api.get(`/registrations/user/${userId}`)
    return { data: response.data }
  },
  
  // Create a new registration
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const registration = createRegistration(data)
      return { data: registration }
    }
    
    const response = await api.post('/registrations', data)
    return { data: response.data }
  },

  // Cancel registration
  cancel: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      cancelRegistration(id)
      return { data: { success: true } }
    }
    
    const response = await api.delete(`/registrations/${id}`)
    return { data: response.data }
  },
  
  // Get registrations for specific activity
  getByActivity: async (activityId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const registrations = getRegistrations()
      // Filter by activity_id
      const filtered = registrations.filter(reg => reg.activity_id === activityId)
      return { data: filtered }
    }
    
    const response = await api.get(`/registrations/activity/${activityId}`)
    return { data: response.data }
  }
}
