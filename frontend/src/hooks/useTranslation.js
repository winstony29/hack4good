import { useCallback } from 'react'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { getTranslation } from '../utils/translations'

/**
 * Hook for translating UI strings based on current language setting
 * 
 * @returns {Object} - { t: translation function, language: current language }
 * 
 * @example
 * const { t } = useTranslation()
 * return <h1>{t('landing.welcome')}</h1>
 */
export function useTranslation() {
  const { language } = useAccessibility()

  const t = useCallback((key) => {
    return getTranslation(key, language)
  }, [language])

  return { t, language }
}

export default useTranslation
