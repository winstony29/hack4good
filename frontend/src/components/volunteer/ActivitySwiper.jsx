import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { matchesApi } from '../../services/matches.api'
import SwipeableCard from './SwipeableCard'
import SwipeButtons from './SwipeButtons'
import MatchAnimation from './MatchAnimation'
import EmptyState from '../shared/EmptyState'
import Button from '../shared/Button'
import Spinner from '../shared/Spinner'
import { Sparkles, RefreshCw, Heart } from 'lucide-react'

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

  // Show toast when all activities have been reviewed
  useEffect(() => {
    if (!loading && activities.length > 0 && currentIndex >= activities.length) {
      toast('No more activities to browse!', {
        icon: '✨',
        duration: 3000
      })
    }
  }, [currentIndex, activities.length, loading])

  const fetchAvailableActivities = async () => {
    try {
      setLoading(true)
      const response = await matchesApi.getAvailable()
      setActivities(response.data || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      toast.error('Failed to load activities. Please refresh the page.', {
        duration: 4000
      })
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
        // Use toast.promise for loading state during API call
        await toast.promise(
          matchesApi.create({ activity_id: activity.id }),
          {
            loading: 'Confirming match...',
            success: `Matched with "${activity.title}"!`,
            error: 'Failed to create match. Please try again.'
          },
          {
            success: {
              icon: '💚',
              duration: 3000
            },
            error: {
              duration: 4000
            }
          }
        )

        // Show match celebration
        setMatchedActivity(activity)
        setShowMatchAnimation(true)

        // Also trigger parent callback if provided
        if (onMatch) {
          onMatch(activity)
        }
      } catch (error) {
        console.error('Failed to match:', error)
        // Error already shown by toast.promise
      }
    } else {
      // Pass - show subtle info toast
      toast(`Passed on "${activity.title}"`, {
        duration: 1500,
        icon: '👋',
        style: {
          background: '#fff5f3',
          color: '#88321f',
          border: '1px solid #ffd4cb'
        }
      })
    }

    // Move to next card after animation completes
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwiping(false)
    }, 50)
  }

  const handleButtonSwipe = (direction) => {
    handleSwipe(direction)
  }

  const handleCloseMatchAnimation = () => {
    setShowMatchAnimation(false)
    setMatchedActivity(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          {/* Animated loading ring */}
          <div className="w-16 h-16 rounded-full border-4 border-coral-100 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-6 h-6 text-coral-400 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-display">Finding activities...</p>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Sparkles}
          title="No activities available"
          description="Check back later for more volunteer opportunities"
        />
      </div>
    )
  }

  if (currentIndex >= activities.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-12"
      >
        <div className="text-center">
          {/* Completion illustration */}
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #f4f9f4 0%, #e6f2e6 100%)',
              boxShadow: '0 10px 30px -10px rgba(86, 150, 90, 0.2)'
            }}
          >
            <Sparkles className="w-10 h-10 text-sage-500" />
          </div>
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
            All done!
          </h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">
            You've reviewed all available activities. Great job exploring!
          </p>
          <Button
            onClick={() => setCurrentIndex(0)}
            variant="secondary"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-semibold
                       bg-white border-2 border-sage-200 text-sage-700
                       hover:bg-sage-50 hover:border-sage-300 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
      </motion.div>
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
      <div className="relative h-[420px] sm:h-[460px] md:h-[500px] mb-8">
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

      {/* Progress Indicator */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {activities.slice(0, Math.min(8, activities.length)).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? 'w-1.5 bg-sage-400'
                  : i === currentIndex
                    ? 'w-4 bg-sage-500'
                    : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
          {activities.length > 8 && (
            <span className="text-xs text-gray-400 ml-1">...</span>
          )}
        </div>
        {/* Progress text */}
        <span className="text-sm text-gray-400 font-display">
          {currentIndex + 1} / {activities.length}
        </span>
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
