import { useState, useEffect } from 'react'
import { Users, Mail, Phone, Download, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Card, { CardHeader, CardBody } from '../shared/Card'
import { staffApi } from '../../services/staff.api'

export default function ActivityAttendance({ activity, isOpen, onClose }) {
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && activity?.id) {
      fetchAttendance()
    }
  }, [isOpen, activity])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await staffApi.getActivityAttendance(activity.id)
      setAttendance(response.data)
    } catch (err) {
      console.error('Failed to fetch attendance:', err)
      setError('Failed to load attendance data')
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await staffApi.exportAttendanceCSV(activity.id)
      // Create download link
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_${activity.id}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Attendance exported successfully')
    } catch (err) {
      console.error('Failed to export attendance:', err)
      toast.error('Failed to export attendance')
    }
  }

  if (!activity) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Attendance: ${activity.title}`}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            <X className="w-4 h-4" />
            Close
          </Button>
          {attendance && !loading && (
            <Button variant="primary" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading attendance...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">
            {error}
          </div>
        ) : attendance ? (
          <>
            {/* Participants Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Participants ({attendance.participants.length})
              </h3>
              {attendance.participants.length === 0 ? (
                <p className="text-gray-500 text-sm">No participants registered yet</p>
              ) : (
                <div className="space-y-2">
                  {attendance.participants.map((participant) => (
                    <ContactCard key={participant.id} person={participant} role="Participant" />
                  ))}
                </div>
              )}
            </div>

            {/* Volunteers Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Volunteers ({attendance.volunteers.length})
              </h3>
              {attendance.volunteers.length === 0 ? (
                <p className="text-gray-500 text-sm">No volunteers assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {attendance.volunteers.map((volunteer) => (
                    <ContactCard key={volunteer.id} person={volunteer} role="Volunteer" />
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Total:</strong> {attendance.participants.length + attendance.volunteers.length} people
                ({attendance.participants.length} participants, {attendance.volunteers.length} volunteers)
              </p>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}

function ContactCard({ person, role }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{person.name || 'No name provided'}</p>
            <span className={`text-xs px-2 py-1 rounded ${
              role === 'Volunteer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {role}
            </span>
          </div>
          
          <div className="space-y-1">
            {person.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a 
                  href={`mailto:${person.email}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {person.email}
                </a>
              </div>
            )}
            
            {person.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href={`tel:${person.phone}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {person.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
