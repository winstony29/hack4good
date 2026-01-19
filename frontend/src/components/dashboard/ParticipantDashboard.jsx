import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, AlertCircle, CalendarDays, List } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useTranslation } from '../../hooks/useTranslation'
import Card, { CardHeader, CardBody } from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import Spinner from '../shared/Spinner'
import ActivityDetailModal from '../activities/ActivityDetailModal'
import ActivityMonthCalendar from '../activities/ActivityMonthCalendar'
import { registrationsApi } from '../../services/registrations.api'
import { formatDate, formatTime, isUpcoming } from '../../utils/dateUtils'
import { getMembershipDisplayName } from '../../utils/activityUtils'
import { getActivityTitle, getActivityDescription } from '../../utils/activityTranslations'
import { useNavigate } from 'react-router-dom'

export default function ParticipantDashboard() {
  const { user } = useAuth()
  const { language } = useAccessibility()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      // Backend now returns registrations with activity details included
      const response = await registrationsApi.getAll()
      setRegistrations(response.data || [])
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRegistration = async (registrationId) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return
    }

    setCancellingId(registrationId)
    try {
      await registrationsApi.cancel(registrationId)
      await fetchRegistrations()
      toast.success('Registration cancelled successfully')
    } catch (error) {
      console.error('Failed to cancel registration:', error)
      toast.error('Failed to cancel registration. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const upcomingRegistrations = registrations
    .filter(reg => reg.status === 'confirmed' && reg.activity && isUpcoming(reg.activity.date))
    .sort((a, b) => {
      const dateCompare = new Date(a.activity.date) - new Date(b.activity.date)
      if (dateCompare !== 0) return dateCompare
      return a.activity.start_time.localeCompare(b.activity.start_time)
    })

  const pastRegistrations = registrations
    .filter(reg => reg.activity && !isUpcoming(reg.activity.date))
    .sort((a, b) => new Date(b.activity.date) - new Date(a.activity.date))

  const membershipType = user?.user_metadata?.membership_type

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcomeBack')}, {user?.user_metadata?.full_name || 'Participant'}!
        </h1>
        <p className="text-gray-600 mt-2">{t('dashboard.activityOverview')}</p>
        
        {membershipType && (
          <div className="mt-4 inline-block">
            <Badge variant="info" className="text-sm">
              {getMembershipDisplayName(membershipType)}
            </Badge>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('landing.browseActivities')}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {t('dashboard.discoverActivities')}
            </p>
            <Button onClick={() => navigate('/activities')} variant="primary">
              {t('dashboard.viewAllActivities')}
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('dashboard.myRegistrations')}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {upcomingRegistrations.length} {t('dashboard.upcomingCount')}
            </p>
            <Button onClick={() => document.getElementById('registrations')?.scrollIntoView({ behavior: 'smooth' })} variant="success">
              {t('dashboard.viewMyActivities')}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Registrations */}
      <Card id="registrations">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                {t('dashboard.myActivities')}
              </h2>
              <Badge variant="info">
                {upcomingRegistrations.length} {t('dashboard.upcoming')}
              </Badge>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-1" />
                {t('dashboard.list')}
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                {t('dashboard.calendar')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : upcomingRegistrations.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={t('dashboard.noUpcoming')}
              description={t('dashboard.browseToRegister')}
              action={
                <Button onClick={() => navigate('/activities')} variant="primary">
                  {t('landing.browseActivities')}
                </Button>
              }
            />
          ) : (
            <>
              {/* Calendar View */}
              {viewMode === 'calendar' && (
                <ActivityMonthCalendar
                  activities={upcomingRegistrations}
                  onActivityClick={(activity) => {
                    setSelectedActivity(activity)
                    setIsModalOpen(true)
                  }}
                  userRole="participant"
                />
              )}

              {/* List View */}
              {viewMode === 'list' && (
            <div className="space-y-4">
              {upcomingRegistrations.map((reg) => (
                <Card key={reg.id} className="hover:shadow-md transition-shadow">
                  <CardBody>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {getActivityTitle(reg.activity, language)}
                          </h3>
                          {reg.activity.program_type && (
                            <Badge variant="info">{reg.activity.program_type}</Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {getActivityDescription(reg.activity, language)}
                        </p>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(reg.activity.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(reg.activity.start_time)} - {formatTime(reg.activity.end_time)}
                            </span>
                          </div>
                          {reg.activity.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{reg.activity.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:items-end justify-between">
                        <Badge variant={reg.status === 'confirmed' ? 'success' : 'warning'}>
                          {reg.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedActivity(reg.activity)
                              setIsModalOpen(true)
                            }}
                          >
                            {t('dashboard.viewDetails')}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelRegistration(reg.id)}
                            loading={cancellingId === reg.id}
                          >
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Past Activities */}
      {pastRegistrations.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('dashboard.pastActivities')}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {pastRegistrations.slice(0, 5).map((reg) => (
                <div
                  key={reg.id}
                  className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{getActivityTitle(reg.activity, language)}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(reg.activity.date)}
                    </p>
                  </div>
                  <Badge variant="secondary">{t('dashboard.completed')}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedActivity(null)
          }}
          action="view"
        />
      )}
    </div>
  )
}
