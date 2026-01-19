import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, X, Sparkles, Calendar, MapPin } from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { CONFETTI_COLORS } from '../../constants'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function MatchAnimation({ activity, isVisible, onClose }) {
  const { reduceMotion } = useAccessibility()

  // Fire celebratory confetti when animation becomes visible
  useEffect(() => {
    if (isVisible && !reduceMotion) {
      // Initial burst
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.5, x: 0.5 },
          colors: CONFETTI_COLORS,
          startVelocity: 35,
          gravity: 0.8,
          ticks: 100
        })
      }, 200)

      // Side bursts
      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: CONFETTI_COLORS
        })
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: CONFETTI_COLORS
        })
      }, 400)

      // Auto-dismiss after 3 seconds
      const dismissTimer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(dismissTimer)
      }
    }

    // Faster auto-dismiss for reduced motion
    if (isVisible && reduceMotion) {
      const dismissTimer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(dismissTimer)
    }
  }, [isVisible, onClose, reduceMotion])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const cardVariants = {
    hidden: {
      scale: reduceMotion ? 1 : 0.8,
      opacity: 0,
      y: reduceMotion ? 0 : 50
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0.1 }
        : { type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }
    },
    exit: {
      scale: reduceMotion ? 1 : 0.9,
      opacity: 0,
      transition: { duration: 0.15 }
    }
  }

  const heartVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: reduceMotion
        ? { duration: 0.1 }
        : { type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0.1 }
        : { delay: 0.3 + i * 0.1, duration: 0.4 }
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: reduceMotion ? 0.05 : 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={handleBackdropClick}
          style={{
            background: 'linear-gradient(180deg, rgba(86, 150, 90, 0.95) 0%, rgba(56, 98, 59, 0.98) 100%)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating hearts (only if motion allowed) */}
            {!reduceMotion && (
              <>
                <motion.div
                  className="absolute top-[15%] left-[10%]"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-12 h-12 text-white/20" fill="currentColor" />
                </motion.div>
                <motion.div
                  className="absolute top-[25%] right-[15%]"
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -15, 0],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Sparkles className="w-8 h-8 text-white/30" />
                </motion.div>
                <motion.div
                  className="absolute bottom-[20%] left-[20%]"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.2, 0.35, 0.2]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Heart className="w-6 h-6 text-white/20" fill="currentColor" />
                </motion.div>
              </>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 text-white/70 hover:text-white
                       hover:bg-white/10 rounded-2xl transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Main Content */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm"
          >
            {/* Heart Icon */}
            <motion.div
              variants={heartVariants}
              className="flex justify-center mb-6"
            >
              <div
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Heart
                  className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-lg"
                  fill="currentColor"
                  strokeWidth={0}
                />
                {/* Pulse ring animation */}
                {!reduceMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{
                      scale: [1, 1.3],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              custom={0}
              variants={textVariants}
              className="font-display font-bold text-4xl sm:text-5xl text-white text-center mb-2 tracking-tight"
              style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}
            >
              It's a Match!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              custom={1}
              variants={textVariants}
              className="text-white/80 text-lg text-center mb-6"
            >
              You signed up to volunteer for
            </motion.p>

            {/* Activity Card */}
            <motion.div
              custom={2}
              variants={textVariants}
              className="bg-white/15 backdrop-blur-sm rounded-3xl p-5 sm:p-6 mb-6"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                {activity?.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{activity && formatDate(activity.date)}</span>
                </div>
                {activity?.location && (
                  <div className="flex items-center gap-2.5 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{activity.location}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Keep Swiping Button */}
            <motion.button
              custom={3}
              variants={textVariants}
              onClick={onClose}
              whileHover={{ scale: reduceMotion ? 1 : 1.03 }}
              whileTap={{ scale: reduceMotion ? 1 : 0.97 }}
              className="w-full py-4 px-6 rounded-2xl font-display font-semibold text-lg
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
                color: '#38623b',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Keep Swiping
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
