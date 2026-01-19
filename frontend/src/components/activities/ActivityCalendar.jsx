import { useState, useEffect } from 'react'
import { Calendar, Grid, List } from 'lucide-react'
import { activitiesApi } from '../../services/activities.api'
import ActivityCard from './ActivityCard'
import Spinner from '../shared/Spinner'
import EmptyState from '../shared/EmptyState'
import Button from '../shared/Button'
import { formatDate, getWeekBoundaries, isUpcoming } from '../../utils/dateUtils'

export default function ActivityCalendar({ mode = 'view', onActivityClick, filterOptions = {} }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [dateFilter, setDateFilter] = useState('upcoming') // 'upcoming', 'all', 'week', 'month'

  useEffect(() => {
    fetchActivities()
  }, [filterOptions])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await activitiesApi.getAll(filterOptions)
      setActivities(response.data || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const getFilteredActivities = () => {
    let filtered = [...activities]

    // Apply date filter
    switch (dateFilter) {
      case 'upcoming':
        filtered = filtered.filter(activity => isUpcoming(activity.date))
        break
      case 'week':
        const { start, end } = getWeekBoundaries(new Date())
        filtered = filtered.filter(activity => {
          const activityDate = new Date(activity.date)
          return activityDate >= start && activityDate <= end
        })
        break
      case 'month':
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        filtered = filtered.filter(activity => {
          const activityDate = new Date(activity.date)
          return activityDate >= monthStart && activityDate <= monthEnd
        })
        break
      default:
        break
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateCompare = new Date(a.date) - new Date(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.start_time.localeCompare(b.start_time)
    })

    return filtered
  }

  const groupActivitiesByDate = (activities) => {
    return activities.reduce((groups, activity) => {
      const date = activity.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
      return groups
    }, {})
  }

  const filteredActivities = getFilteredActivities()
  const groupedActivities = groupActivitiesByDate(filteredActivities)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Date Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={dateFilter === 'upcoming' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDateFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={dateFilter === 'week' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDateFilter('week')}
          >
            This Week
          </Button>
          <Button
            variant={dateFilter === 'month' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDateFilter('month')}
          >
            This Month
          </Button>
          <Button
            variant={dateFilter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDateFilter('all')}
          >
            All
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Activities Display */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No activities found"
          description="Check back later for upcoming activities"
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="sticky top-0 bg-gray-50 z-10 pb-2 -mx-4 px-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {formatDate(date)}
                </h3>
              </div>

              {/* Activities for this date */}
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
              }>
                {dayActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onClick={() => onActivityClick?.(activity)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
