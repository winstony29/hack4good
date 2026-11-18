import axios from 'axios'
import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Helper: getSession with timeout to prevent hanging
const getSessionWithTimeout = (timeoutMs = 3000) => {
  return Promise.race([
    supabase.auth.getSession(),
    new Promise((resolve) => setTimeout(() => resolve({ data: { session: null } }), timeoutMs))
  ])
}

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await getSessionWithTimeout()
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch {
      // If session fetch fails, proceed without auth
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Check if we actually have a session — only sign out if the session
      // truly expired, not if the interceptor timed out waiting for it
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          // No session at all — redirect to login
          window.location.href = '/auth'
        }
        // If session exists, the request just failed (e.g. timing issue)
        // Don't sign out — let the caller handle the error
      } catch {
        // getSession failed — don't destroy anything
      }
    }
    
    return Promise.reject(error)
  }
)

// CRUD API factory
export const createCrudApi = (resource) => ({
  getAll: (params) => api.get(`/${resource}`, { params }),
  getById: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
  getByUser: (userId) => api.get(`/${resource}/user/${userId}`)
})

export default api
