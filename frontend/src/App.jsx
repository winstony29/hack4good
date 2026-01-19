import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './contexts/AuthContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import Swiper from './pages/Swiper'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/swiper" element={<Swiper />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-center"
            gutter={8}
            toastOptions={{
              // Default options for all toasts
              duration: 3000,
              style: {
                background: 'var(--a11y-card-bg, #fff)',
                color: 'var(--a11y-text, #1f2937)',
                fontSize: 'var(--a11y-font-size, 16px)',
              },
              // Success toast styling
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              // Error toast styling
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                duration: 4000,
              },
            }}
          />
        </AccessibilityProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
