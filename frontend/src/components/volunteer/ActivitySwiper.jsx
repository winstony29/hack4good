import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { matchesApi } from '../../services/matches.api'
import SwipeableCard from './SwipeableCard'
import SwipeButtons from './SwipeButtons'
import MatchAnimation from './MatchAnimation'
import EmptyState from '../shared/EmptyState'
import Button from '../shared/Button'
import Spinner from '../shared/Spinner'

const VISIBLE_CARDS = 3 // Number of cards to show in stack

export default function ActivitySwiper({ onMatch }) {
  const [activities, setActivities] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [swiping, setSwiping] = useState(false)
  const [matchedActivity, setMatchedActivity] = useState(null)
  const [showMatchAnimation, setShowMatchAnimation] = useState(false)
  const cardRef = useRef(null)

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
    if (swiping) return
    setSwiping(true)

    const activity = activities[currentIndex]

    if (direction === 'right') {
      try {
        await matchesApi.create({ activity_id: activity.id })
        console.log('Matched with activity:', activity.title)

        // Show match celebration
        setMatchedActivity(activity)
        setShowMatchAnimation(true)

        // Also trigger parent callback if provided
        if (onMatch) {
          onMatch(activity)
        }
      } catch (error) {
        console.error('Failed to match:', error)
      }
    }

    // Move to next card after animation completes
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwiping(false)
    }, 50)
  }

  const handleButtonSwipe = (direction) => {
    // The SwipeableCard will handle its own animation via controls
    handleSwipe(direction)
  }

  const handleCloseMatchAnimation = () => {
    setShowMatchAnimation(false)
    setMatchedActivity(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="large" />
      </div>
    )
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

  // Get visible cards for stack effect
  const visibleActivities = activities.slice(
    currentIndex,
    currentIndex + VISIBLE_CARDS
  )

  return (
    <div className="max-w-md mx-auto px-4">
      {/* Card Stack */}
      <div className="relative h-[480px] mb-8">
        <AnimatePresence>
          {visibleActivities.map((activity, index) => (
            <SwipeableCard
              key={activity.id}
              activity={activity}
              onSwipe={handleSwipe}
              isTop={index === 0}
              stackIndex={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Swipe Buttons */}
      <SwipeButtons
        onPass={() => handleButtonSwipe('left')}
        onMatch={() => handleButtonSwipe('right')}
        disabled={swiping}
      />

      {/* Progress */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        {currentIndex + 1} of {activities.length} activities
      </div>

      {/* Match Celebration */}
      <MatchAnimation
        activity={matchedActivity}
        isVisible={showMatchAnimation}
        onClose={handleCloseMatchAnimation}
      />
    </div>
  )
}
