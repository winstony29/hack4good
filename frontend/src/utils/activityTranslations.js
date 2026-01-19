/**
 * Utility functions for getting translated activity content
 */

/**
 * Get the translated title for an activity based on language
 * Falls back to English title if translation not available
 * 
 * @param {Object} activity - Activity object with title and title_* fields
 * @param {string} language - Language code (en, zh, ms, ta)
 * @returns {string} - Translated title
 */
export function getActivityTitle(activity, language) {
  if (!activity) return ''
  if (language === 'en') return activity.title
  
  const translatedTitle = activity[`title_${language}`]
  return translatedTitle || activity.title
}

/**
 * Get the translated description for an activity based on language
 * Falls back to English description if translation not available
 * 
 * @param {Object} activity - Activity object with description and description_* fields
 * @param {string} language - Language code (en, zh, ms, ta)
 * @returns {string} - Translated description
 */
export function getActivityDescription(activity, language) {
  if (!activity) return ''
  if (language === 'en') return activity.description || ''
  
  const translatedDesc = activity[`description_${language}`]
  return translatedDesc || activity.description || ''
}

/**
 * Hook-style helper that returns translation functions bound to current language
 * Use with useAccessibility() context
 * 
 * @param {string} language - Current language from accessibility context
 * @returns {Object} - { getTitle, getDescription } functions
 */
export function createActivityTranslator(language) {
  return {
    getTitle: (activity) => getActivityTitle(activity, language),
    getDescription: (activity) => getActivityDescription(activity, language)
  }
}
