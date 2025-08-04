'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Menu, X, Sun, Moon, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount, handleSearch, toggleCart } = useApp()
  const { theme, toggleTheme, mounted } = useTheme()

  const onSearch = (e) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  const onSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // If the input is cleared (empty), also clear the search results
    if (value === '') {
      handleSearch('')
    }
  }

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-theme-warning rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gradient-primary">
                ShopCatalog
              </span>
              <div className="text-xs text-muted-foreground font-medium">
                Modern Shopping
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={onSearch} className="relative group">
              <input
                type="search"
                placeholder="Search products by title..."
                value={searchTerm}
                onChange={onSearchChange}
                className="modern-input pl-12 pr-4 group-focus-within:shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-theme-primary transition-colors" />
              <div className="absolute inset-0 rounded-xl bg-theme-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-foreground-secondary hover:bg-surface-200 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl text-foreground-secondary hover:bg-surface-200 transition-all duration-200 hover:scale-105 group"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-theme-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-scale-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <div className="absolute inset-0 rounded-xl bg-theme-primary/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-foreground-secondary hover:bg-surface-200 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 mt-4 pt-4 animate-slide-up">
            <form onSubmit={onSearch} className="relative">
              <input
                type="search"
                placeholder="Search products by title..."
                value={searchTerm}
                onChange={onSearchChange}
                className="modern-input pl-12 pr-4"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}