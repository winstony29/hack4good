import { useState, useEffect } from 'react'
import { activitiesApi } from '../../services/activities.api'
import ActivityForm from '../activities/ActivityForm'
import ActivityCard from '../activities/ActivityCard'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import EmptyState from '../shared/EmptyState'
import { Plus } from 'lucide-react'

export default function ActivityManager() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await activitiesApi.getAll()
      setActivities(response.data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await activitiesApi.create(data)
      await fetchActivities()
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create activity:', error)
    }
  }

  const handleUpdate = async (data) => {
    try {
      await activitiesApi.update(editingActivity.id, data)
      await fetchActivities()
      setEditingActivity(null)
    } catch (error) {
      console.error('Failed to update activity:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Manage Activities
        </h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Create Activity
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : activities.length === 0 ? (
        <EmptyState
          title="No activities yet"
          description="Create your first activity to get started"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" />
              Create Activity
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => setEditingActivity(activity)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Create Activity"
        size="large"
      >
        <ActivityForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        title="Edit Activity"
        size="large"
      >
        {editingActivity && (
          <ActivityForm
            activity={editingActivity}
            onSubmit={handleUpdate}
            onCancel={() => setEditingActivity(null)}
          />
        )}
      </Modal>
    </div>
  )
}
