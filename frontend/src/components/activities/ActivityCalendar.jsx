import { useState, useEffect } from 'react'
import { activitiesApi } from '../../services/activities.api'

export default function ActivityCalendar({ mode = 'view', onActivityClick }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await activitiesApi.getAll()
      setActivities(response.data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  // TODO: Implement FullCalendar integration
  // For now, show a placeholder
  return (
    <div className="border border-gray-200 rounded-lg p-8">
      <div className="text-center text-gray-500">
        <p className="text-lg font-medium mb-2">Activity Calendar</p>
        <p className="text-sm">
          FullCalendar integration coming soon...
        </p>
        {loading && <p className="mt-4">Loading activities...</p>}
        {!loading && (
          <p className="mt-4">
            Found {activities.length} activities
          </p>
        )}
      </div>
    </div>
  )
}
