import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import ActivityCard from '../activities/ActivityCard'
import { useAccessibility } from '../../contexts/AccessibilityContext'

const swipeConfidenceThreshold = 100

export default function SwipeableCard({
  activity,
  onSwipe,
  isTop = false,
  stackIndex = 0
}) {
  const { reduceMotion } = useAccessibility()
  const controls = useAnimation()
  const x = useMotionValue(0)

  // Animation duration based on accessibility preference
  const animDuration = reduceMotion ? 0.01 : 0.3

  // Rotate card based on drag position
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])

  // Opacity for swipe indicators
  const passOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])
  const matchOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1])

  // Scale for stacked cards (cards behind are smaller)
  const scale = 1 - stackIndex * 0.05
  const y = stackIndex * 8

  const handleDragEnd = async (event, info) => {
    const { offset, velocity } = info
    const swipePower = Math.abs(offset.x) * velocity.x

    if (swipePower < -swipeConfidenceThreshold * 100 || offset.x < -swipeConfidenceThreshold) {
      // Swipe left - Pass
      await controls.start({
        x: -400,
        opacity: 0,
        rotate: -20,
        transition: { duration: animDuration }
      })
      onSwipe('left')
    } else if (swipePower > swipeConfidenceThreshold * 100 || offset.x > swipeConfidenceThreshold) {
      // Swipe right - Match
      await controls.start({
        x: 400,
        opacity: 0,
        rotate: 20,
        transition: { duration: animDuration }
      })
      onSwipe('right')
    } else {
      // Snap back to center - use instant transition if reduceMotion
      const snapBackTransition = reduceMotion
        ? { type: 'tween', duration: 0.01 }
        : { type: 'spring', stiffness: 500, damping: 30 }
      controls.start({ x: 0, rotate: 0, transition: snapBackTransition })
    }
  }

  // Programmatic swipe (for button clicks)
  const triggerSwipe = async (direction) => {
    const xTarget = direction === 'right' ? 400 : -400
    const rotateTarget = direction === 'right' ? 20 : -20

    await controls.start({
      x: xTarget,
      opacity: 0,
      rotate: rotateTarget,
      transition: { duration: animDuration }
    })
    onSwipe(direction)
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x,
        rotate,
        scale,
        y,
        zIndex: 10 - stackIndex
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={controls}
    >
      {/* Swipe Indicators */}
      {isTop && (
        <>
          <motion.div
            className="absolute top-8 left-8 bg-red-500 text-white px-6 py-2 rounded-lg font-bold text-xl z-20 rotate-[-15deg]"
            style={{ opacity: passOpacity }}
          >
            PASS
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-xl z-20 rotate-[15deg]"
            style={{ opacity: matchOpacity }}
          >
            MATCH!
          </motion.div>
        </>
      )}

      {/* Activity Card */}
      <div className="h-full">
        <ActivityCard activity={activity} showTTS={isTop} />
      </div>
    </motion.div>
  )
}

// Export triggerSwipe method via ref for button access
SwipeableCard.displayName = 'SwipeableCard'
