import { createCrudApi } from './api'
import { mockActivities, getActivityById } from '../mocks/activities.mock'
import { USE_MOCK_DATA } from '../utils/env'

const activitiesCrudApi = createCrudApi('activities')

export const activitiesApi = {
  // Get all activities
  getAll: async (params = {}) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter mock activities based on params
      let filtered = [...mockActivities]
      if (params.program_type) {
        filtered = filtered.filter(a => a.program_type === params.program_type)
      }
      if (params.date_filter) {
        filtered = filtered.filter(a => a.date === params.date_filter)
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower)
        )
      }
      
      return { data: filtered }
    }
    
    const response = await activitiesCrudApi.getAll(params)
    return { data: response.data.activities || response.data }
  },
  
  // Get single activity by ID
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const activity = getActivityById(id)
      return { data: activity }
    }
    
    const response = await activitiesCrudApi.getById(id)
    return { data: response.data }
  },
  
  // Create activity (staff only)
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newActivity = {
        id: `activity-${Date.now()}`,
        ...data,
        current_participants: 0,
        created_at: new Date().toISOString()
      }
      mockActivities.push(newActivity)
      return { data: newActivity }
    }
    return activitiesCrudApi.create(data)
  },
  
  // Update activity (staff only)
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = mockActivities.findIndex(a => a.id === id)
      if (index !== -1) {
        mockActivities[index] = { ...mockActivities[index], ...data }
        return { data: mockActivities[index] }
      }
      throw new Error('Activity not found')
    }
    return activitiesCrudApi.update(id, data)
  },
  
  // Delete activity (staff only)
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = mockActivities.findIndex(a => a.id === id)
      if (index !== -1) {
        mockActivities.splice(index, 1)
      }
      return { data: { success: true } }
    }
    return activitiesCrudApi.delete(id)
  },
  
  // Additional activity-specific methods
  getUpcoming: async (params) => {
    if (USE_MOCK_DATA) {
      const today = new Date().toISOString().split('T')[0]
      await new Promise(resolve => setTimeout(resolve, 500))
      const upcoming = mockActivities.filter(a => a.date >= today)
      return { data: upcoming }
    }
    return activitiesCrudApi.getAll({ ...params, upcoming: true })
  },
  
  getByDate: async (date) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const filtered = mockActivities.filter(a => a.date === date)
      return { data: filtered }
    }
    return activitiesCrudApi.getAll({ date_filter: date })
  }
}
