import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import Card, { CardBody } from '../shared/Card'
import Badge from '../shared/Badge'
import TTSButton from '../accessibility/TTSButton'
import { formatDate, formatTime } from '../../utils/dateUtils'
import { getActivityTitle, getActivityDescription } from '../../utils/activityTranslations'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export default function ActivityCard({ activity, showCapacity = true, showTTS = false, onClick }) {
  const { language } = useAccessibility()
  const availableSpots = activity.max_capacity - activity.current_participants
  const isFull = availableSpots <= 0
  
  // Get translated content
  const title = getActivityTitle(activity, language)
  const description = getActivityDescription(activity, language)

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardBody>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h3>
          {activity.program_type && (
            <Badge variant="info">{activity.program_type}</Badge>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-1.5 sm:space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(activity.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{activity.location}</span>
          </div>
        </div>

        {showCapacity && (
          <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span className="text-gray-600">
                  {activity.current_participants} / {activity.max_capacity}
                </span>
              </div>
              <Badge variant={isFull ? 'danger' : availableSpots <= 5 ? 'warning' : 'success'}>
                {isFull ? 'Full' : `${availableSpots} spots left`}
              </Badge>
            </div>
          </div>
        )}

        {showTTS && (
          <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-200">
            <TTSButton text={`${title}. ${description}`} />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
