import { createCrudApi } from './api'

// Use real backend API - activities are seeded in Supabase
const activitiesCrudApi = createCrudApi('activities')

export const activitiesApi = {
  // Get all activities - backend returns { activities: [...], total: n }
  getAll: async (params = {}) => {
    const response = await activitiesCrudApi.getAll(params)
    // Normalize response: backend returns { activities: [], total: n }
    // but components expect { data: [] }
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
