import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import Card, { CardBody } from '../components/shared/Card'

export default function Auth() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Gentle gradient background matching landing page */}
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

      <div className="max-w-md w-full relative z-10">
        {/* Logo with gradient text */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1
              className="text-6xl sm:text-7xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MINDS
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              ActivityHub
            </p>
          </Link>
        </div>

        <Card className="backdrop-blur-sm bg-white/90">
          <CardBody className="p-8">
            {/* Tab Switcher with gradient accents */}
            <div className="flex border-b-2 border-gray-100 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`
                  flex-1 py-3 text-center font-semibold text-lg transition-all duration-200
                  ${mode === 'login'
                    ? 'text-transparent bg-clip-text border-b-3'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
                style={mode === 'login' ? {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  borderBottom: '3px solid #8b5cf6'
                } : {}}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`
                  flex-1 py-3 text-center font-semibold text-lg transition-all duration-200
                  ${mode === 'signup'
                    ? 'text-transparent bg-clip-text border-b-3'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
                style={mode === 'signup' ? {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  borderBottom: '3px solid #8b5cf6'
                } : {}}
              >
                Sign Up
              </button>
            </div>

            <AuthForm mode={mode} />
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-base text-gray-700 font-medium">
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
