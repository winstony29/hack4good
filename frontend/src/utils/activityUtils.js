/**
 * Activity conflict detection and validation utilities
 * For MINDS ActivityHub - Activities Lead
 */

/**
 * Check if two time ranges overlap
 * @param {string} date1 - First activity date (YYYY-MM-DD)
 * @param {string} start1 - First activity start time (HH:MM:SS)
 * @param {string} end1 - First activity end time (HH:MM:SS)
 * @param {string} date2 - Second activity date (YYYY-MM-DD)
 * @param {string} start2 - Second activity start time (HH:MM:SS)
 * @param {string} end2 - Second activity end time (HH:MM:SS)
 * @returns {boolean} - True if activities overlap
 */
export const checkTimeOverlap = (date1, start1, end1, date2, start2, end2) => {
  // If dates are different, no overlap
  if (date1 !== date2) return false

  // Convert times to comparable format
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  const start1Mins = parseTime(start1)
  const end1Mins = parseTime(end1)
  const start2Mins = parseTime(start2)
  const end2Mins = parseTime(end2)

  // Check if time ranges overlap
  return (
    (start1Mins < end2Mins && end1Mins > start2Mins) ||
    (start2Mins < end1Mins && end2Mins > start1Mins)
  )
}

/**
 * Find conflicts with registered activities
 * @param {object} newActivity - Activity to check
 * @param {array} registeredActivities - User's registered activities
 * @returns {array} - Array of conflicting activities
 */
export const findActivityConflicts = (newActivity, registeredActivities) => {
  if (!newActivity || !registeredActivities) return []

  return registeredActivities.filter(registered => {
    // Don't compare with itself
    if (registered.id === newActivity.id) return false

    // Only check confirmed registrations
    if (registered.status === 'cancelled') return false

    return checkTimeOverlap(
      newActivity.date,
      newActivity.start_time,
      newActivity.end_time,
      registered.date,
      registered.start_time,
      registered.end_time
    )
  })
}

/**
 * Membership type weekly activity limits
 */
const MEMBERSHIP_LIMITS = {
  ad_hoc: null, // No weekly limit
  once_weekly: 1,
  twice_weekly: 2,
  '3_plus': 3
}

/**
 * Get weekly activity count for a user
 * @param {string} targetDate - Date to check week for
 * @param {array} registeredActivities - User's registered activities
 * @returns {number} - Count of activities in the same week
 */
export const getWeeklyActivityCount = (targetDate, registeredActivities) => {
  const getWeekNumber = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  const targetWeek = getWeekNumber(targetDate)
  const targetYear = new Date(targetDate).getFullYear()

  return registeredActivities.filter(activity => {
    if (activity.status === 'cancelled') return false
    const activityYear = new Date(activity.date).getFullYear()
    const activityWeek = getWeekNumber(activity.date)
    return activityYear === targetYear && activityWeek === targetWeek
  }).length
}

/**
 * Check if user has reached weekly limit for their membership
 * @param {string} membershipType - User's membership type
 * @param {string} activityDate - Date of activity to register for
 * @param {array} registeredActivities - User's registered activities
 * @returns {object} - { allowed: boolean, limit: number, current: number }
 */
export const checkMembershipLimit = (membershipType, activityDate, registeredActivities) => {
  const limit = MEMBERSHIP_LIMITS[membershipType]
  
  // Ad-hoc has no limit
  if (limit === null) {
    return { allowed: true, limit: null, current: 0 }
  }

  const currentCount = getWeeklyActivityCount(activityDate, registeredActivities)
  
  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount
  }
}

/**
 * Validate if user can register for an activity
 * @param {object} activity - Activity to register for
 * @param {object} user - User object with membership_type
 * @param {array} registeredActivities - User's registered activities
 * @returns {object} - { valid: boolean, errors: array, warnings: array }
 */
export const validateRegistration = (activity, user, registeredActivities) => {
  const errors = []
  const warnings = []

  // Check if already registered for this activity
  const alreadyRegistered = registeredActivities.some(
    reg => reg.activity_id === activity.id && reg.status === 'confirmed'
  )
  if (alreadyRegistered) {
    errors.push('You are already registered for this activity')
  }

  // Check if activity is full
  if (activity.current_participants >= activity.max_capacity) {
    errors.push('This activity is full')
  }

  // Check for time conflicts (but not with itself)
  const conflicts = findActivityConflicts(activity, registeredActivities)
  if (conflicts.length > 0) {
    errors.push(
      `Time conflict with: ${conflicts.map(c => c.title).join(', ')}`
    )
  }

  // Check membership limits
  if (user.membership_type) {
    const limitCheck = checkMembershipLimit(
      user.membership_type,
      activity.date,
      registeredActivities
    )

    if (!limitCheck.allowed) {
      warnings.push(
        `You have reached your weekly limit (${limitCheck.current}/${limitCheck.limit} activities this week)`
      )
    }
  }

  // Check if activity is in the past
  const activityDate = new Date(activity.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (activityDate < today) {
    errors.push('Cannot register for past activities')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Format validation result for display
 * @param {object} validationResult - Result from validateRegistration
 * @returns {string} - Formatted message
 */
export const formatValidationMessage = (validationResult) => {
  const { valid, errors, warnings } = validationResult
  
  let message = ''
  
  if (errors.length > 0) {
    message += '❌ Cannot register:\n' + errors.map(e => `• ${e}`).join('\n')
  }
  
  if (warnings.length > 0) {
    if (message) message += '\n\n'
    message += '⚠️ Warning:\n' + warnings.map(w => `• ${w}`).join('\n')
  }
  
  return message
}

/**
 * Get available spots for an activity
 * @param {object} activity - Activity object
 * @returns {number} - Number of available spots
 */
export const getAvailableSpots = (activity) => {
  return Math.max(0, activity.max_capacity - activity.current_participants)
}

/**
 * Check if activity is full
 * @param {object} activity - Activity object
 * @returns {boolean} - True if activity is full
 */
export const isActivityFull = (activity) => {
  return getAvailableSpots(activity) === 0
}

/**
 * Get membership type display name
 * @param {string} membershipType - Membership type code
 * @returns {string} - Display name
 */
export const getMembershipDisplayName = (membershipType) => {
  const names = {
    ad_hoc: 'Ad-Hoc (No weekly limit)',
    once_weekly: 'Once Weekly (1 activity/week)',
    twice_weekly: 'Twice Weekly (2 activities/week)',
    '3_plus': '3+ Weekly (3+ activities/week)'
  }
  return names[membershipType] || membershipType
}
