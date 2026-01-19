import { useState, useMemo } from 'react'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Accessibility, Phone } from 'lucide-react'
import Card, { CardBody } from '../shared/Card'
import Badge from '../shared/Badge'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import { formatTime, getWeekDates, formatDate, isSameDay } from '../../utils/dateUtils'

export default function WeeklyTimetable({ activities = [], registrations = [] }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()))
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get dates for the current week (Mon-Sun)
  const weekDates = useMemo(() => {
    return getWeekDates(currentWeekStart)
  }, [currentWeekStart])

  // Group activities by day
  const activitiesByDay = useMemo(() => {
    const grouped = weekDates.map(date => ({
      date,
      activities: []
    }))

    activities.forEach(activity => {
      const activityDate = new Date(activity.date)
      const dayIndex = weekDates.findIndex(date => isSameDay(date, activityDate))
      
      if (dayIndex !== -1) {
        // Get registrations for this activity
        const activityRegistrations = registrations.filter(
          reg => reg.activity_id === activity.id && reg.status === 'confirmed'
        )
        
        grouped[dayIndex].activities.push({
          ...activity,
          registrations: activityRegistrations
        })
      }
    })

    // Sort activities within each day by start time
    grouped.forEach(day => {
      day.activities.sort((a, b) => a.start_time.localeCompare(b.start_time))
    })

    return grouped
  }, [activities, registrations, weekDates])

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()))
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const isCurrentWeek = useMemo(() => {
    const today = new Date()
    const todayWeekStart = getStartOfWeek(today)
    return currentWeekStart.getTime() === todayWeekStart.getTime()
  }, [currentWeekStart])

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Weekly Schedule</h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {!isCurrentWeek && (
            <Button variant="primary" size="sm" onClick={goToCurrentWeek}>
              Today
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {activitiesByDay.map((day, index) => (
          <DayColumn
            key={index}
            date={day.date}
            activities={day.activities}
            isToday={isSameDay(day.date, new Date())}
            onActivityClick={handleActivityClick}
          />
        ))}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedActivity(null)
          }}
        />
      )}
    </div>
  )
}

function DayColumn({ date, activities, isToday, onActivityClick }) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dayNumber = date.getDate()
  const monthName = date.toLocaleDateString('en-US', { month: 'short' })

  return (
    <div className={`flex flex-col min-h-[200px] ${isToday ? 'lg:col-span-1' : ''}`}>
      {/* Day Header */}
      <div className={`p-3 text-center rounded-t-lg border-b-2 ${
        isToday 
          ? 'bg-primary-500 text-white border-primary-600' 
          : 'bg-gray-100 text-gray-900 border-gray-200'
      }`}>
        <div className="text-sm font-semibold">{dayName}</div>
        <div className="text-2xl font-bold">{dayNumber}</div>
        <div className="text-xs">{monthName}</div>
      </div>

      {/* Activities */}
      <div className="flex-1 p-2 space-y-2 bg-gray-50 rounded-b-lg">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No activities
          </div>
        ) : (
          activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => onActivityClick(activity)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ActivityCard({ activity, onClick }) {
  const attendeeCount = activity.registrations?.length || 0
  const hasWheelchairUsers = activity.registrations?.some(
    reg => reg.user?.wheelchair_required
  ) || false

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary-500"
      onClick={onClick}
    >
      <CardBody className="p-3">
        <div className="space-y-2">
          {/* Activity Title */}
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {activity.title}
          </h4>

          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{formatTime(activity.start_time)} - {formatTime(activity.end_time)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{activity.location}</span>
          </div>

          {/* Attendees */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1 text-xs">
              <Users className="w-3 h-3 text-primary-600" />
              <span className="font-semibold text-primary-600">{attendeeCount}</span>
              <span className="text-gray-500">attendees</span>
            </div>
            {hasWheelchairUsers && (
              <Accessibility className="w-4 h-4 text-blue-600" />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function ActivityDetailModal({ activity, isOpen, onClose }) {
  const attendees = activity.registrations || []
  const wheelchairCount = attendees.filter(reg => reg.user?.wheelchair_required).length

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity.title}
      size="large"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Activity Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Date</span>
            </div>
            <p className="text-gray-900">{formatDate(activity.date)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <p className="text-gray-900">
              {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <p className="text-gray-900">{activity.location}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Capacity</span>
            </div>
            <p className="text-gray-900">
              {attendees.length} / {activity.max_capacity}
            </p>
          </div>
        </div>

        {/* Description */}
        {activity.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 text-sm">{activity.description}</p>
          </div>
        )}

        {/* Point of Contact */}
        {activity.point_of_contact && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Point of Contact</h4>
            <div className="space-y-2">
              {activity.point_of_contact.full_name && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <span className="text-sm text-gray-900">{activity.point_of_contact.full_name}</span>
                </div>
              )}
              {activity.point_of_contact.email && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="text-sm text-gray-900">{activity.point_of_contact.email}</span>
                </div>
              )}
              {activity.point_of_contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-900">{activity.point_of_contact.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendee List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Attendees ({attendees.length})
            </h4>
            {wheelchairCount > 0 && (
              <Badge variant="info" className="flex items-center gap-1">
                <Accessibility className="w-3 h-3" />
                <span>{wheelchairCount} wheelchair user{wheelchairCount > 1 ? 's' : ''}</span>
              </Badge>
            )}
          </div>

          {attendees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No participants registered yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                      Wheelchair Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((registration, index) => (
                    <tr 
                      key={registration.id} 
                      className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.user?.full_name || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {registration.user?.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span>{registration.user.phone}</span>
                            </div>
                          )}
                          {registration.user?.caregiver_phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span>Caregiver: {registration.user.caregiver_phone}</span>
                            </div>
                          )}
                          {!registration.user?.phone && !registration.user?.caregiver_phone && (
                            <span className="text-xs text-gray-400">No contact info</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {registration.user?.wheelchair_required ? (
                          <Badge variant="info" className="inline-flex items-center gap-1">
                            <Accessibility className="w-3 h-3" />
                            <span>Yes</span>
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

// Helper function to get the start of the week (Monday)
function getStartOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}
