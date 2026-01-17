import { createCrudApi } from './api'

export const activitiesApi = {
  ...createCrudApi('activities'),
  
  // Additional activity-specific methods
  getUpcoming: (params) => 
    createCrudApi('activities').getAll({ ...params, upcoming: true }),
  
  getByDate: (date) =>
    createCrudApi('activities').getAll({ date_filter: date })
}
