import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../shared/Input'
import Button from '../shared/Button'

// Validation functions
const validateTitle = (title) => {
  if (!title) return 'Title is required'
  if (title.length > 100) return 'Title must be 100 characters or less'
  return ''
}

const validateDescription = (description) => {
  if (!description) return 'Description is required'
  return ''
}

const validateDate = (date) => {
  if (!date) return 'Date is required'
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selectedDate < today) return 'Date must be today or in the future'
  return ''
}

const validateStartTime = (startTime) => {
  if (!startTime) return 'Start time is required'
  return ''
}

const validateEndTime = (endTime, startTime) => {
  if (!endTime) return 'End time is required'
  if (startTime && endTime <= startTime) return 'End time must be after start time'
  return ''
}

const validateMaxCapacity = (capacity) => {
  if (!capacity) return 'Maximum capacity is required'
  if (capacity < 1) return 'Capacity must be at least 1'
  return ''
}

const validateLocation = (location) => {
  if (!location) return 'Location is required'
  return ''
}

export default function ActivityForm({ activity, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(activity || {
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_capacity: 20,
    program_type: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (name, value, otherFields = formData) => {
    let error = ''
    switch (name) {
      case 'title':
        error = validateTitle(value)
        break
      case 'description':
        error = validateDescription(value)
        break
      case 'date':
        error = validateDate(value)
        break
      case 'start_time':
        error = validateStartTime(value)
        break
      case 'end_time':
        error = validateEndTime(value, otherFields.start_time)
        break
      case 'max_capacity':
        error = validateMaxCapacity(value)
        break
      case 'location':
        error = validateLocation(value)
        break
      default:
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    // Re-validate on change if field has been touched
    if (touched[name]) {
      validateField(name, value, newFormData)
    }
    // Re-validate end_time when start_time changes
    if (name === 'start_time' && touched.end_time) {
      validateField('end_time', formData.end_time, newFormData)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      toast.success(activity ? 'Activity updated successfully!' : 'Activity created successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to save activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorCount > 1 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-800">
            Please fix {errorCount} errors before submitting
          </p>
        </div>
      )}

      <Input
        label="Activity Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent
            ${touched.description && errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'}`}
          required
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.date}
          touched={touched.date}
          required
        />

        <Input
          label="Program Type"
          name="program_type"
          value={formData.program_type}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Time"
          name="start_time"
          type="time"
          value={formData.start_time}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.start_time}
          touched={touched.start_time}
          required
        />

        <Input
          label="End Time"
          name="end_time"
          type="time"
          value={formData.end_time}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.end_time}
          touched={touched.end_time}
          required
        />
      </div>

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.location}
        touched={touched.location}
        required
      />

      <Input
        label="Maximum Capacity"
        name="max_capacity"
        type="number"
        min="1"
        value={formData.max_capacity}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.max_capacity}
        touched={touched.max_capacity}
        required
      />

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {activity ? 'Update Activity' : 'Create Activity'}
        </Button>
      </div>
    </form>
  )
}
