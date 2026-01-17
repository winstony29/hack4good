import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import Button from '../shared/Button'

export default function TTSButton({ text }) {
  const { speak } = useAccessibility()
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = async () => {
    setIsPlaying(true)
    try {
      await speak(text)
    } catch (error) {
      console.error('TTS error:', error)
    } finally {
      setIsPlaying(false)
    }
  }

  return (
    <Button
      size="small"
      variant="outline"
      onClick={handlePlay}
      disabled={isPlaying}
      aria-label="Read aloud"
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {isPlaying ? 'Playing...' : 'Read Aloud'}
    </Button>
  )
}
