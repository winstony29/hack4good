import { useState } from 'react'
import toast from 'react-hot-toast'
import Input from '../shared/Input'
import Button from '../shared/Button'

const validateFullName = (name) => {
  if (!name || !name.trim()) return 'Full name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return ''
}

const validatePhone = (phone) => {
  if (!phone) return '' // Optional field
  const phoneRegex = /^\+?[0-9\s-]{8,}$/
  if (!phoneRegex.test(phone)) return 'Invalid phone format'
  return ''
}

export default function ProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    caregiver_phone: user?.user_metadata?.caregiver_phone || '',
    preferred_language: user?.user_metadata?.preferred_language || 'en',
    membership_type: user?.user_metadata?.membership_type || 'ad_hoc'
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const role = user?.user_metadata?.role

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'full_name':
        error = validateFullName(value)
        break
      case 'phone':
      case 'caregiver_phone':
        error = validatePhone(value)
        break
      default:
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const isFormValid = () => {
    const nameError = validateFullName(formData.full_name)
    const phoneError = validatePhone(formData.phone)
    const caregiverError = validatePhone(formData.caregiver_phone)
    return !nameError && !phoneError && !caregiverError
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    setTouched({ full_name: true, phone: true, caregiver_phone: true })
    const nameError = validateField('full_name', formData.full_name)
    const phoneError = validateField('phone', formData.phone)
    const caregiverError = validateField('caregiver_phone', formData.caregiver_phone)

    if (nameError || phoneError || caregiverError) {
      toast.error('Please fix the errors before saving')
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.full_name}
        touched={touched.full_name}
        required
      />

      <Input
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        touched={touched.phone}
        placeholder="+65 XXXX XXXX"
      />

      {role === 'participant' && (
        <Input
          label="Caregiver Phone"
          name="caregiver_phone"
          value={formData.caregiver_phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.caregiver_phone}
          touched={touched.caregiver_phone}
          placeholder="+65 XXXX XXXX"
          helperText="Optional: For activity notifications"
        />
      )}

      {role === 'participant' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Type
          </label>
          <select
            name="membership_type"
            value={formData.membership_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="ad_hoc">Ad-hoc</option>
            <option value="once_weekly">1x a week</option>
            <option value="twice_weekly">2x a week</option>
            <option value="3_plus">3x a week</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            How often do you plan to participate in activities?
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Language
        </label>
        <select
          name="preferred_language"
          value={formData.preferred_language}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="zh">Chinese</option>
          <option value="ms">Malay</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading} disabled={!isFormValid()}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
