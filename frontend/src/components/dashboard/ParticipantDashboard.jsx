import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, AlertCircle, CalendarDays, List, Sparkles, ArrowUpRight } from 'lucide-react'
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
    if (user) {
      fetchRegistrations()
    }
  }, [user])

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section with gradient header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden p-8 shadow-lg border-2 border-purple-300"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        }}
      >
        {/* Mesh overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, rgba(255, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)'
          }}
        />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-10 h-10 flex items-center justify-center border-2 border-white/40"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-100 text-sm font-semibold tracking-wide uppercase">Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t('dashboard.welcomeBack')}, {user?.user_metadata?.full_name || 'Participant'}!
            </h1>
            <p className="text-blue-100 mt-2 max-w-xl">{t('dashboard.activityOverview')}</p>
            
            {membershipType && (
              <div className="mt-4">
                <Badge 
                  variant="info" 
                  className="text-sm bg-white/20 backdrop-blur-sm border border-white/30"
                  style={{ color: 'white' }}
                >
                  {getMembershipDisplayName(membershipType)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden p-6 border-2 border-blue-200 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-20"
            style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 flex items-center justify-center border-2 border-blue-300"
                style={{ background: 'rgba(59, 130, 246, 0.15)' }}
              >
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('dashboard.discoverActivities')}
              </h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              {t('dashboard.swipeToFind')}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/swiper')} variant="primary" size="sm">
                {t('dashboard.startSwiping')}
              </Button>
              <Button onClick={() => navigate('/activities')} variant="secondary" size="sm">
                {t('dashboard.viewAllActivities')}
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden p-6 border-2 border-green-200 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-20"
            style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(34, 197, 94, 0.4) 0%, transparent 70%)'
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 flex items-center justify-center border-2 border-green-300"
                style={{ background: 'rgba(34, 197, 94, 0.15)' }}
              >
                <CalendarDays className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('dashboard.myRegistrations')}
              </h3>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-700">{upcomingRegistrations.length}</span>
                <span className="text-sm text-gray-600">{t('dashboard.upcomingCount')}</span>
              </div>
            </div>
            <Button 
              onClick={() => document.getElementById('registrations')?.scrollIntoView({ behavior: 'smooth' })} 
              variant="success"
              size="sm"
              className="w-full"
            >
              {t('dashboard.viewMyActivities')}
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Upcoming Registrations */}
      <motion.div variants={itemVariants} id="registrations">
        <div
          className="overflow-hidden border-2 border-gray-200 shadow-lg"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          <div className="px-6 sm:px-8 py-6 border-b-2 border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center border-2 border-blue-300"
                  style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {t('dashboard.myActivities')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {upcomingRegistrations.length} {t('dashboard.upcoming')}
                  </p>
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 border-2 border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all duration-200 flex items-center justify-center ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-md border-2 border-blue-300'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 transition-all duration-200 flex items-center justify-center ${
                    viewMode === 'calendar'
                      ? 'bg-white text-blue-600 shadow-md border-2 border-blue-300'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
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
                <div className="flex gap-2">
                  <Button onClick={() => navigate('/swiper')} variant="primary">
                    {t('dashboard.startSwiping')}
                  </Button>
                  <Button onClick={() => navigate('/activities')} variant="secondary">
                    {t('landing.browseActivities')}
                  </Button>
                </div>
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
          </div>
        </div>
      </motion.div>

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
    </motion.div>
  )
}
