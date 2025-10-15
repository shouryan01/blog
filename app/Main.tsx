'use client'

import { useEffect, useState } from 'react'
import Snowfall from 'react-snowfall'
import { useZenMode } from './zen-context'

// Custom hook to detect screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical mobile breakpoint
    }

    // Check on mount
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

interface MainProps {
  children?: React.ReactNode
}

export default function Main({ children }: MainProps) {
  const isMobile = useIsMobile()
  const { isZenMode, toggleZenMode, isPlaying } = useZenMode()
  const snowflakeCount = isMobile ? 25 : 200

  return (
    <>
      {/* Background Image - moved from layout to here for better control */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/static/images/fuji.png)',
          opacity: 0.5,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
        }}
      />

      {/* Snowfall Effect - Always visible */}
      <Snowfall color="#fbcfe8" snowflakeCount={snowflakeCount} />

      {/* Zen Mode Button */}
      <button
        onClick={toggleZenMode}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-slate-800 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 dark:bg-zinc-950/20 dark:text-zinc-200 dark:hover:bg-zinc-800/30"
      >
        <div className="flex items-center gap-2">
          {isZenMode ? (
            <>
              <span>Exit</span>
              {isPlaying && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-0.5 animate-pulse bg-current"></div>
                  <div
                    className="h-3 w-0.5 animate-pulse bg-current"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="h-2 w-0.5 animate-pulse bg-current"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              )}
            </>
          ) : (
            <span>Zen Mode</span>
          )}
        </div>
      </button>

      {/* Main Content - hidden when in zen mode */}
      {!isZenMode && children}
    </>
  )
}
