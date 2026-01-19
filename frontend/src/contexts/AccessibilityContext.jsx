import { createContext, useState, useEffect, useContext } from 'react'
import { accessibilityApi } from '../services/accessibility.api'

export const AccessibilityContext = createContext()

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(
    localStorage.getItem('fontSize') || 'medium'
  )
  const [contrast, setContrast] = useState(
    localStorage.getItem('contrast') || 'normal'
  )
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  )
  const [reduceMotion, setReduceMotion] = useState(
    localStorage.getItem('reduceMotion') === 'true'
  )

  // Apply settings to document
  useEffect(() => {
    document.documentElement.className = `font-${fontSize} contrast-${contrast}`
    localStorage.setItem('fontSize', fontSize)
    localStorage.setItem('contrast', contrast)
  }, [fontSize, contrast])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('reduceMotion', reduceMotion)
    if (reduceMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
    }
  }, [reduceMotion])

  const speak = async (text) => {
    try {
      const response = await accessibilityApi.textToSpeech({ text, language })
      const audio = new Audio(response.data.audio_url)
      await audio.play()
    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  const translate = async (text, targetLang) => {
    try {
      const response = await accessibilityApi.translate({
        text,
        source_language: language,
        target_language: targetLang
      })
      return response.data.translated_text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  const value = {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    language,
    setLanguage,
    reduceMotion,
    setReduceMotion,
    speak,
    translate
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}
