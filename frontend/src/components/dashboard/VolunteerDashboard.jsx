import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, CalendarDays, List, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Card, { CardHeader, CardBody } from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import Spinner from '../shared/Spinner'
import ActivityDetailModal from '../activities/ActivityDetailModal'
import ActivityMonthCalendar from '../activities/ActivityMonthCalendar'
import { formatDate, formatTime, isUpcoming } from '../../utils/dateUtils'
import { useNavigate } from 'react-router-dom'

// Mock API - replace with real API when available
import { getVolunteerMatches, cancelVolunteerMatch } from '../../mocks/volunteerMatches.mock'
import { activitiesApi } from '../../services/activities.api'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [viewMode, setViewMode] = useState('calendar') // 'list' or 'calendar'

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const matchesData = getVolunteerMatches(user?.id)
      
      const matchesWithActivities = await Promise.all(
        matchesData.map(async (match) => {
          try {
            const activityResponse = await activitiesApi.getById(match.activity_id)
            return { ...match, activity: activityResponse.data }
          } catch (error) {
            return match
          }
        })
      )
      
      setMatches(matchesWithActivities)
    } catch (error) {
      console.error('Failed to fetch volunteer matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelMatch = async (matchId) => {
    if (!confirm('Cancel this volunteer commitment?')) return

    setCancellingId(matchId)
    try {
      cancelVolunteerMatch(matchId)
      await fetchMatches()
    } catch (error) {
      alert('Failed to cancel. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const upcomingMatches = matches
    .filter(m => m.status === 'confirmed' && m.activity && isUpcoming(m.activity.date))
    .sort((a, b) => {
      const d = new Date(a.activity.date) - new Date(b.activity.date)
      return d !== 0 ? d : a.activity.start_time.localeCompare(b.activity.start_time)
    })

  const pastMatches = matches.filter(m => m.activity && !isUpcoming(m.activity.date))

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.user_metadata?.full_name || 'Volunteer'}!
        </h1>
        <p className="text-gray-600 mt-2">Thank you for making a difference</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingMatches.length}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{pastMatches.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody>
            <h3 className="font-semibold mb-2">Find Activities</h3>
            <Button onClick={() => navigate('/activities')} variant="primary" size="sm">
              Browse & Match
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">My Schedule</h2>
              <Badge variant="info">{upcomingMatches.length} upcoming</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant={viewMode === 'list' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('list')}>
                <List className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'calendar' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('calendar')}>
                <CalendarDays className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : upcomingMatches.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No volunteer commitments"
              description="Browse activities and match with opportunities"
              action={<Button onClick={() => navigate('/activities')} variant="primary">Find Activities</Button>}
            />
          ) : (
            <>
              {viewMode === 'calendar' && (
                <ActivityMonthCalendar
                  activities={upcomingMatches}
                  onActivityClick={(a) => { setSelectedActivity(a); setIsModalOpen(true) }}
                  userRole="volunteer"
                />
              )}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {upcomingMatches.map((m) => (
                    <Card key={m.id} className="hover:shadow-md transition-shadow">
                      <CardBody>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{m.activity.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{m.activity.description}</p>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(m.activity.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(m.activity.start_time)} - {formatTime(m.activity.end_time)}</span>
                              </div>
                              {m.activity.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{m.activity.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="success"><Heart className="w-3 h-3 mr-1" />Volunteering</Badge>
                            <Button variant="secondary" size="sm" onClick={() => { setSelectedActivity(m.activity); setIsModalOpen(true) }}>
                              Details
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleCancelMatch(m.id)} loading={cancellingId === m.id}>
                              Cancel
                            </Button>
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

      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedActivity(null) }}
          action="view"
        />
      )}
    </div>
  )
}
