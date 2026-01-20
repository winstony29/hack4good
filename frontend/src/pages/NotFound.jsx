import { Link } from 'react-router-dom'
import Button from '../components/shared/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
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

      <div className="text-center relative z-10">
        <h1
          className="text-9xl sm:text-[12rem] font-bold"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-700 text-lg font-medium mt-3 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
