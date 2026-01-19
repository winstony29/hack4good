import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { ROLES, MEMBERSHIP_TYPES, MEMBERSHIP_LABELS } from '../../utils/constants'
import Button from '../shared/Button'
import Input from '../shared/Input'

// Validation functions
const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return ''
}

const validateFullName = (name) => {
  if (!name) return 'Full name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return ''
}

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLES.PARTICIPANT,
    membership_type: MEMBERSHIP_TYPES.AD_HOC,
    full_name: '',
    phone: '',
    wheelchair_required: false
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        break
      case 'full_name':
        error = validateFullName(value)
        break
      default:
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const isFormValid = () => {
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    if (mode === 'signup') {
      const nameError = validateFullName(formData.full_name)
      return !emailError && !passwordError && !nameError
    }
    return !emailError && !passwordError
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        const userData = {
          role: formData.role,
          membership_type: formData.role === ROLES.PARTICIPANT ? formData.membership_type : null,
          full_name: formData.full_name,
          phone: formData.phone,
          preferred_language: 'en',
          wheelchair_required: formData.role === ROLES.PARTICIPANT ? formData.wheelchair_required : false
        }
        await signup(formData.email, formData.password, userData)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'signup' && (
        <>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value={ROLES.PARTICIPANT}>Participant</option>
              <option value={ROLES.VOLUNTEER}>Volunteer</option>
              <option value={ROLES.STAFF}>Staff</option>
            </select>
          </div>

          {formData.role === ROLES.PARTICIPANT && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type
                </label>
                <select
                  name="membership_type"
                  value={formData.membership_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {Object.entries(MEMBERSHIP_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {MEMBERSHIP_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="wheelchair_required"
                    name="wheelchair_required"
                    type="checkbox"
                    checked={formData.wheelchair_required}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="wheelchair_required" className="text-sm font-medium text-gray-700">
                    Wheelchair accessible facilities required
                  </label>
                  <p className="text-xs text-gray-500">
                    Check this if you require wheelchair accessible venues
                  </p>
                </div>
              </div>
            </>
          )}

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+65 XXXX XXXX"
          />
        </>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
        required
        minLength={6}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={!isFormValid()}
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  )
}
