import { useState, useEffect } from 'react'
import { Search, Filter, CalendarDays, List, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import Card, { CardHeader, CardBody } from '../components/shared/Card'
import Spinner from '../components/shared/Spinner'
import EmptyState from '../components/shared/EmptyState'
import ActivityCalendar from '../components/activities/ActivityCalendar'
import ActivityMonthCalendar from '../components/activities/ActivityMonthCalendar'
import ActivityDetailModal from '../components/activities/ActivityDetailModal'
import DayActivitiesModal from '../components/activities/DayActivitiesModal'
import Input from '../components/shared/Input'
import Button from '../components/shared/Button'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { registrationsApi } from '../services/registrations.api'
import { activitiesApi } from '../services/activities.api'

export default function Activities() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDayActivities, setSelectedDayActivities] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('all')
  const [userRegistrations, setUserRegistrations] = useState([])
  const [allActivities, setAllActivities] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([
        fetchUserRegistrations(),
        fetchAllActivities()
      ])
    } catch (err) {
      setError('Failed to load activities. Please try again.')
      toast.error('Failed to load activities. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async () => {
    try {
      const response = await registrationsApi.getAll()
      setUserRegistrations(response.data || [])
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
      // Don't re-throw — a registrations failure shouldn't block activities from loading
      setUserRegistrations([])
    }
  }

  const fetchAllActivities = async () => {
    try {
      const response = await activitiesApi.getAll()
      setAllActivities(response.data || [])
    } catch (err) {
      console.error('Failed to fetch activities:', err)
      throw err
    }
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const handleRegister = async (activity) => {
    // Registration is handled in the modal
    // Refresh registrations after successful registration
    await fetchUserRegistrations()
    await fetchAllActivities()
  }

  const handleDayClick = (date, activities) => {
    setSelectedDate(date)
    setSelectedDayActivities(activities)
    setIsDayModalOpen(true)
  }

  const handleRegisterFromDay = async (activityId) => {
    const activity = allActivities.find(a => a.id === activityId)
    if (activity) {
      setSelectedActivity(activity)
      setIsDayModalOpen(false)
      setIsModalOpen(true)
    }
  }

  const getFilterOptions = () => {
    const options = {}
    
    if (searchQuery) {
      options.search = searchQuery
    }
    
    if (programFilter !== 'all') {
      options.program_type = programFilter
    }

    return options
  }

  const userRole = user?.user_metadata?.role

  return (
    <Layout>
      {/* Page background with gradient mesh */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fef3c7 25%, #fce7f3 50%, #f3e8ff 75%, #dbeafe 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="border-b-2 border-purple-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1
                  className="text-4xl sm:text-5xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t('activities.browseTitle')}
                </h1>
                <p className="text-gray-700 text-lg font-medium mt-2">
                  {t('activities.browseSubtitle')}
                </p>
              </div>
              
              {/* View Mode Toggle & Filter Button */}
              <div className="flex gap-2">
                <div className="hidden md:flex gap-2">
                  <Button 
                    variant={viewMode === 'list' ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'calendar' ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    <CalendarDays className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Filter Toggle Button (Mobile) */}
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? t('activities.hideFilters') : t('activities.showFilters')}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            {/* Search and Filters */}
            <div className={`mb-6 space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder={t('activities.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Program Type Filter */}
                <div className="md:w-64">
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t('activities.allPrograms')}</option>
                    <option value="sports">{t('activities.sports')}</option>
                    <option value="arts">{t('activities.arts')}</option>
                    <option value="music">{t('activities.music')}</option>
                    <option value="social">{t('activities.social')}</option>
                    <option value="educational">{t('activities.educational')}</option>
                    <option value="wellness">{t('activities.wellness')}</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || programFilter !== 'all') && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">{t('activities.activeFilters')}</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {t('common.search')}: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {programFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {t(`activities.${programFilter}`)}
                      <button
                        onClick={() => setProgramFilter('all')}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setProgramFilter('all')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {t('activities.clearAll')}
                  </button>
                </div>
              )}
            </div>

            {/* Activity Views */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <EmptyState
                icon={Calendar}
                title={t('activities.failedToLoad')}
                description={error}
                action={
                  <Button onClick={loadData} variant="primary">
                    {t('activities.tryAgain')}
                  </Button>
                }
              />
            ) : allActivities.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title={t('activities.noAvailable')}
                description={t('activities.checkBackNew')}
              />
            ) : viewMode === 'list' ? (
              <ActivityCalendar
                mode="view"
                onActivityClick={handleActivityClick}
                filterOptions={getFilterOptions()}
              />
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  {t('activities.clickDay')}
                </p>
                <ActivityMonthCalendar
                  activities={allActivities}
                  onDayClick={handleDayClick}
                  mode="register"
                />
              </div>
            )}
          </CardBody>
        </Card>
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
          action={userRole === 'participant' ? 'register' : 'view'}
          onConfirm={handleRegister}
          userRegistrations={userRegistrations}
        />
      )}

      {/* Day Activities Modal */}
      <DayActivitiesModal
        date={selectedDate}
        dayActivities={selectedDayActivities}
        userRegistrations={userRegistrations}
        user={user}
        isOpen={isDayModalOpen}
        onClose={() => {
          setIsDayModalOpen(false)
          setSelectedDate(null)
          setSelectedDayActivities([])
        }}
        onRegister={handleRegisterFromDay}
      />
    </Layout>
  )
}
