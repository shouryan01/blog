'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'

interface ZenContextType {
  isZenMode: boolean
  toggleZenMode: () => void
  isPlaying: boolean
}

const ZenContext = createContext<ZenContextType | undefined>(undefined)

export function ZenProvider({ children }: { children: ReactNode }) {
  const [isZenMode, setIsZenMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio('/static/audio/kyoto.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleZenMode = () => {
    const newZenMode = !isZenMode

    if (newZenMode) {
      // Entering zen mode - start music
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error('Failed to play audio:', error)
          })
      }
    } else {
      // Exiting zen mode - stop music
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      }
    }

    setIsZenMode(newZenMode)
  }

  return (
    <ZenContext.Provider value={{ isZenMode, toggleZenMode, isPlaying }}>
      {children}
    </ZenContext.Provider>
  )
}

export function useZenMode() {
  const context = useContext(ZenContext)
  if (context === undefined) {
    throw new Error('useZenMode must be used within a ZenProvider')
  }
  return context
}
