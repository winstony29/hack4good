import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card, { CardHeader, CardBody } from '../shared/Card'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('browse')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.user_metadata?.full_name || 'Volunteer'}!
        </h1>
        <p className="text-gray-600 mt-2">Thank you for volunteering with MINDS</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'browse'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Browse Activities
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'calendar'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'matches'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            My Matches
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'browse' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900">
                Swipe to Match with Activities
              </h2>
            </CardHeader>
            <CardBody>
              {/* TODO: Implement ActivitySwiper */}
              <div className="py-12 text-center text-gray-500">
                Tinder-style activity swiper will be displayed here
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'calendar' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900">
                Activities Calendar
              </h2>
            </CardHeader>
            <CardBody>
              {/* TODO: Implement ActivityCalendar with mode="view" */}
              <div className="py-12 text-center text-gray-500">
                Activity calendar will be displayed here
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'matches' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900">
                My Volunteer Matches
              </h2>
            </CardHeader>
            <CardBody>
              {/* TODO: Implement RegistrationsList for matches */}
              <div className="py-12 text-center text-gray-500">
                Your volunteer matches will appear here
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
