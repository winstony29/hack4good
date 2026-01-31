import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabase'
import { getCurrentMockUser } from '../mocks/userSwitcher.mock'
import { mockUser, mockStaffUser, mockVolunteerUser } from '../mocks/users.mock'

// Toggle to use mock data (set to false when Supabase is configured)
export const USE_MOCK_DATA = true;

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Use mock user for testing
      const mockUser = getCurrentMockUser()
      setUser(mockUser)
      setLoading(false)
      console.log(`🎭 Mock user loaded: ${mockUser.user_metadata.full_name} (${mockUser.user_metadata.role})`)
    } else {
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signup = async (email, password, userData) => {
    if (USE_MOCK_DATA) {
      // Mock signup
      const mockUser = getCurrentMockUser()
      console.log('Mock signup:', email, userData)
      return { user: mockUser }
    }

    // Call backend API to create user in both Supabase Auth and PostgreSQL
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        ...userData
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Signup failed')
    }

    const data = await response.json()

    // Set the session in Supabase client using the access token
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.access_token // Using same token as refresh for now
    })

    return data
  }

  const login = async (email, password) => {
    if (USE_MOCK_DATA) {
      // Mock login
      const mockUser = getCurrentMockUser()
      console.log('Mock login:', email)
      setUser(mockUser)
      return { user: mockUser }
    }

    // Call backend API for authentication
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()

    // Set the session in Supabase client using the access token
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.access_token // Using same token as refresh for now
    })

    return data
  }

  const logout = async () => {
    if (USE_MOCK_DATA) {
      // Mock logout
      console.log('Mock logout')
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const updateUser = async (userData) => {
    if (USE_MOCK_DATA) {
      // Mock update - update local state
      const updatedUser = {
        ...user,
        user_metadata: { ...user.user_metadata, ...userData }
      }
      setUser(updatedUser)
      console.log('Mock profile update:', userData)
      return { user: updatedUser }
    }

    const { data, error } = await supabase.auth.updateUser({
      data: userData
    })

    if (error) throw error
    setUser(data.user)
    return data
  }

  const switchRole = (role) => {
    if (!USE_MOCK_DATA) {
      console.warn('switchRole is only available in mock data mode')
      return
    }

    const roleMap = {
      participant: mockUser,
      volunteer: mockVolunteerUser,
      staff: mockStaffUser
    }

    const targetUser = roleMap[role]
    if (!targetUser) {
      console.warn(`Unknown role: ${role}. Available roles: participant, volunteer, staff`)
      return
    }

    setUser(targetUser)
    console.log(`🎭 Switched to ${role}: ${targetUser.user_metadata.full_name}`)
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser,
    switchRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
