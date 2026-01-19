/**
 * Mock analytics data for Staff Dashboard charts
 *
 * Provides realistic demo data for Recharts visualizations
 */

// Weekly registration trends (last 4 weeks)
const weeklyTrendsData = [
  { week: 'Week 1', registrations: 45, volunteers: 12 },
  { week: 'Week 2', registrations: 52, volunteers: 15 },
  { week: 'Week 3', registrations: 38, volunteers: 11 },
  { week: 'Week 4', registrations: 61, volunteers: 18 },
]

// Program type distribution
const programBreakdownData = [
  { name: 'Arts & Crafts', value: 35, color: '#3B82F6' },
  { name: 'Exercise', value: 28, color: '#10B981' },
  { name: 'Social Activities', value: 22, color: '#F59E0B' },
  { name: 'Music Therapy', value: 15, color: '#8B5CF6' },
]

// Volunteer coverage by day of week
const volunteerCoverageData = [
  { day: 'Mon', covered: 85, uncovered: 15 },
  { day: 'Tue', covered: 92, uncovered: 8 },
  { day: 'Wed', covered: 78, uncovered: 22 },
  { day: 'Thu', covered: 88, uncovered: 12 },
  { day: 'Fri', covered: 95, uncovered: 5 },
  { day: 'Sat', covered: 70, uncovered: 30 },
  { day: 'Sun', covered: 65, uncovered: 35 },
]

// Dashboard summary metrics
const dashboardMetrics = {
  totalActivities: 24,
  totalRegistrations: 196,
  volunteerCoverage: 82,
  upcomingActivities: 8,
  activeVolunteers: 56,
}

/**
 * Get weekly registration trends data
 * @returns {Array} Weekly trends with registrations and volunteers
 */
export function getWeeklyTrends() {
  return weeklyTrendsData
}

/**
 * Get program type distribution data
 * @returns {Array} Program breakdown with names, values, and colors
 */
export function getProgramBreakdown() {
  return programBreakdownData
}

/**
 * Get volunteer coverage by day of week
 * @returns {Array} Coverage data with covered/uncovered percentages
 */
export function getVolunteerCoverage() {
  return volunteerCoverageData
}

/**
 * Get dashboard summary metrics
 * @returns {Object} Summary metrics for dashboard cards
 */
export function getDashboardMetrics() {
  return dashboardMetrics
}

// Also export raw data for direct access if needed
export {
  weeklyTrendsData,
  programBreakdownData,
  volunteerCoverageData,
  dashboardMetrics,
}
