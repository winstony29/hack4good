import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import ActivityCard from './ActivityCard'
import TTSButton from '../accessibility/TTSButton'
import { useAuth } from '../../contexts/AuthContext'
import { registrationsApi } from '../../services/registrations.api'
import { 
  validateRegistration, 
  formatValidationMessage,
  getMembershipDisplayName 
} from '../../utils/activityUtils'

export default function ActivityDetailModal({
  activity,
  isOpen,
  onClose,
  action = 'view', // 'view', 'register', 'match', 'edit'
  onConfirm,
  userRegistrations = [] // User's existing registrations for conflict checking
}) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && action === 'register' && user && activity) {
      // Validate registration when modal opens
      const result = validateRegistration(activity, user.user_metadata || {}, userRegistrations)
      setValidationResult(result)
    }
  }, [isOpen, action, user, activity, userRegistrations])

  const handleConfirm = async () => {
    if (action === 'register' && validationResult && !validationResult.valid) {
      setError('Cannot register due to validation errors')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      if (action === 'register') {
        // Register for activity
        await registrationsApi.create({
          activity_id: activity.id,
          status: 'confirmed'
        })
      }
      
      // Call parent callback
      if (onConfirm) {
        await onConfirm(activity)
      }
      
      onClose()
    } catch (err) {
      console.error('Action failed:', err)
      setError(err.response?.data?.detail || err.message || 'Action failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getActionButton = () => {
    switch (action) {
      case 'register':
        const isDisabled = validationResult && !validationResult.valid
        return (
          <Button 
            onClick={handleConfirm} 
            loading={loading} 
            variant={isDisabled ? 'secondary' : 'primary'}
            disabled={isDisabled}
          >
            {isDisabled ? 'Cannot Register' : 'Confirm Registration'}
          </Button>
        )
      case 'match':
        return (
          <Button onClick={handleConfirm} loading={loading} variant="success">
            Volunteer for Activity
          </Button>
        )
      case 'edit':
        return (
          <Button onClick={handleConfirm} loading={loading} variant="primary">
            Save Changes
          </Button>
        )
      default:
        return null
    }
  }

  if (!activity) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity.title}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {getActionButton()}
        </>
      }
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Validation Messages */}
        {action === 'register' && validationResult && (
          <>
            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      Cannot register for this activity:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationResult.errors.map((error, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 mb-2">
                      Please note:
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validationResult.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {validationResult.valid && validationResult.warnings.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      You can register for this activity
                    </p>
                    {user?.user_metadata?.membership_type && (
                      <p className="text-sm text-green-700 mt-1">
                        Membership: {getMembershipDisplayName(user.user_metadata.membership_type)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Activity Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-600 whitespace-pre-wrap">{activity.description}</p>
        </div>

        {/* Additional Info */}
        {activity.program_type && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Program Type
            </h3>
            <p className="text-gray-600">{activity.program_type}</p>
          </div>
        )}

        {/* TTS Button */}
        <div className="flex justify-end">
          <TTSButton text={`${activity.title}. ${activity.description}`} />
        </div>

        {/* Activity Info Card */}
        <ActivityCard activity={activity} showCapacity={true} />
      </div>
    </Modal>
  )
}
