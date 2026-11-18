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
  const [dyslexicFont, setDyslexicFont] = useState(
    localStorage.getItem('dyslexicFont') === 'true'
  )

  // Apply font size via data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize)
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  // Apply contrast via data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast)
    localStorage.setItem('contrast', contrast)
  }, [contrast])

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

  // Apply dyslexic font via data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-font', dyslexicFont ? 'dyslexic' : 'default')
    localStorage.setItem('dyslexicFont', dyslexicFont)
  }, [dyslexicFont])

  const speak = async (text) => {
    // Use Web Speech API (browser-native TTS) — no backend/API key needed
    // Falls back to backend ElevenLabs API if speechSynthesis unavailable
    if ('speechSynthesis' in window) {
      return new Promise((resolve, reject) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        // Map language codes to BCP-47 locale tags
        const langMap = { en: 'en-US', zh: 'zh-CN', ms: 'ms-MY', ta: 'ta-IN' }
        utterance.lang = langMap[language] || 'en-US'
        utterance.rate = 0.9   // Slightly slower for accessibility
        utterance.pitch = 1.0

        utterance.onend = () => resolve()
        utterance.onerror = (e) => {
          console.warn('Web Speech API error, falling back to backend TTS:', e)
          reject(e)
        }

        window.speechSynthesis.speak(utterance)
      })
    }

    // Fallback: backend ElevenLabs API
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
    dyslexicFont,
    setDyslexicFont,
    speak,
    translate
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}
