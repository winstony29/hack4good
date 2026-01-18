import { X, Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import { formatDate, formatTime } from '../../utils/dateUtils'
import { validateRegistration, formatValidationMessage } from '../../utils/activityUtils'
import TTSButton from '../accessibility/TTSButton'

/**
 * Day Activities Modal
 * Shows all activities for a selected day with user's existing bookings
 * Highlights conflicts and allows registration
 * 
 * @param {String} date - ISO date string for the selected day
 * @param {Array} dayActivities - All activities available on this day
 * @param {Array} userRegistrations - User's existing registrations
 * @param {Object} user - Current user object
 * @param {Boolean} isOpen - Modal open state
 * @param {Function} onClose - Close callback
 * @param {Function} onRegister - Registration callback (activityId)
 */
export default function DayActivitiesModal({
  date,
  dayActivities = [],
  userRegistrations = [],
  user,
  isOpen,
  onClose,
  onRegister
}) {
  if (!date) return null

  const dateObj = new Date(date)
  const formattedDate = formatDate(dateObj)
  
  // Get user's bookings for this day
  const dayBookings = userRegistrations.filter(reg => 
    reg.status === 'confirmed' && 
    reg.activity?.date === date
  )

  // Validate each activity for registration
  const activitiesWithValidation = dayActivities.map(activity => {
    const validationResult = validateRegistration(
      activity,
      user,
      userRegistrations
    )
    
    // Convert validation result to a format with type/reason
    let validation = {
      type: 'success',
      reason: null,
      message: null,
      errors: validationResult.errors,
      warnings: validationResult.warnings
    }
    
    if (validationResult.errors.length > 0) {
      validation.type = 'error'
      validation.message = validationResult.errors.join('. ')
      
      // Determine reason from error message
      if (validationResult.errors[0].includes('already registered')) {
        validation.reason = 'alreadyRegistered'
      } else if (validationResult.errors[0].includes('full')) {
        validation.reason = 'full'
      } else if (validationResult.errors[0].includes('conflict')) {
        validation.reason = 'conflict'
      } else if (validationResult.errors[0].includes('past')) {
        validation.reason = 'past'
      }
    } else if (validationResult.warnings.length > 0) {
      validation.type = 'warning'
      validation.reason = 'membershipLimit'
      validation.message = validationResult.warnings.join('. ')
    }
    
    return { ...activity, validation }
  })

  // Separate into categories
  const alreadyBooked = activitiesWithValidation.filter(a => 
    a.validation.type === 'error' && a.validation.reason === 'alreadyRegistered'
  )
  const conflicting = activitiesWithValidation.filter(a => 
    a.validation.type === 'error' && 
    a.validation.reason !== 'alreadyRegistered' &&
    a.validation.reason !== 'membershipLimit'
  )
  const available = activitiesWithValidation.filter(a => 
    a.validation.type === 'success' || a.validation.type === 'warning'
  )

  const getValidationStyle = (validation) => {
    if (validation.type === 'success') return 'border-green-200 bg-green-50'
    if (validation.type === 'warning') return 'border-yellow-200 bg-yellow-50'
    return 'border-red-200 bg-red-50'
  }

  const ActivityItem = ({ activity, isBooked = false }) => {
    // For booked activities, create a simple validation object
    const validation = activity.validation || {
      type: 'success',
      reason: null,
      message: 'Already registered',
      errors: [],
      warnings: []
    }
    
    const canRegister = validation.type === 'success' || validation.type === 'warning'

    return (
      <div className={`p-4 rounded-lg border-2 ${getValidationStyle(validation)}`}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-lg">{activity.title}</h4>
              {isBooked && <Badge variant="success">Registered</Badge>}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {activity.description}
            </p>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(activity.start_time)} - {formatTime(activity.end_time)}</span>
              </div>
              {activity.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{activity.current_participants}/{activity.max_capacity} participants</span>
              </div>
            </div>

            {validation.message && (
              <div className={`
                mt-3 p-2 rounded text-sm flex items-start gap-2
                ${validation.type === 'success' ? 'bg-green-100 text-green-800' : ''}
                ${validation.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${validation.type === 'error' ? 'bg-red-100 text-red-800' : ''}
              `}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formatValidationMessage(validation)}</span>
              </div>
            )}
          </div>

          <div className="flex sm:flex-col gap-2">
            <TTSButton text={`${activity.title}. ${activity.description}. ${formatTime(activity.start_time)} to ${formatTime(activity.end_time)}`} />
            {canRegister && !isBooked && (
              <Button
                variant={validation.type === 'warning' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => onRegister(activity.id)}
              >
                Register
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold">{formattedDate}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* User's bookings for this day */}
        {dayBookings.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Badge variant="info">{dayBookings.length}</Badge>
              Your Bookings Today
            </h3>
            <div className="space-y-3">
              {dayBookings.map(reg => (
                <ActivityItem key={reg.id} activity={reg.activity} isBooked={true} />
              ))}
            </div>
          </div>
        )}

        {/* Available activities */}
        {available.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Available Activities ({available.length})
            </h3>
            <div className="space-y-3">
              {available.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* Conflicting activities */}
        {conflicting.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-700">
              Time Conflicts ({conflicting.length})
            </h3>
            <div className="space-y-3">
              {conflicting.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* Already booked (duplicates) */}
        {alreadyBooked.length > 0 && dayBookings.length === 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-600">
              Already Registered ({alreadyBooked.length})
            </h3>
            <div className="space-y-3">
              {alreadyBooked.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {dayActivities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No activities scheduled for this day</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
