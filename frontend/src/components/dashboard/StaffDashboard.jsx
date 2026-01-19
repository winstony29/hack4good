import { useAuth } from '../../contexts/AuthContext'
import Card, { CardHeader, CardBody } from '../shared/Card'
import { TrendingUp, Users, Calendar, Award } from 'lucide-react'
import AnalyticsCharts from '../staff/AnalyticsCharts'
import { getDashboardMetrics } from '../../mocks/analytics.mock'

export default function StaffDashboard() {
  const { user } = useAuth()
  const metrics = getDashboardMetrics()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Staff Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Overview of all activities and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Calendar className="w-6 h-6" />}
          title="Total Activities"
          value={metrics.totalActivities.toString()}
          color="bg-blue-500"
        />
        <StatsCard
          icon={<Users className="w-6 h-6" />}
          title="Total Registrations"
          value={metrics.totalRegistrations.toString()}
          color="bg-green-500"
        />
        <StatsCard
          icon={<Award className="w-6 h-6" />}
          title="Active Volunteers"
          value={metrics.activeVolunteers.toString()}
          color="bg-purple-500"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Volunteer Coverage"
          value={`${metrics.volunteerCoverage}%`}
          color="bg-amber-500"
        />
      </div>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-900">
            Analytics & Trends
          </h2>
        </CardHeader>
        <CardBody>
          <AnalyticsCharts />
        </CardBody>
      </Card>

      {/* Activity Management */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-900">
            Manage Activities
          </h2>
        </CardHeader>
        <CardBody>
          {/* TODO: Implement ActivityManager */}
          <div className="py-12 text-center text-gray-500">
            Activity management interface will be displayed here
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function StatsCard({ icon, title, value, color }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className={`${color} text-white p-3 rounded-lg`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
