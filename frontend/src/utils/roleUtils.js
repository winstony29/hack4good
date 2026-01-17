import { ROLES } from './constants'

export const getRoleLabel = (role) => {
  const labels = {
    [ROLES.PARTICIPANT]: 'Participant',
    [ROLES.VOLUNTEER]: 'Volunteer',
    [ROLES.STAFF]: 'Staff'
  }
  return labels[role] || role
}

export const getRoleColor = (role) => {
  const colors = {
    [ROLES.PARTICIPANT]: 'bg-blue-100 text-blue-800',
    [ROLES.VOLUNTEER]: 'bg-green-100 text-green-800',
    [ROLES.STAFF]: 'bg-purple-100 text-purple-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

export const canAccessStaffFeatures = (user) => {
  return user?.role === ROLES.STAFF
}

export const canVolunteer = (user) => {
  return user?.role === ROLES.VOLUNTEER
}

export const canRegisterForActivities = (user) => {
  return user?.role === ROLES.PARTICIPANT
}

export const getNavLinksForRole = (role) => {
  const commonLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/activities', label: 'Activities' },
    { path: '/profile', label: 'Profile' }
  ]
  
  if (role === ROLES.STAFF) {
    return [
      ...commonLinks,
      { path: '/staff/analytics', label: 'Analytics' },
      { path: '/staff/reports', label: 'Reports' }
    ]
  }
  
  return commonLinks
}
