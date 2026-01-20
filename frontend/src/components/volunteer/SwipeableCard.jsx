import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Sparkles, Accessibility, DollarSign } from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { formatDate, formatTime } from '../../utils/dateUtils'

const swipeConfidenceThreshold = 80

export default function SwipeableCard({
  activity,
  onSwipe,
  isTop = false,
  stackIndex = 0,
  userRole = 'volunteer'
}) {
  const isVolunteer = userRole === 'volunteer'
  const { reduceMotion } = useAccessibility()
  const controls = useAnimation()
  const x = useMotionValue(0)

  // Animation duration based on accessibility preference
  const animDuration = reduceMotion ? 0.01 : 0.35

  // Rotate card based on drag position
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])

  // Opacity for swipe indicators
  const passOpacity = useTransform(x, [-120, -60, 0], [1, 0.6, 0])
  const matchOpacity = useTransform(x, [0, 60, 120], [0, 0.6, 1])

  // Dynamic background tint based on swipe direction
  const bgTint = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(255, 107, 74, 0.08)', 'rgba(0, 0, 0, 0)', 'rgba(86, 150, 90, 0.08)']
  )

  // Scale for stacked cards (cards behind are smaller)
  const scale = 1 - stackIndex * 0.04
  const y = stackIndex * 6

  const handleDragEnd = async (event, info) => {
    const { offset, velocity } = info
    const swipePower = Math.abs(offset.x) * velocity.x

    if (swipePower < -swipeConfidenceThreshold * 100 || offset.x < -swipeConfidenceThreshold) {
      // Swipe left - Pass
      await controls.start({
        x: -500,
        opacity: 0,
        rotate: -25,
        transition: {
          duration: animDuration,
          ease: [0.32, 0.72, 0, 1]
        }
      })
      onSwipe('left')
    } else if (swipePower > swipeConfidenceThreshold * 100 || offset.x > swipeConfidenceThreshold) {
      // Swipe right - Match
      await controls.start({
        x: 500,
        opacity: 0,
        rotate: 25,
        transition: {
          duration: animDuration,
          ease: [0.32, 0.72, 0, 1]
        }
      })
      onSwipe('right')
    } else {
      // Snap back to center
      const snapBackTransition = reduceMotion
        ? { type: 'tween', duration: 0.01 }
        : { type: 'spring', stiffness: 400, damping: 25 }
      controls.start({ x: 0, rotate: 0, transition: snapBackTransition })
    }
  }

  const availableSpots = activity.max_capacity - activity.current_participants
  const isFull = availableSpots <= 0

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
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={controls}
    >
      {/* Main Card */}
      <motion.div
        className="h-full relative overflow-hidden border-2 border-gray-300"
        style={{
          backgroundColor: bgTint,
          boxShadow: isTop
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.12)'
            : '0 10px 30px -15px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Card Background with Gradient */}
        <div className="absolute inset-0 bg-white">
          {/* Subtle mesh gradient background */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse at 30% 0%, rgba(255, 212, 203, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(206, 229, 207, 0.3) 0%, transparent 50%)'
            }}
          />
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
            }}
          />
        </div>

        {/* Swipe Indicators */}
        {isTop && (
          <>
            {/* Pass Indicator */}
            <motion.div
              className="absolute top-6 left-6 z-30"
              style={{ opacity: passOpacity }}
            >
              <div className="relative">
                <div
                  className="px-6 py-3  font-display font-bold text-xl tracking-wide text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b4a 0%, #f04d2e 100%)',
                    transform: 'rotate(-12deg)',
                    boxShadow: '0 8px 25px -5px rgba(255, 107, 74, 0.5)'
                  }}
                >
                  NOPE
                </div>
              </div>
            </motion.div>

            {/* Match Indicator */}
            <motion.div
              className="absolute top-6 right-6 z-30"
              style={{ opacity: matchOpacity }}
            >
              <div className="relative">
                <div
                  className="px-6 py-3  font-display font-bold text-xl tracking-wide text-white shadow-lg flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #56965a 0%, #78b37c 100%)',
                    transform: 'rotate(12deg)',
                    boxShadow: '0 8px 25px -5px rgba(86, 150, 90, 0.5)'
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  YES!
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Card Content */}
        <div className="relative h-full flex flex-col p-6 sm:p-8 pb-12 sm:pb-16">
          {/* Header */}
          <div className="flex-none">
            {/* Program Type Badge */}
            {activity.program_type && (
              <div className="mb-4">
                <span
                  className="inline-flex items-center px-4 py-1.5 text-sm font-medium font-display tracking-wide border-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(98, 113, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    color: '#4a4de5',
                    borderColor: 'rgba(98, 113, 241, 0.3)'
                  }}
                >
                  {activity.program_type}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 leading-tight mb-3">
              {activity.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3 mb-6">
              {activity.description}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Details Section */}
          <div className="flex-none space-y-3">
            {/* Divider */}
            <div
              className="h-px w-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.08) 80%, transparent)'
              }}
            />

            {/* Date & Time Row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="w-9 h-9 bg-red-100 border-2 border-red-300 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5 text-red-600" />
                </div>
                <span className="font-medium">{formatDate(activity.date)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="w-9 h-9 bg-green-100 border-2 border-green-300 flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-green-700" />
                </div>
                <span className="font-medium">
                  {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                </span>
              </div>
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-2.5 text-gray-700">
              <div className="w-9 h-9 bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                <MapPin className="w-4.5 h-4.5 text-purple-600" />
              </div>
              <span className="font-medium">{activity.location}</span>
            </div>

            {/* Capacity Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{activity.current_participants}</span>
                  <span className="text-gray-400"> / </span>
                  <span>{activity.max_capacity}</span>
                  <span className="text-gray-400 ml-1">{isVolunteer ? 'volunteers' : 'participants'}</span>
                </span>
              </div>

              {/* Spots Badge */}
              <div
                className={`px-3 py-1.5 text-sm font-semibold border-2 ${
                  isFull
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : availableSpots <= 3
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-green-100 text-green-700 border-green-300'
                }`}
              >
                {isFull ? 'Full' : `${availableSpots} spots left`}
              </div>
            </div>

            {/* Accessibility & Payment Indicators */}
            <div className="flex items-center gap-2 pt-3 flex-wrap">
              {activity.wheelchair_accessible && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-blue-300 bg-blue-50 text-blue-700 text-xs font-medium">
                  <Accessibility className="w-3.5 h-3.5" />
                  <span>Wheelchair Accessible</span>
                </div>
              )}
              {activity.wheelchair_accessible === false && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-gray-300 bg-gray-100 text-gray-600 text-xs font-medium">
                  <Accessibility className="w-3.5 h-3.5" />
                  <span>Not Wheelchair Accessible</span>
                </div>
              )}
              {activity.payment_required && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-amber-300 bg-amber-50 text-amber-700 text-xs font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Payment Required</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

SwipeableCard.displayName = 'SwipeableCard'
