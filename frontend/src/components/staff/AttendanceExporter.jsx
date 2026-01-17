import { useState } from 'react'
import { staffApi } from '../../services/staff.api'
import Button from '../shared/Button'
import { Download } from 'lucide-react'

export default function AttendanceExporter({ activityId }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    try {
      setLoading(true)
      const response = await staffApi.exportAttendanceCSV(activityId)
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `attendance_${activityId}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="small"
      onClick={handleExport}
      loading={loading}
    >
      <Download className="w-4 h-4" />
      Export CSV
    </Button>
  )
}
