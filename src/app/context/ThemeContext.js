'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Initialize theme based on what's already applied to avoid flash
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      // First check if dark class is already applied (by our script)
      const hasDarkClass = document.documentElement.classList.contains('dark')
      if (hasDarkClass) return 'dark'
      
      // Then check localStorage
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) return savedTheme
      
      // Default to light mode (ignore system preference)
      return 'light'
    }
    return 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Ensure the initial theme is correctly applied
    const currentTheme = getInitialTheme()
    if (currentTheme !== theme) {
      setTheme(currentTheme)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      const html = document.documentElement
      if (theme === 'dark') {
        html.classList.add('dark')
        html.style.colorScheme = 'dark'
      } else {
        html.classList.remove('dark')
        html.style.colorScheme = 'light'
      }
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
