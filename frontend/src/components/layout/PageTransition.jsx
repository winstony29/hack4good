import { motion } from 'framer-motion'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export default function PageTransition({ children }) {
  const { reduceMotion } = useAccessibility()

  const transition = reduceMotion
    ? { duration: 0.05 }
    : { duration: 0.2 }

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
