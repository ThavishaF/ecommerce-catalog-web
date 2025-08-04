'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  const showLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingMessage('')
  }, [])

  const withLoading = useCallback(async (asyncFunction, message = 'Loading...') => {
    showLoading(message)
    try {
      const result = await asyncFunction()
      return result
    } finally {
      hideLoading()
    }
  }, [showLoading, hideLoading])

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      showLoading,
      hideLoading,
      withLoading
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
