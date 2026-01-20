import { motion } from 'framer-motion'
import Spinner from './Spinner'
import { useAccessibility } from '../../contexts/AccessibilityContext'

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
  const { reduceMotion } = useAccessibility()

  const variants = {
    primary: 'bg-minds-coral hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-minds-teal hover:bg-secondary-600 text-white shadow-md hover:shadow-lg',
    outline: 'bg-white border-2 border-minds-coral text-minds-coral hover:bg-primary-50',
    ghost: 'bg-transparent hover:bg-gray-100 text-minds-charcoal',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-minds-success hover:bg-green-600 text-white',
  }

  const sizes = {
    sm: 'px-4 py-2.5 text-sm min-h-[44px]',
    small: 'px-4 py-2.5 text-sm min-h-[44px]',
    medium: 'px-5 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[56px]',
  }

  // Motion config - instant transitions when reduceMotion is enabled
  const transition = reduceMotion
    ? { type: 'tween', duration: 0.01 }
    : { type: 'spring', stiffness: 400, damping: 25 }

  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled && !reduceMotion ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      transition={transition}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-semibold
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-minds-coral
        flex items-center justify-center gap-2
      `}
      {...props}
    >
      {loading && <Spinner size="small" />}
      {children}
    </motion.button>
  )
}
