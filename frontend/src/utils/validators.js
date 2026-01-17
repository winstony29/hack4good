export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validatePhone = (phone) => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')
  
  // Check for Singapore format (8 digits) or E.164 format
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 10 && /^\+\d+$/.test(cleaned)
  }
  
  return cleaned.length === 8 && /^\d{8}$/.test(cleaned)
}

export const getPasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++
  
  if (strength <= 1) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
}

export const getValidationError = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required'
      if (!validateEmail(value)) return 'Invalid email address'
      return null
    
    case 'password':
      if (!value) return 'Password is required'
      if (!validatePassword(value)) return 'Password must be at least 6 characters'
      return null
    
    case 'phone':
      if (!value) return 'Phone number is required'
      if (!validatePhone(value)) return 'Invalid phone number'
      return null
    
    default:
      return null
  }
}
