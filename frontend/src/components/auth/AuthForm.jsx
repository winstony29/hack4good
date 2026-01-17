import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { ROLES, MEMBERSHIP_TYPES, MEMBERSHIP_LABELS } from '../../utils/constants'
import Button from '../shared/Button'
import Input from '../shared/Input'

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
    phone: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
          preferred_language: 'en'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value={ROLES.PARTICIPANT}>Participant</option>
              <option value={ROLES.VOLUNTEER}>Volunteer</option>
              <option value={ROLES.STAFF}>Staff</option>
            </select>
          </div>

          {formData.role === ROLES.PARTICIPANT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Type
              </label>
              <select
                name="membership_type"
                value={formData.membership_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {Object.entries(MEMBERSHIP_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {MEMBERSHIP_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
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
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  )
}
