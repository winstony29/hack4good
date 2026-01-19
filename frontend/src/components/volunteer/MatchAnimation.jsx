import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, X } from 'lucide-react'

export default function MatchAnimation({ activity, isVisible, onClose }) {
  // Fire confetti when animation becomes visible
  useEffect(() => {
    if (isVisible) {
      // Delay confetti slightly for dramatic effect
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#16a34a', '#4ade80', '#86efac']
        })
      }, 300)

      // Auto-dismiss after 2.5 seconds
      const dismissTimer = setTimeout(() => {
        onClose()
      }, 2500)

      return () => {
        clearTimeout(timer)
        clearTimeout(dismissTimer)
      }
    }
  }, [isVisible, onClose])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Content */}
          <div className="text-center px-4">
            {/* Heart icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <Heart className="w-12 h-12 text-white" fill="white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2"
            >
              It's a Match!
            </motion.h2>

            {/* Activity info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-white/80 text-lg">You signed up for</p>
              <p className="text-white text-xl font-semibold mt-1">
                {activity?.title}
              </p>
            </motion.div>

            {/* Keep swiping button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={onClose}
              className="px-8 py-3 bg-white text-green-600 font-semibold rounded-full
                         hover:bg-green-50 transition-colors shadow-lg"
            >
              Keep Swiping
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
