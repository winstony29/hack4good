import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import ActivitySwiper from '../components/volunteer/ActivitySwiper'
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react'

export default function Swiper() {
  const handleMatch = (activity) => {
    // Match notification is handled by ActivitySwiper component
  }

  return (
    <Layout>
      {/* Page Background with Mesh Gradient */}
      <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        {/* Background gradient mesh */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 20% 0%, rgba(255, 212, 203, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(206, 229, 207, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(224, 233, 255, 0.15) 0%, transparent 40%)'
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
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-2">
              Find Activities
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Swipe through volunteer opportunities and find your perfect match
            </p>

            {/* Swipe Instructions */}
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-coral-50 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-coral-400" />
                </div>
                <span>Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-sage-500" />
                </div>
                <span>Match</span>
              </div>
            </div>
          </motion.div>

          {/* Swiper Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ActivitySwiper onMatch={handleMatch} />
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
