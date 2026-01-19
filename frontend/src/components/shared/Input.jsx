import { useAccessibility } from '../../contexts/AccessibilityContext'

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}) {
  const { reduceMotion } = useAccessibility()

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
      <input
        className={`
          w-full px-4 py-2
          border ${error ? 'border-red-500' : 'border-gray-300'}
          rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
