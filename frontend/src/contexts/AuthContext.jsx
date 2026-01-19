import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabase'
import { getCurrentMockUser } from '../mocks/userSwitcher.mock'

// Toggle to use mock data (set to false when Supabase is configured)
const USE_MOCK_DATA = true

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
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
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

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
