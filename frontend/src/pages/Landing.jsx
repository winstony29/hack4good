import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Calendar, Users, Heart, TrendingUp } from 'lucide-react'
import Button from '../components/shared/Button'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('landing.welcome')} <span className="text-primary-600">{t('landing.appName')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="large" variant="primary">
                {t('landing.getStarted')}
              </Button>
            </Link>
            <Link to="/activities">
              <Button size="large" variant="outline">
                {t('landing.browseActivities')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-primary-600" />}
            title={t('landing.easyScheduling')}
            description={t('landing.easySchedulingDesc')}
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-primary-600" />}
            title={t('landing.volunteerMatching')}
            description={t('landing.volunteerMatchingDesc')}
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-primary-600" />}
            title={t('landing.accessibilityFirst')}
            description={t('landing.accessibilityFirstDesc')}
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-primary-600" />}
            title={t('landing.staffAnalytics')}
            description={t('landing.staffAnalyticsDesc')}
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200">
      <div className="mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
