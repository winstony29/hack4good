import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card, { CardHeader, CardBody } from '../shared/Card'
import { TrendingUp, Users, Calendar, Award, ArrowUpRight, BarChart3 } from 'lucide-react'
import AnalyticsCharts from '../staff/AnalyticsCharts'
import ActivityManager from '../staff/ActivityManager'
import WeeklyTimetable from '../staff/WeeklyTimetable'
import Spinner from '../shared/Spinner'
import { getDashboardMetrics } from '../../mocks/analytics.mock'
import { activitiesApi } from '../../services/activities.api'
import { registrationsApi } from '../../services/registrations.api'
import { ANALYTICS_COLORS } from '../../constants'

export default function StaffDashboard() {
  const { user } = useAuth()
  const metrics = getDashboardMetrics()
  const [activities, setActivities] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [activitiesResponse, registrationsResponse] = await Promise.all([
        activitiesApi.getAll(),
        registrationsApi.getAll()
      ])
      
      setActivities(activitiesResponse.data || [])
      setRegistrations(registrationsResponse.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header with mesh background */}
      <motion.div variants={itemVariants} className="relative overflow-hidden  p-8"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #3435a3 100%)'
        }}
      >
        {/* Mesh overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, rgba(212, 161, 6, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(98, 113, 241, 0.3) 0%, transparent 50%)'
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center"
              style={{ background: 'rgba(212, 161, 6, 0.2)' }}
            >
              <BarChart3 className="w-5 h-5 text-gold-400" />
            </div>
            <span className="text-gold-400 text-sm font-semibold tracking-wide uppercase">Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Staff Analytics
          </h1>
          <p className="text-navy-200 mt-2 max-w-xl">
            Monitor activity performance, track volunteer engagement, and manage your programs all in one place.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <StatsCard
          icon={<Calendar className="w-5 h-5" />}
          title="Total Activities"
          value={metrics.totalActivities.toString()}
          trend="+12%"
          color={ANALYTICS_COLORS.stats.activities}
          bgGradient="linear-gradient(135deg, #f0f4ff 0%, #e0e9ff 100%)"
        />
        <StatsCard
          icon={<Users className="w-5 h-5" />}
          title="Total Registrations"
          value={metrics.totalRegistrations.toString()}
          trend="+8%"
          color={ANALYTICS_COLORS.stats.registrations}
          bgGradient="linear-gradient(135deg, #f4f9f4 0%, #e6f2e6 100%)"
        />
        <StatsCard
          icon={<Award className="w-5 h-5" />}
          title="Active Volunteers"
          value={metrics.activeVolunteers.toString()}
          trend="+15%"
          color={ANALYTICS_COLORS.stats.volunteers}
          bgGradient="linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)"
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Volunteer Coverage"
          value={`${metrics.volunteerCoverage}%`}
          trend="+5%"
          color={ANALYTICS_COLORS.stats.coverage}
          bgGradient="linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)"
        />
      </motion.div>

      {/* Analytics Section */}
      <motion.div variants={itemVariants}>
        <div
          className=" overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 4px 30px -10px rgba(30, 27, 75, 0.08), 0 0 0 1px rgba(30, 27, 75, 0.03)'
          }}
        >
          <div className="px-6 sm:px-8 py-6 border-b border-navy-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
                  Analytics & Trends
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Performance metrics and engagement data
                </p>
              </div>
              <div
                className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-sm font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(98, 113, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  color: '#4a4de5'
                }}
              >
                <span>Last 30 days</span>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <AnalyticsCharts />
          </div>
        </div>
      </motion.div>

      {/* Activity Management Section */}
      <motion.div variants={itemVariants}>
        <ActivityManager />
      </motion.div>

      {/* Weekly Timetable Section */}
      <motion.div variants={itemVariants}>
        <div
          className=" overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 4px 30px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center"
                style={{ background: 'rgba(98, 113, 241, 0.1)' }}
              >
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Weekly Schedule
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  View all activities and attendees by day
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <WeeklyTimetable activities={activities} registrations={registrations} />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatsCard({ icon, title, value, trend, color, bgGradient }) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative  overflow-hidden p-5 sm:p-6"
      style={{
        background: bgGradient,
        boxShadow: '0 2px 15px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-20"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${color}40 0%, transparent 70%)`
        }}
      />

      <div className="relative">
        {/* Icon and trend row */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center"
            style={{
              background: `${color}15`,
              color: color
            }}
          >
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-semibold text-sage-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {trend}
            </div>
          )}
        </div>

        {/* Value */}
        <p
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: '#1e1b4b' }}
        >
          {value}
        </p>

        {/* Title */}
        <p className="text-sm text-gray-500 mt-1 font-medium">{title}</p>
      </div>
    </motion.div>
  )
}
