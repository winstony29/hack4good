import { useAuth } from '../../contexts/AuthContext'
import { ROLES } from '../../utils/constants'
import ParticipantDashboard from './ParticipantDashboard'
import VolunteerDashboard from './VolunteerDashboard'
import StaffDashboard from './StaffDashboard'
import Spinner from '../shared/Spinner'

export default function DashboardContainer() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="large" />
      </div>
    )
  }

  const role = user?.user_metadata?.role

  switch (role) {
    case ROLES.PARTICIPANT:
      return <ParticipantDashboard />
    case ROLES.VOLUNTEER:
      return <VolunteerDashboard />
    case ROLES.STAFF:
      return <StaffDashboard />
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Unknown role. Please contact support.</p>
        </div>
      )
  }
}
