import { useAccessibility } from '../../contexts/AccessibilityContext'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import { LANGUAGES, LANGUAGE_LABELS } from '../../utils/constants'

export default function AccessibilityMenu({ isOpen, onClose }) {
  const {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    language,
    setLanguage,
    reduceMotion,
    setReduceMotion
  } = useAccessibility()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility Settings"
      size="medium"
    >
      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Font Size
          </label>
          <div className="flex gap-3">
            <Button
              variant={fontSize === 'small' ? 'primary' : 'outline'}
              onClick={() => setFontSize('small')}
            >
              A-
            </Button>
            <Button
              variant={fontSize === 'medium' ? 'primary' : 'outline'}
              onClick={() => setFontSize('medium')}
            >
              A
            </Button>
            <Button
              variant={fontSize === 'large' ? 'primary' : 'outline'}
              onClick={() => setFontSize('large')}
            >
              A+
            </Button>
          </div>
        </div>

        {/* High Contrast */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            High Contrast Mode
          </label>
          <div className="flex gap-3">
            <Button
              variant={contrast === 'normal' ? 'primary' : 'outline'}
              onClick={() => setContrast('normal')}
            >
              Normal
            </Button>
            <Button
              variant={contrast === 'high' ? 'primary' : 'outline'}
              onClick={() => setContrast('high')}
            >
              High Contrast
            </Button>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(LANGUAGES).map(([key, value]) => (
              <option key={value} value={value}>
                {LANGUAGE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Reduce Motion
          </label>
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
              ${reduceMotion ? 'bg-primary-600' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
    </Modal>
  )
}
