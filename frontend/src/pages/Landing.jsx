import { Link } from 'react-router-dom'
import { Calendar, Users, Heart, TrendingUp } from 'lucide-react'
import Button from '../components/shared/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">MINDS</span> ActivityHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            An accessible, inclusive platform for managing activities for individuals 
            with intellectual disabilities
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="large" variant="primary">
                Get Started
              </Button>
            </Link>
            <Link to="/activities">
              <Button size="large" variant="outline">
                Browse Activities
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-primary-600" />}
            title="Easy Scheduling"
            description="Browse and register for activities with our intuitive calendar interface"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-primary-600" />}
            title="Volunteer Matching"
            description="Connect volunteers with activities through our Tinder-style swiper"
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-primary-600" />}
            title="Accessibility First"
            description="Text-to-speech, multi-language support, and high contrast modes"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-primary-600" />}
            title="Staff Analytics"
            description="Comprehensive reporting and attendance tracking for staff"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
