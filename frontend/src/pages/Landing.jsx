import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Button from '../components/shared/Button'
import { useAuth } from '../contexts/AuthContext'

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Gentle gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fef3c7 25%, #fce7f3 50%, #f3e8ff 75%, #dbeafe 100%)',
        }}
      />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-9xl sm:text-[10rem] md:text-[12rem] font-bold mb-8"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            MINDS
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-12 font-medium max-w-md mx-auto leading-relaxed">
            Connect with your community,<br />one activity at a time.
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <Link to="/auth?mode=login" className="w-full">
              <Button 
                size="large" 
                className="w-full bg-purple-400 hover:bg-purple-500 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Log In
              </Button>
            </Link>
            <Link to="/activities" className="w-full">
              <Button 
                size="large" 
                variant="outline" 
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-800 text-gray-800 shadow-md hover:shadow-lg transition-all"
              >
                Browse Activities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
