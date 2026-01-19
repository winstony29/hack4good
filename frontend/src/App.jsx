import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

import { AuthProvider } from './contexts/AuthContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PageTransition from './components/layout/PageTransition'
import { TOAST_COLORS } from './constants'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import Swiper from './pages/Swiper'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/activities" element={<PageTransition><Activities /></PageTransition>} />
        <Route path="/swiper" element={<PageTransition><Swiper /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityProvider>
          <AnimatedRoutes />
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
                  primary: TOAST_COLORS.success.icon,
                  secondary: '#fff',
                },
              },
              // Error toast styling
              error: {
                iconTheme: {
                  primary: TOAST_COLORS.error.icon,
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
