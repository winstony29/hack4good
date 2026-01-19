import { useState } from 'react'
import { motion } from 'framer-motion'
import { staffApi } from '../../services/staff.api'
import { Download, FileSpreadsheet, Check, Loader2 } from 'lucide-react'

export default function AttendanceExporter({ activityId, activityTitle }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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

      // Show success state briefly
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
        transition-all duration-300
        disabled:cursor-not-allowed
        ${success
          ? 'bg-sage-100 text-sage-700 border border-sage-200'
          : 'bg-white text-navy-700 border border-navy-200 hover:border-navy-300 hover:bg-navy-50'
        }
      `}
      style={{
        boxShadow: success
          ? '0 2px 8px -2px rgba(86, 150, 90, 0.2)'
          : '0 2px 8px -2px rgba(30, 27, 75, 0.08)'
      }}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : success ? (
        <>
          <Check className="w-4 h-4" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </>
      )}
    </motion.button>
  )
}
