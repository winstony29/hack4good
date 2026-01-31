import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Heart, User, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { USE_MOCK_DATA } from '../../contexts/AuthContext'

const ROLES = [
  {
    key: 'staff',
    label: 'Staff',
    icon: Shield,
    path: '/dashboard',
    colorClass: 'text-minds-coral',
    bgClass: 'bg-minds-coral',
    bgLightClass: 'bg-red-50',
    ringClass: 'ring-minds-coral',
    dotColor: 'bg-minds-coral'
  },
  {
    key: 'volunteer',
    label: 'Volunteer',
    icon: Heart,
    path: '/swiper',
    colorClass: 'text-minds-teal',
    bgClass: 'bg-minds-teal',
    bgLightClass: 'bg-emerald-50',
    ringClass: 'ring-minds-teal',
    dotColor: 'bg-minds-teal'
  },
  {
    key: 'participant',
    label: 'Participant',
    icon: User,
    path: '/activities',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500',
    bgLightClass: 'bg-blue-50',
    ringClass: 'ring-blue-500',
    dotColor: 'bg-blue-500'
  }
]

export default function DemoRoleSwitcher() {
  const [isExpanded, setIsExpanded] = useState(false)
  const panelRef = useRef(null)
  const { user, switchRole } = useAuth()
  const navigate = useNavigate()

  // Don't render if not in mock data mode
  if (!USE_MOCK_DATA) return null

  const currentRole = user?.user_metadata?.role || 'participant'
  const currentRoleConfig = ROLES.find((r) => r.key === currentRole) || ROLES[2]

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const handleRoleSwitch = (role) => {
    switchRole(role.key)
    setIsExpanded(false)
    navigate(role.path)
  }

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 left-6 z-50"
      role="toolbar"
      aria-label="Demo role switcher"
    >
      {/* Collapsed state - pill showing current role */}
      {!isExpanded && (
        <button
          onClick={toggleExpanded}
          className={`
            flex items-center gap-2 px-4 py-2.5
            bg-white rounded-2xl shadow-lg
            border border-gray-200
            transition-all duration-200
            hover:shadow-xl hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentRoleConfig.ringClass}
            cursor-pointer select-none
          `}
          aria-label={`Demo role switcher. Current role: ${currentRoleConfig.label}. Click to expand.`}
          aria-expanded={isExpanded}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${currentRoleConfig.dotColor}`} />
          <span className="text-sm font-semibold text-gray-700">
            {currentRoleConfig.label}
          </span>
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase ml-0.5">
            DEMO
          </span>
        </button>
      )}

      {/* Expanded state - role selection panel */}
      {isExpanded && (
        <div
          className={`
            bg-white rounded-2xl shadow-lg
            border border-gray-200
            p-3
            transition-all duration-200
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Switch Role
            </span>
            <button
              onClick={toggleExpanded}
              className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close role switcher"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role buttons */}
          <div className="flex flex-col gap-1.5">
            {ROLES.map((role) => {
              const Icon = role.icon
              const isActive = role.key === currentRole

              return (
                <button
                  key={role.key}
                  onClick={() => handleRoleSwitch(role)}
                  className={`
                    flex items-center gap-3
                    w-full min-h-[48px] px-3 py-2.5
                    rounded-xl
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-1 ${role.ringClass}
                    ${isActive
                      ? `${role.bgLightClass} ring-2 ${role.ringClass}`
                      : 'hover:bg-gray-50'
                    }
                  `}
                  aria-label={`Switch to ${role.label} role`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`
                      w-9 h-9 min-w-[36px] min-h-[36px]
                      flex items-center justify-center
                      rounded-lg
                      ${isActive ? `${role.bgClass} text-white` : `${role.bgLightClass} ${role.colorClass}`}
                      transition-colors duration-200
                    `}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className={`text-sm font-semibold ${isActive ? role.colorClass : 'text-gray-700'}`}>
                      {role.label}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {role.path}
                    </span>
                  </div>
                  {isActive && (
                    <span className={`ml-auto w-2 h-2 rounded-full ${role.dotColor}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
