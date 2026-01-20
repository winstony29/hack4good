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
        <label className="block text-sm font-semibold text-minds-charcoal mb-2">
          {label}
          {props.required && <span className="text-minds-coral ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full px-4 py-3 min-h-[48px]
            bg-white
            border-2 ${showError ? 'border-red-500' : showSuccess ? 'border-minds-success' : 'border-minds-border'}
            rounded-xl
            text-minds-charcoal placeholder:text-minds-gray
            focus:ring-2 ${showError ? 'focus:ring-red-500' : 'focus:ring-minds-coral'} focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${!reduceMotion ? 'transition-all duration-200' : ''}
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
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      {helperText && !showError && (
        <p className="mt-2 text-sm text-minds-gray">{helperText}</p>
      )}
    </div>
  )
}
