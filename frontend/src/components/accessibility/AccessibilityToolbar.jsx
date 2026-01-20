import { useState, useEffect, useRef } from 'react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import {
  Accessibility,
  Type,
  Sun,
  Moon,
  Zap,
  ZapOff,
  X,
  Minus,
  Plus
} from 'lucide-react'

export default function AccessibilityToolbar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const toolbarRef = useRef(null)

  const {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    reduceMotion,
    setReduceMotion
  } = useAccessibility()

  // Handle escape key to close toolbar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  const toggleToolbar = () => setIsExpanded(!isExpanded)

  const cycleFontSize = (direction) => {
    const sizes = ['small', 'medium', 'large']
    const currentIndex = sizes.indexOf(fontSize)

    if (direction === 'up' && currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1])
    } else if (direction === 'down' && currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1])
    }
  }

  const toggleContrast = () => {
    setContrast(contrast === 'normal' ? 'high' : 'normal')
  }

  const toggleMotion = () => {
    setReduceMotion(!reduceMotion)
  }

  // Button base styles - 48px minimum touch target
  const buttonBase = `
    w-12 h-12 min-w-[48px] min-h-[48px]
    flex items-center justify-center
    rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-minds-coral
  `

  const activeButton = `${buttonBase} bg-white/30 text-white`
  const inactiveButton = `${buttonBase} bg-transparent text-white/80 hover:bg-white/20 hover:text-white`

  return (
    <div
      ref={toolbarRef}
      className="fixed bottom-6 right-6 z-50"
      role="toolbar"
      aria-label="Accessibility controls"
    >
      {/* Collapsed state - single button */}
      {!isExpanded && (
        <button
          onClick={toggleToolbar}
          className={`
            w-14 h-14 min-w-[56px] min-h-[56px]
            flex items-center justify-center
            bg-minds-coral text-white
            rounded-full shadow-lg
            transition-all duration-200
            hover:scale-105 hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-minds-coral focus:ring-offset-2
          `}
          aria-label="Open accessibility toolbar"
          aria-expanded={isExpanded}
        >
          <Accessibility className="w-6 h-6" />
        </button>
      )}

      {/* Expanded state - toolbar with controls */}
      {isExpanded && (
        <div
          className={`
            flex items-center gap-2 p-2
            bg-minds-coral
            rounded-2xl shadow-lg
            transition-all duration-200
          `}
        >
          {/* Text size controls */}
          <div className="flex items-center gap-1 px-2 border-r border-white/30">
            <span className="sr-only">Text size controls</span>
            <button
              onClick={() => cycleFontSize('down')}
              className={fontSize === 'small' ? activeButton : inactiveButton}
              aria-label="Decrease text size"
              aria-pressed={fontSize === 'small'}
              disabled={fontSize === 'small'}
            >
              <span className="flex items-center">
                <Type className="w-4 h-4" />
                <Minus className="w-3 h-3 -ml-1" />
              </span>
            </button>

            <button
              onClick={() => setFontSize('medium')}
              className={fontSize === 'medium' ? activeButton : inactiveButton}
              aria-label="Medium text size"
              aria-pressed={fontSize === 'medium'}
            >
              <Type className="w-5 h-5" />
            </button>

            <button
              onClick={() => cycleFontSize('up')}
              className={fontSize === 'large' ? activeButton : inactiveButton}
              aria-label="Increase text size"
              aria-pressed={fontSize === 'large'}
              disabled={fontSize === 'large'}
            >
              <span className="flex items-center">
                <Type className="w-5 h-5" />
                <Plus className="w-3 h-3 -ml-1" />
              </span>
            </button>
          </div>

          {/* High contrast toggle */}
          <button
            onClick={toggleContrast}
            className={contrast === 'high' ? activeButton : inactiveButton}
            aria-label={contrast === 'high' ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            aria-pressed={contrast === 'high'}
          >
            {contrast === 'high' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Reduce motion toggle */}
          <button
            onClick={toggleMotion}
            className={reduceMotion ? activeButton : inactiveButton}
            aria-label={reduceMotion ? 'Enable animations' : 'Reduce motion'}
            aria-pressed={reduceMotion}
          >
            {reduceMotion ? (
              <ZapOff className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </button>

          {/* Close button */}
          <div className="pl-2 border-l border-white/30">
            <button
              onClick={toggleToolbar}
              className={inactiveButton}
              aria-label="Close accessibility toolbar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
