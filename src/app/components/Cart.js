'use client'

import { useEffect } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Image from 'next/image'

export default function Cart() {
  const {
    cartItems,
    cartCount,
    isCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    closeCart
  } = useApp()

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isCartOpen, closeCart])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-all duration-500 ease-out"
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div className={`cart-panel fixed top-0 right-0 h-full w-full sm:max-w-md border-l border-border z-[60] transform transition-all duration-500 ease-out ${
        isCartOpen ? 'translate-x-0 opacity-100 animate-cart-slide-in' : 'translate-x-full opacity-0'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-border transition-all duration-300 ${
          isCartOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`} style={{ transitionDelay: isCartOpen ? '200ms' : '0ms' }}>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-theme-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Shopping Cart
            </h2>
            {cartCount > 0 && (
              <span className="bg-theme-primary text-white text-sm px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-surface-200 transition-colors"
          >
            <X className="w-5 h-5 text-foreground-secondary" />
          </button>
        </div>

        {/* Cart Content */}
        <div className={`flex flex-col h-full transition-all duration-400 ${
          isCartOpen ? 'translate-y-0 opacity-100 animate-cart-content-fade' : 'translate-y-4 opacity-0'
        }`} style={{ transitionDelay: isCartOpen ? '300ms' : '0ms' }}>
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-surface-200 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Your cart is empty
              </h3>
              <p className="text-muted-foreground mb-6">
                Add some products to get started
              </p>
              <button
                onClick={closeCart}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4 p-4 bg-surface-100 rounded-lg border border-border">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button & Total */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-lg hover:bg-surface-200 text-theme-error transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-border p-4 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold text-foreground">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full btn-primary">
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full btn-secondary text-theme-error hover:bg-red-50 hover:text-theme-error"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
