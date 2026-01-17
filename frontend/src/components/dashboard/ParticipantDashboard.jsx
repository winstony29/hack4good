import { useAuth } from '../../contexts/AuthContext'
import Card, { CardHeader, CardBody } from '../shared/Card'

export default function ParticipantDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.user_metadata?.full_name || 'Participant'}!
        </h1>
        <p className="text-gray-600 mt-2">Here's your activity overview</p>
      </div>

      {/* Activity Calendar */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-900">
            Browse Activities
          </h2>
        </CardHeader>
        <CardBody>
          {/* TODO: Implement ActivityCalendar with mode="select" */}
          <div className="py-12 text-center text-gray-500">
            Activity calendar will be displayed here
          </div>
        </CardBody>
      </Card>

      {/* My Registrations */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-900">
            My Registrations
          </h2>
        </CardHeader>
        <CardBody>
          {/* TODO: Implement RegistrationsList */}
          <div className="py-12 text-center text-gray-500">
            Your registered activities will appear here
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
