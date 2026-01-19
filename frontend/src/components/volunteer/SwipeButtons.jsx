import { motion } from 'framer-motion'
import { X, Heart, RotateCcw } from 'lucide-react'

export default function SwipeButtons({ onPass, onMatch, onUndo, disabled = false, canUndo = false }) {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.08 },
    tap: { scale: 0.92 }
  }

  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6">
      {/* Undo Button (smaller, optional) */}
      {canUndo && (
        <motion.button
          onClick={onUndo}
          disabled={disabled}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center
                     shadow-soft hover:shadow-lg
                     disabled:opacity-40 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                     transition-shadow duration-200"
          style={{
            border: '2px solid #e5e7eb'
          }}
          aria-label="Undo last action"
        >
          <RotateCcw className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Pass Button */}
      <motion.button
        onClick={onPass}
        disabled={disabled}
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full
                   flex items-center justify-center
                   disabled:opacity-40 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500
                   transition-shadow duration-200 overflow-hidden group"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fff5f3 100%)',
          boxShadow: '0 4px 20px -4px rgba(255, 107, 74, 0.25), 0 0 0 2px rgba(255, 107, 74, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
        }}
        aria-label="Pass on this activity"
      >
        {/* Gradient border effect on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(145deg, rgba(255, 107, 74, 0.15) 0%, rgba(240, 77, 46, 0.1) 100%)'
          }}
        />
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: '0 8px 30px -8px rgba(255, 107, 74, 0.5)'
          }}
        />
        <X
          className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 transition-colors duration-200"
          style={{ color: '#ff6b4a' }}
          strokeWidth={3}
        />
      </motion.button>

      {/* Match Button */}
      <motion.button
        onClick={onMatch}
        disabled={disabled}
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        className="relative w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full
                   flex items-center justify-center
                   disabled:opacity-40 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500
                   transition-all duration-200 overflow-hidden group"
        style={{
          background: 'linear-gradient(145deg, #78b37c 0%, #56965a 100%)',
          boxShadow: '0 8px 25px -6px rgba(86, 150, 90, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}
        aria-label="Volunteer for this activity"
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
          }}
        />
        {/* Glow pulse effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: '0 0 40px 8px rgba(86, 150, 90, 0.3)'
          }}
        />
        <Heart
          className="w-9 h-9 sm:w-10 sm:h-10 text-white relative z-10 drop-shadow-sm"
          fill="currentColor"
          strokeWidth={0}
        />
      </motion.button>

      {/* Pass Button (right side for symmetry when no undo) */}
      {!canUndo && (
        <motion.button
          onClick={onPass}
          disabled={disabled}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full
                     flex items-center justify-center
                     disabled:opacity-40 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500
                     transition-shadow duration-200 overflow-hidden group invisible"
          aria-hidden="true"
        >
          {/* Placeholder for layout balance */}
        </motion.button>
      )}
    </div>
  )
}
