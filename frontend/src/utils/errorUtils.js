import toast from 'react-hot-toast'

/**
 * Extract a user-friendly error message from various error formats
 * and add recovery hints based on HTTP status codes
 *
 * @param {Error|Object} error - The error object (axios error or generic Error)
 * @param {string} context - The context of the operation (e.g., 'activity', 'registration')
 * @returns {string} User-friendly error message with recovery hint
 */
export function getErrorMessage(error, context = 'operation') {
  // Extract message from various error formats
  const message = error.response?.data?.detail
    || error.response?.data?.message
    || error.message
    || 'An unexpected error occurred'

  // Add recovery hints based on status code
  const status = error.response?.status

  if (status === 401) {
    return 'Your session has expired. Please log in again.'
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }
  if (status === 404) {
    return `The requested ${context} was not found.`
  }
  if (status === 422) {
    return 'Invalid data provided. Please check your input.'
  }
  if (status >= 500) {
    return 'Server error. Please try again in a few moments.'
  }
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'No internet connection. Please check your network.'
  }

  return message
}

/**
 * Show a toast error with a user-friendly message
 *
 * @param {Error|Object} error - The error object
 * @param {string} context - The context of the operation
 */
export function showErrorToast(error, context = 'operation') {
  toast.error(getErrorMessage(error, context))
}

/**
 * Show a toast with success message
 *
 * @param {string} message - Success message to display
 */
export function showSuccessToast(message) {
  toast.success(message)
}
