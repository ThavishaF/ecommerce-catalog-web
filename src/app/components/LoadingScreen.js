'use client'

import { useEffect, useState } from 'react'
import { useLoading } from '../context/LoadingContext'

export default function LoadingScreen() {
  const { isLoading, loadingMessage } = useLoading()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true)
      setProgress(0)
      
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 100)

      return () => clearInterval(progressInterval)
    } else {
      // Complete the progress when loading is done
      setProgress(100)
      
      // Hide the loading screen after a short delay
      const hideTimeout = setTimeout(() => {
        setIsVisible(false)
      }, 300)

      return () => clearTimeout(hideTimeout)
    }
  }, [isLoading])

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop Blur Overlay - Positioned below header */}
      <div 
        className={`fixed inset-0 z-30 transition-all duration-500 backdrop-blur-md ${
          isLoading ? 'bg-white/80 dark:bg-slate-900/80' : 'bg-transparent'
        }`}
        style={{
          pointerEvents: isLoading ? 'auto' : 'none',
          top: '64px', // Start below the header (header is typically 64px height)
        }}
      />
      
      {/* Main Loading Screen - Positioned below header */}
      <div 
        className={`fixed z-40 flex items-center justify-center transition-opacity duration-300 ${
          !isLoading && progress >= 100 ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {/* <div className="grid grid-cols-8 gap-4 h-full">
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-primary rounded-lg animate-pulse"
              style={{
                animationDelay: `${i * 50}ms`,
                animationDuration: `${2000 + (i % 4) * 500}ms`
              }}
            />
          ))}
        </div> */}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        {/* <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">E-Commerce Catalog</h2>
          <p className="text-muted-foreground">{loadingMessage || 'Loading amazing products...'}</p>
        </div> */}

        {/* Custom Loader Animation */}
        <div className="flex flex-col items-center mb-6">
          <div className="loader mb-4"></div>
          <div className="text-lg font-semibold text-foreground mt-2">
            {loadingMessage || 'Loading amazing products...'}
          </div>
        </div>
      </div>

      {/* Overlay gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-transparent to-background/30 pointer-events-none" /> */}
    </div>
    </>
  )
}
