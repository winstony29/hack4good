import { createCrudApi } from './api'
import { mockActivities } from '../mocks/activities.mock'

// Toggle to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true

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
      
      return { data: filtered }
    }
    
    const response = await activitiesCrudApi.getAll(params)
    return { data: response.data.activities || response.data }
  },
  
  // Get single activity by ID
  getById: async (id) => {
    const response = await activitiesCrudApi.getById(id)
    return { data: response.data }
  },
  
  // Create activity (staff only)
  create: (data) => activitiesCrudApi.create(data),
  
  // Update activity (staff only)
  update: (id, data) => activitiesCrudApi.update(id, data),
  
  // Delete activity (staff only)
  delete: (id) => activitiesCrudApi.delete(id),
  
  // Additional activity-specific methods
  getUpcoming: (params) => 
    activitiesCrudApi.getAll({ ...params, upcoming: true }),
  
  getByDate: (date) =>
    activitiesCrudApi.getAll({ date_filter: date })
}
