import { X, Heart } from 'lucide-react'

export default function SwipeButtons({ onPass, onMatch, disabled = false }) {
  return (
    <div className="flex justify-center gap-8">
      {/* Pass Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-2 border-red-400 text-red-500
                   flex items-center justify-center shadow-lg
                   hover:bg-red-50 hover:border-red-500 hover:scale-110
                   active:scale-95 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-4 focus:ring-red-200"
        aria-label="Pass on this activity"
      >
        <X className="w-8 h-8" strokeWidth={3} />
      </button>

      {/* Match Button */}
      <button
        onClick={onMatch}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-2 border-green-400 text-green-500
                   flex items-center justify-center shadow-lg
                   hover:bg-green-50 hover:border-green-500 hover:scale-110
                   active:scale-95 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-4 focus:ring-green-200"
        aria-label="Volunteer for this activity"
      >
        <Heart className="w-8 h-8" fill="currentColor" />
      </button>
    </div>
  )
}
