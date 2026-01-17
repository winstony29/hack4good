import api from './api'

export const notificationsApi = {
  send: (data) => api.post('/notifications/send', data),
  sendBulk: (data) => api.post('/notifications/send-bulk', data),
  getByUser: (userId) => api.get(`/notifications/user/${userId}`)
}
