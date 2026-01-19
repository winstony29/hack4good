import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { registrationsApi } from '../../services/registrations.api'
import { matchesApi } from '../../services/matches.api'
import Card, { CardBody } from '../shared/Card'
import Badge from '../shared/Badge'
import Button from '../shared/Button'
import Spinner from '../shared/Spinner'
import EmptyState from '../shared/EmptyState'
import { formatDate, formatTime } from '../../utils/dateUtils'
import { Calendar, Clock, MapPin } from 'lucide-react'

export default function RegistrationsList({ type = 'registrations' }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [type, user])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const api = type === 'registrations' ? registrationsApi : matchesApi
      const response = await api.getByUser(user.id)
      setItems(response.data || [])
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="large" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={`No ${type} yet`}
        description={`You haven't ${type === 'registrations' ? 'registered for any activities' : 'matched with any activities'} yet.`}
      />
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardBody>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.activity.title}
                </h3>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.activity.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(item.activity.start_time)} - {formatTime(item.activity.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{item.activity.location}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant={item.status === 'confirmed' ? 'success' : 'warning'}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleCancel(item.id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return
    }

    try {
      const api = type === 'registrations' ? registrationsApi : matchesApi
      await api.cancel(id)
      // Refresh the list after cancellation
      fetchItems()
    } catch (error) {
      console.error('Failed to cancel:', error)
      alert('Failed to cancel. Please try again.')
    }
  }
}
