import { useState, useEffect } from 'react'
import { matchesApi } from '../../services/matches.api'
import ActivityCard from '../activities/ActivityCard'
import Button from '../shared/Button'
import EmptyState from '../shared/EmptyState'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export default function ActivitySwiper() {
  const [activities, setActivities] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableActivities()
  }, [])

  const fetchAvailableActivities = async () => {
    try {
      setLoading(true)
      const response = await matchesApi.getAvailable()
      setActivities(response.data || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction) => {
    const activity = activities[currentIndex]

    if (direction === 'right') {
      try {
        await matchesApi.create({ activity_id: activity.id })
        // TODO: Show match animation
        console.log('Matched with activity:', activity.title)
      } catch (error) {
        console.error('Failed to match:', error)
      }
    }

    // Move to next card
    setCurrentIndex(prev => prev + 1)
  }

  if (loading) {
    return <div className="py-12 text-center">Loading activities...</div>
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        title="No activities available"
        description="Check back later for more volunteer opportunities"
      />
    )
  }

  if (currentIndex >= activities.length) {
    return (
      <EmptyState
        title="All done!"
        description="You've reviewed all available activities"
        action={
          <Button onClick={() => setCurrentIndex(0)}>
            Start Over
          </Button>
        }
      />
    )
  }

  const currentActivity = activities[currentIndex]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card Stack */}
      <div className="relative min-h-[500px]">
        <ActivityCard activity={currentActivity} />
      </div>

      {/* Swipe Buttons */}
      <div className="flex justify-center gap-8 mt-8">
        <Button
          size="large"
          variant="danger"
          onClick={() => handleSwipe('left')}
        >
          <ThumbsDown className="w-6 h-6" />
          Pass
        </Button>
        <Button
          size="large"
          variant="success"
          onClick={() => handleSwipe('right')}
        >
          <ThumbsUp className="w-6 h-6" />
          Volunteer
        </Button>
      </div>

      {/* Progress */}
      <div className="mt-8 text-center text-gray-600">
        {currentIndex + 1} / {activities.length}
      </div>
    </div>
  )
}
