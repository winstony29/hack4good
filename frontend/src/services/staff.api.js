import api from './api'

export const staffApi = {
  getAnalytics: () => api.get('/staff/analytics'),
  
  getActivityAttendance: (activityId) =>
    api.get(`/staff/attendance/${activityId}`),
  
  exportAttendanceCSV: (activityId) =>
    api.get(`/staff/attendance/${activityId}/export`, {
      responseType: 'blob'
    }),
  
  getWeeklyReport: (startDate, endDate) =>
    api.get('/staff/reports/weekly', {
      params: { start_date: startDate, end_date: endDate }
    })
}
