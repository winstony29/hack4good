import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import ActivitySwiper from '../components/volunteer/ActivitySwiper'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ROLES } from '../utils/constants'

export default function Swiper() {
  const { user } = useAuth()
  const userRole = user?.user_metadata?.role || ROLES.PARTICIPANT
  const isVolunteer = userRole === ROLES.VOLUNTEER

  const handleMatch = (activity) => {
    // Match notification is handled by ActivitySwiper component
  }

  // Dynamic content based on user role
  const pageTitle = 'Find Activities'
  const pageDescription = isVolunteer
    ? 'Swipe through volunteer opportunities and find your perfect match'
    : 'Swipe through activities and register with one swipe'
  const rightSwipeLabel = isVolunteer ? 'Match' : 'Register'

  // Dynamic gradient based on role
  const backgroundGradient = isVolunteer
    ? 'radial-gradient(ellipse at 20% 0%, rgba(255, 212, 203, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(206, 229, 207, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(224, 233, 255, 0.15) 0%, transparent 40%)'
    : 'radial-gradient(ellipse at 20% 0%, rgba(191, 219, 254, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(196, 181, 253, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(224, 233, 255, 0.15) 0%, transparent 40%)'

  return (
    <Layout>
      {/* Page Background with Pastel Gradient */}
      <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        {/* Background gradient mesh - matching landing page */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #fef3c7 25%, #fce7f3 50%, #f3e8ff 75%, #dbeafe 100%)',
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-6 sm:py-8 md:py-10 px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1
              className="font-display font-bold text-5xl sm:text-6xl mb-3"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {pageTitle}
            </h1>
            <p className="text-gray-700 text-lg font-medium max-w-md mx-auto">
              {pageDescription}
            </p>

            {/* Swipe Instructions */}
            <div className="flex items-center justify-center gap-8 mt-6 text-base text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-100 border-2 border-red-300 flex items-center justify-center shadow-md">
                  <ArrowLeft className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-semibold">Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 border-2 border-purple-300 flex items-center justify-center shadow-md">
                  <ArrowRight className="w-5 h-5 text-purple-500" />
                </div>
                <span className="font-semibold">{rightSwipeLabel}</span>
              </div>
            </div>
          </motion.div>

          {/* Swiper Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ActivitySwiper onMatch={handleMatch} userRole={userRole} />
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
