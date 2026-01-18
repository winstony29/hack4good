import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import Button from '../shared/Button'
import { formatTime } from '../../utils/dateUtils'

// Activity type colors - high contrast for accessibility
const ACTIVITY_COLORS = {
  sports: 'bg-blue-100 border-blue-400 text-blue-900',
  arts: 'bg-purple-100 border-purple-400 text-purple-900',
  music: 'bg-pink-100 border-pink-400 text-pink-900',
  wellness: 'bg-green-100 border-green-400 text-green-900',
  social: 'bg-yellow-100 border-yellow-400 text-yellow-900',
  educational: 'bg-orange-100 border-orange-400 text-orange-900',
  default: 'bg-gray-100 border-gray-400 text-gray-900'
}

// Activity type icons/labels for visual identification
const ACTIVITY_LABELS = {
  sports: '⚽',
  arts: '🎨',
  music: '🎵',
  wellness: '🧘',
  social: '👥',
  educational: '📚',
  default: '📅'
}

/**
 * Visual Month Calendar Component
 * Shows activities in a traditional calendar grid with color coding
 * 
 * @param {Array} activities - Array of activity objects with date field
 * @param {Function} onActivityClick - Callback when activity is clicked
 * @param {String} userRole - 'participant' or 'volunteer' (for labeling)
 */
export default function ActivityMonthCalendar({ 
  activities = [], 
  onActivityClick,
  userRole = 'participant'
}) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get calendar data
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Group activities by date
  const activitiesByDate = activities.reduce((acc, activity) => {
    const date = new Date(activity.date || activity.activity?.date)
    if (date.getMonth() === month && date.getFullYear() === year) {
      const day = date.getDate()
      if (!acc[day]) acc[day] = []
      acc[day].push(activity)
    }
    return acc
  }, {})

  // Generate calendar days
  const calendarDays = []
  
  // Previous month days (grayed out)
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    })
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      activities: activitiesByDate[day] || []
    })
  }
  
  // Next month days (grayed out)
  const remainingDays = 42 - calendarDays.length // 6 weeks x 7 days
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day)
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="secondary" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Activity Types:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ACTIVITY_LABELS).map(([type, emoji]) => (
            type !== 'default' && (
              <div
                key={type}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${ACTIVITY_COLORS[type]} text-sm font-medium`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="capitalize">{type}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="p-2 text-center font-semibold text-gray-700 text-sm sm:text-base"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayData, index) => {
            const { day, isCurrentMonth, date, activities = [] } = dayData
            const isTodayDate = isToday(date)

            return (
              <div
                key={index}
                className={`
                  min-h-[100px] sm:min-h-[120px] p-2 border-b border-r border-gray-200
                  ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                  ${isTodayDate ? 'ring-2 ring-inset ring-blue-500' : ''}
                  ${index % 7 === 6 ? 'border-r-0' : ''}
                  ${index >= 35 ? 'border-b-0' : ''}
                `}
              >
                {/* Day Number */}
                <div className={`
                  text-sm sm:text-base font-semibold mb-2
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                  ${isTodayDate ? 'text-blue-600' : ''}
                `}>
                  {day}
                  {isTodayDate && (
                    <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>

                {/* Activities */}
                <div className="space-y-1">
                  {activities.slice(0, 3).map((activity, idx) => {
                    const activityData = activity.activity || activity
                    const activityType = activityData.program_type || 'default'
                    const colorClass = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.default
                    const emoji = ACTIVITY_LABELS[activityType] || ACTIVITY_LABELS.default

                    return (
                      <button
                        key={idx}
                        onClick={() => onActivityClick?.(activityData)}
                        className={`
                          w-full text-left px-2 py-1.5 rounded border-l-4 
                          ${colorClass}
                          hover:shadow-md transition-shadow text-xs sm:text-sm
                          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                        `}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-base">{emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">
                              {formatTime(activityData.start_time)}
                            </div>
                            <div className="truncate text-xs opacity-90">
                              {activityData.title}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                  
                  {/* More activities indicator */}
                  {activities.length > 3 && (
                    <div className="text-xs text-gray-600 font-medium px-2">
                      +{activities.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Summary */}
      <div className="sm:hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-900">
          <CalendarIcon className="w-5 h-5" />
          <p className="text-sm font-medium">
            {activities.length} {userRole === 'volunteer' ? 'volunteer commitments' : 'registered activities'} this month
          </p>
        </div>
      </div>
    </div>
  )
}
