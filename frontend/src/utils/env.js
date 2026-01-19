/**
 * Environment utilities
 * Centralized environment variable access
 */

// Mock data toggle - set VITE_USE_MOCK_DATA=true in .env for development
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// API base URL (for future use)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
