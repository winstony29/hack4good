import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/layout/Layout'
import Card, { CardHeader, CardBody } from '../components/shared/Card'
import { getRoleLabel } from '../utils/roleUtils'
import Badge from '../components/shared/Badge'
import Button from '../components/shared/Button'
import ProfileForm from '../components/profile/ProfileForm'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (formData) => {
    await updateUser(formData)
    setIsEditing(false)
  }

  const role = user?.user_metadata?.role
  const membershipType = user?.user_metadata?.membership_type

  const getMembershipLabel = (type) => {
    const labels = {
      'ad_hoc': 'Ad-hoc',
      'once_weekly': '1x a week',
      'twice_weekly': '2x a week',
      '3_plus': '3x a week'
    }
    return labels[type] || type || 'Not set'
  }

  return (
    <Layout>
      {/* Page background with gradient mesh */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fef3c7 25%, #fce7f3 50%, #f3e8ff 75%, #dbeafe 100%)',
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1
                className="text-4xl sm:text-5xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Profile
              </h1>
              {!isEditing && (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {isEditing ? (
              <ProfileForm
                user={user}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
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
                    {getRoleLabel(role)}
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

                {role === 'participant' && user?.user_metadata?.caregiver_phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Caregiver Phone
                    </label>
                    <p className="text-lg text-gray-900">
                      {user.user_metadata.caregiver_phone}
                    </p>
                  </div>
                )}

                {role === 'participant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Membership Type
                    </label>
                    <p className="text-lg text-gray-900">
                      {getMembershipLabel(membershipType)}
                    </p>
                  </div>
                )}

                {user?.user_metadata?.preferred_language && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Language
                    </label>
                    <p className="text-lg text-gray-900">
                      {{
                        'en': 'English',
                        'zh': 'Chinese',
                        'ms': 'Malay',
                        'ta': 'Tamil'
                      }[user.user_metadata.preferred_language] || user.user_metadata.preferred_language}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}
