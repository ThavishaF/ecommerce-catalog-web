'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchCallback, setSearchCallback] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
        // Calculate total count
        const totalCount = parsedCart.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(totalCount)
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        // If item exists, increase quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // If new item, add to cart
        return [...prev, { ...product, quantity: 1 }]
      }
    })
    
    // Show notification
    showNotification('Product Added to Cart!', 'success')
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
    showNotification('Item removed from cart', 'info')
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    showNotification('Cart cleared', 'info')
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    
    // Enhanced styling with animations - mobile responsive
    notification.className = `fixed top-20 right-2 sm:right-4 left-2 sm:left-auto max-w-sm sm:max-w-md mx-auto sm:mx-0 ${bgColor} text-white px-4 sm:px-6 py-3 rounded-xl shadow-2xl z-50 transform translate-x-full opacity-0 transition-all duration-500 ease-out font-medium flex items-center space-x-3 border border-white/20 backdrop-blur-sm`
    
    // Add icon based on type with better styling
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'
    notification.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
        <span class="text-lg font-bold">${icon}</span>
      </div>
      <span class="text-sm font-semibold">${message}</span>
    `
    
    document.body.appendChild(notification)
    
    // Trigger slide-in animation with CSS classes
    setTimeout(() => {
      notification.classList.remove('translate-x-full', 'opacity-0')
      notification.classList.add('translate-x-0', 'opacity-100', 'animate-notification-slide')
      
      // Add bounce effect after slide-in
      setTimeout(() => {
        notification.classList.add('animate-notification-bounce')
      }, 300)
    }, 50)
    
    // Exit animation
    setTimeout(() => {
      notification.style.transform = 'translateX(100%) scale(0.9)'
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 500)
    }, 3000)
  }

  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const handleSearch = (searchTerm) => {
    if (searchCallback) {
      searchCallback(searchTerm)
    }
  }

  const setSearchHandler = (callback) => {
    setSearchCallback(() => callback)
  }

  return (
    <AppContext.Provider value={{
      cartItems,
      cartCount,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      toggleCart,
      closeCart,
      handleSearch,
      setSearchHandler
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
