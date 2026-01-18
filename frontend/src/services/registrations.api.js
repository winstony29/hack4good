import api, { createCrudApi } from './api'
import { 
  getRegistrations, 
  createRegistration, 
  cancelRegistration,
  getRegistrationsByActivity 
} from '../mocks/registrations.mock'

// Toggle to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true

// Simulate API delay for realistic testing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockRegistrationsApi = {
  getAll: async () => {
    await delay(500)
    const registrations = getRegistrations()
    return { data: registrations }
  },
  
  getById: async (id) => {
    await delay(300)
    const registrations = getRegistrations()
    const registration = registrations.find(r => r.id === id)
    if (!registration) {
      throw new Error('Registration not found')
    }
    return { data: registration }
  },
  
  create: async (data) => {
    await delay(500)
    const newReg = createRegistration(data)
    return { data: newReg }
  },
  
  cancel: async (registrationId) => {
    await delay(500)
    const success = cancelRegistration(registrationId)
    if (!success) {
      throw new Error('Registration not found')
    }
    return { message: 'Registration cancelled successfully' }
  },
  
  getByActivity: async (activityId) => {
    await delay(300)
    const registrations = getRegistrationsByActivity(activityId)
    return { data: registrations }
  }
}

export const registrationsApi = USE_MOCK_DATA ? mockRegistrationsApi : {
  ...createCrudApi('registrations'),
  
  // Get registrations for specific activity
  getByActivity: (activityId) =>
    api.get(`/registrations/activity/${activityId}`),
  
  // Cancel registration
  cancel: (registrationId) =>
    api.delete(`/registrations/${registrationId}`)
}
