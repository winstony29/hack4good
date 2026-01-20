export default function Badge({ children, variant = 'default', size = 'medium' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={`
        inline-flex items-center
        font-medium border border-gray-300
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  )
}
