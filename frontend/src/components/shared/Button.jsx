import Spinner from './Spinner'

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        flex items-center justify-center gap-2
        min-h-[44px]
      `}
      {...props}
    >
      {loading && <Spinner size="small" />}
      {children}
    </button>
  )
}
