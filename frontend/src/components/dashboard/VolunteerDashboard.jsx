import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, CalendarDays, List, Heart, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react'
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
import { matchesApi } from '../../services/matches.api'

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
    if (user) {
      fetchMatches()
    }
  }, [user])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      // Fetch matches from backend - includes activity data via joinedload
      const response = await matchesApi.getAll(user?.id)
      setMatches(response.data || [])
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
      await matchesApi.cancel(matchId)
      await fetchMatches()
    } catch (error) {
      console.error('Failed to cancel match:', error)
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
      {/* Welcome Header with gradient */}
      <motion.div variants={itemVariants} className="relative overflow-hidden  p-8"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
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
                className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-pink-100 text-sm font-semibold tracking-wide uppercase">Volunteer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome, {user?.user_metadata?.full_name || 'Volunteer'}!
            </h1>
            <p className="text-pink-100 mt-2 max-w-xl">
              Thank you for making a difference in our community
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats with improved styling */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Card */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden  p-6"
          style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            boxShadow: '0 2px 15px -5px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.08)'
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-20"
            style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.4) 0%, transparent 70%)'
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center"
                style={{ background: 'rgba(139, 92, 246, 0.15)' }}
              >
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-purple-900 mb-1">{upcomingMatches.length}</p>
            <p className="text-sm text-gray-500 font-medium">Upcoming Activities</p>
          </div>
        </motion.div>

        {/* Completed Card */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden  p-6"
          style={{
            background: 'linear-gradient(135deg, #f4f9f4 0%, #e6f2e6 100%)',
            boxShadow: '0 2px 15px -5px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.08)'
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-20"
            style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(34, 197, 94, 0.4) 0%, transparent 70%)'
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center"
                style={{ background: 'rgba(34, 197, 94, 0.15)' }}
              >
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-green-900 mb-1">{pastMatches.length}</p>
            <p className="text-sm text-gray-500 font-medium">Completed</p>
          </div>
        </motion.div>

        {/* Discover Activities CTA */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
          className="relative overflow-hidden  p-6 cursor-pointer"
          onClick={() => navigate('/swiper')}
          style={{
            background: 'linear-gradient(135deg, #ff6b4a 0%, #f04d2e 100%)',
            boxShadow: '0 4px 20px -5px rgba(255, 107, 74, 0.4)'
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute top-0 right-0 w-40 h-40 opacity-20"
            style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)'
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Discover Activities</h3>
            <p className="text-white/90 text-sm mb-4">Swipe through opportunities and find your perfect match</p>
            <div className="flex items-center gap-2 text-white font-semibold">
              <span>Start Swiping</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Schedule Section */}
      <motion.div variants={itemVariants}>
        <div
          className=" overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 4px 30px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">My Schedule</h2>
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    color: '#7c3aed'
                  }}
                >
                  {upcomingMatches.length} upcoming
                </span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-gray-100 border-2 border-gray-300">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-coral-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'calendar'
                      ? 'bg-white text-coral-600 shadow-sm'
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
              <div className="flex justify-center py-16">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-5 h-5 border-2 border-coral-200 border-t-coral-500 rounded-full animate-spin" />
                  <span>Loading schedule...</span>
                </div>
              </div>
            ) : upcomingMatches.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No volunteer commitments"
                description="Swipe through activities to find your next opportunity"
                action={
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/swiper')}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 font-display font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b4a 0%, #f04d2e 100%)'
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Swiping
                  </motion.button>
                }
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
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        className=" overflow-hidden"
                        style={{
                          background: '#ffffff',
                          boxShadow: '0 2px 10px -3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.03)'
                        }}
                      >
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                                {m.activity.title}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2">{m.activity.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-coral-50 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-coral-500" />
                                  </div>
                                  <span>{formatDate(m.activity.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-sage-600" />
                                  </div>
                                  <span>{formatTime(m.activity.start_time)} - {formatTime(m.activity.end_time)}</span>
                                </div>
                                {m.activity.location && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
                                      <MapPin className="w-4 h-4 text-navy-500" />
                                    </div>
                                    <span>{m.activity.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-row md:flex-col gap-2 md:items-end">
                              <span
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(86, 150, 90, 0.1) 0%, rgba(86, 150, 90, 0.05) 100%)',
                                  color: '#38623b'
                                }}
                              >
                                <Heart className="w-3.5 h-3.5" fill="currentColor" />
                                Volunteering
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setSelectedActivity(m.activity); setIsModalOpen(true) }}
                                  className="px-4 py-2 border-2 border-gray-300 text-sm font-medium text-gray-700
                                             bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => handleCancelMatch(m.id)}
                                  disabled={cancellingId === m.id}
                                  className="px-4 py-2 border-2 border-gray-300 text-sm font-medium text-coral-700
                                             bg-coral-50 hover:bg-coral-100 transition-colors
                                             disabled:opacity-50"
                                >
                                  {cancellingId === m.id ? 'Cancelling...' : 'Cancel'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedActivity(null) }}
          action="view"
        />
      )}
    </motion.div>
  )
}
