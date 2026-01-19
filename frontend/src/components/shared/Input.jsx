import { AlertCircle, CheckCircle } from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export default function Input({
  label,
  error,
  touched,
  helperText,
  className = '',
  ...props
}) {
  const { reduceMotion } = useAccessibility()

  // Show error only when field has been touched
  const showError = touched && error
  // Show success state briefly when touched with no error
  const showSuccess = touched && !error

  return (
    <div
      className={`
        w-full
        ${!reduceMotion ? 'transition-transform duration-150 focus-within:scale-[1.01]' : ''}
      `}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full px-4 py-3 md:py-2 pr-10
            border ${showError ? 'border-red-500' : showSuccess ? 'border-green-500' : 'border-gray-300'}
            rounded-lg
            focus:ring-2 ${showError ? 'focus:ring-red-500' : 'focus:ring-primary-500'} focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${!reduceMotion ? 'transition-colors duration-200' : ''}
            ${className}
          `}
          {...props}
        />
        {showError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
        )}
        {showSuccess && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
      </div>
      {showError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
      {helperText && !showError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
