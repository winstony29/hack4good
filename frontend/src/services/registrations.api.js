import api, { createCrudApi } from './api'

export const registrationsApi = {
  ...createCrudApi('registrations'),
  
  // Get registrations for specific activity
  getByActivity: (activityId) =>
    api.get(`/registrations/activity/${activityId}`),
  
  // Cancel registration
  cancel: (registrationId) =>
    api.delete(`/registrations/${registrationId}`)
}
