import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm'
import Card, { CardBody } from '../components/shared/Card'

export default function Auth() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              MINDS ActivityHub
            </h1>
          </Link>
        </div>

        <Card>
          <CardBody>
            {/* Tab Switcher */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`
                  flex-1 py-3 text-center font-medium transition-colors
                  ${mode === 'login'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`
                  flex-1 py-3 text-center font-medium transition-colors
                  ${mode === 'signup'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                Sign Up
              </button>
            </div>

            <AuthForm mode={mode} />
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
