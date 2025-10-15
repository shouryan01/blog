'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center rounded-lg p-2 font-bold transition-transform duration-200 hover:scale-110 hover:rotate-270 hover:bg-zinc-100 hover:dark:bg-zinc-900"
      aria-label="Toggle theme"
    >
      {mounted ? (
        resolvedTheme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )
      ) : (
        <div className="h-5 w-5" />
      )}
    </button>
  )
}

export default ThemeSwitch
