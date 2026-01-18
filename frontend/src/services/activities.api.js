import { createCrudApi } from './api'
import { getActivities, getActivityById } from '../mocks/activities.mock'

// Toggle to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true

// Simulate API delay for realistic testing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockActivitiesApi = {
  getAll: async (params = {}) => {
    await delay(500) // Simulate network delay
    const activities = getActivities(params)
    return { data: activities }
  },
  
  getById: async (id) => {
    await delay(300)
    const activity = getActivityById(id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { data: activity }
  },
  
  create: async (data) => {
    await delay(500)
    throw new Error('Mock: Staff features not implemented in mock')
  },
  
  update: async (id, data) => {
    await delay(500)
    throw new Error('Mock: Staff features not implemented in mock')
  },
  
  delete: async (id) => {
    await delay(500)
    throw new Error('Mock: Staff features not implemented in mock')
  }
}

export const activitiesApi = USE_MOCK_DATA ? mockActivitiesApi : {
  ...createCrudApi('activities'),
  
  // Additional activity-specific methods
  getUpcoming: (params) => 
    createCrudApi('activities').getAll({ ...params, upcoming: true }),
  
  getByDate: (date) =>
    createCrudApi('activities').getAll({ date_filter: date })
}
