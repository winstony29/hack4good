import { useState } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import ActivityCard from './ActivityCard'
import TTSButton from '../accessibility/TTSButton'

export default function ActivityDetailModal({
  activity,
  isOpen,
  onClose,
  action = 'view', // 'view', 'register', 'match', 'edit'
  onConfirm
}) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm(activity)
      onClose()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionButton = () => {
    switch (action) {
      case 'register':
        return (
          <Button onClick={handleConfirm} loading={loading} variant="primary">
            Register for Activity
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
        {/* Activity Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-600">{activity.description}</p>
        </div>

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
