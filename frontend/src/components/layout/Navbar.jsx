import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings, Accessibility } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useTranslation } from '../../hooks/useTranslation'
import toast from 'react-hot-toast'
import Button from '../shared/Button'
import AccessibilityMenu from '../accessibility/AccessibilityMenu'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { language } = useAccessibility()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success(t('nav.logout'))
      navigate('/auth')
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with gradient text */}
          <Link to="/" className="flex items-center gap-3">
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MINDS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Accessibility Button - always visible */}
            <button
              onClick={() => setAccessibilityMenuOpen(true)}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t('nav.accessibility')}
            >
              <Accessibility size={20} />
            </button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/activities"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.activities')}
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.profile')}
                </Link>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/activities"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('landing.browseActivities')}
                </Link>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigate('/auth')}
                >
                  {t('nav.login')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile: Accessibility + Menu buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setAccessibilityMenuOpen(true)}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t('nav.accessibility')}
            >
              <Accessibility size={20} />
            </button>
            <button
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block w-full py-3 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/activities"
                    className="block w-full py-3 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.activities')}
                  </Link>
                  <Link
                    to="/profile"
                    className="block w-full py-3 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/activities"
                    className="block w-full py-3 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('landing.browseActivities')}
                  </Link>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      navigate('/auth')
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Menu Modal */}
      <AccessibilityMenu
        isOpen={accessibilityMenuOpen}
        onClose={() => setAccessibilityMenuOpen(false)}
      />
    </nav>
  )
}
