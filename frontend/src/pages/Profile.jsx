import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/layout/Layout'
import Card, { CardHeader, CardBody } from '../components/shared/Card'
import { getRoleLabel, getRoleColor } from '../utils/roleUtils'
import Badge from '../components/shared/Badge'

export default function Profile() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Badge variant="primary">
                  {getRoleLabel(user?.user_metadata?.role)}
                </Badge>
              </div>

              {user?.user_metadata?.full_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.user_metadata.full_name}
                  </p>
                </div>
              )}

              {user?.user_metadata?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.user_metadata.phone}
                  </p>
                </div>
              )}

              {/* TODO: Add edit profile functionality */}
              <div className="pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Profile editing coming soon...
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}
