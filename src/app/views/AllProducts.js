'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductGrid from '../components/ProductGrid'
import { useApp } from '../context/AppContext'
import { useLoading } from '../context/LoadingContext'

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [productsPerPage] = useState(8) // Number of products to show initially
  const [showingAll, setShowingAll] = useState(false)
  const [isClient, setIsClient] = useState(false) // Track client-side hydration
  const { addToCart, setSearchHandler } = useApp()
  const { showLoading, hideLoading } = useLoading()

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch products from API
  useEffect(() => {
    let counterInterval
    
    const fetchProducts = async () => {
      try {
        setLoading(true)
        showLoading('Fetching amazing products...')
        
        const response = await fetch('https://fakestoreapi.com/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
        setDisplayedProducts(data.slice(0, productsPerPage)) // Initially show limited products
        setShowingAll(false)
        
        // Small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Animate counter from 0 to actual product count
        const targetCount = data.length
        
        // Only animate counter on client side
        if (isClient) {
          const duration = 1000 // 1 second (reduced from 2 seconds)
          const stepTime = 30 // Update every 30ms (faster updates)
          const steps = duration / stepTime
          const increment = targetCount / steps
          
          let currentCount = 0
          counterInterval = setInterval(() => {
            currentCount += increment
            if (currentCount >= targetCount) {
              setProductCount(targetCount)
              clearInterval(counterInterval)
            } else {
              setProductCount(Math.floor(currentCount))
            }
          }, stepTime)
        } else {
          // On server side, just set the final count
          setProductCount(targetCount)
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
        hideLoading()
      }
    }

    fetchProducts()
    
    // Cleanup function to clear interval on unmount
    return () => {
      if (counterInterval) {
        clearInterval(counterInterval)
      }
    }
  }, [showLoading, hideLoading, isClient])

  // Handle search functionality - Search by product title and category
  const handleSearch = useCallback((searchQuery) => {
    setSearchTerm(searchQuery)
    setIsSearching(!!searchQuery.trim())
    
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
      setDisplayedProducts(products.slice(0, productsPerPage))
      setShowingAll(false)
      return
    }

    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setFilteredProducts(filtered)
    setDisplayedProducts(filtered.slice(0, productsPerPage))
    setShowingAll(false)
  }, [products, productsPerPage])

  // Set up search handler
  useEffect(() => {
    setSearchHandler(handleSearch)
  }, [handleSearch, setSearchHandler])

  // Update displayed products when filtered products change
  useEffect(() => {
    if (!showingAll) {
      setDisplayedProducts(filteredProducts.slice(0, productsPerPage))
    } else {
      setDisplayedProducts(filteredProducts)
    }
  }, [filteredProducts, showingAll, productsPerPage])

  // Handle load more products
  const handleLoadMore = () => {
    setDisplayedProducts(filteredProducts)
    setShowingAll(true)
  }

  // Handle show less products
  const handleShowLess = () => {
    setDisplayedProducts(filteredProducts.slice(0, productsPerPage))
    setShowingAll(false)
    
    // Scroll to show the last visible product line after a short delay
    setTimeout(() => {
      // Calculate which product grid item to scroll to (last visible item)
      const productGrid = document.querySelector('.grid')
      if (productGrid) {
        const gridItems = productGrid.children
        // Get the last visible item (productsPerPage - 1 since index starts at 0)
        const lastVisibleIndex = Math.min(productsPerPage - 1, gridItems.length - 1)
        const lastVisibleItem = gridItems[lastVisibleIndex]
        
        if (lastVisibleItem) {
          lastVisibleItem.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          })
        }
      }
    }, 100) // Small delay to ensure DOM is updated
  }

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product)
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-theme-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Prevent hydration mismatch by not rendering until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">All Products</h2>
              </div>
            </div>
            <ProductGrid products={[]} loading={true} onAddToCart={() => {}} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8 w-full"
           style={{ maxWidth: '100vw' }}>
        {/* Products Section */}
        <div className="mb-6 sm:mb-8 animate-slide-up w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 w-full">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isSearching ? `Search Results for "${searchTerm}"` : 'All Products'}
              </h2>
              {isSearching && (
                <p className="text-foreground-secondary">
                  Found {filteredProducts.length} products matching your search
                </p>
              )}
            </div>
            
            {!loading && (
              <div className="flex items-center space-x-4">
                {isSearching && filteredProducts.length === 0 ? (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm">No products found matching "{searchTerm}"</span>
                  </div>
                ) : displayedProducts.length > 0 ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground text-sm">
                      Showing {displayedProducts.length} of {filteredProducts.length} products
                    </span>
                    <div className="w-2 h-2 bg-theme-success rounded-full animate-pulse"></div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <ProductGrid
            products={displayedProducts}
            loading={loading}
            onAddToCart={handleAddToCart}
          />

          {/* Load More / Show Less Button */}
          {!loading && filteredProducts.length > productsPerPage && (
            <div className="text-center mt-12 animate-fade-in">
              {displayedProducts.length < filteredProducts.length ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleLoadMore}
                    className="btn-secondary btn-lg"
                  >
                    Load More Products
                  </button>
                  <span className="text-sm text-muted-foreground mt-2">
                    {filteredProducts.length - displayedProducts.length} remaining products
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="btn-secondary btn-lg"
                >
                  Show Less Products
                </button>
              )}
            </div>
          )}

          {/* No Results Found */}
          {!loading && isSearching && filteredProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-theme-surface to-theme-background rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any products with titles or categories matching "<span className="font-medium text-theme-primary">{searchTerm}</span>". 
                  Try searching with different keywords or browse all products.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      handleSearch('')
                      setShowingAll(false)
                    }}
                    className="px-6 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-secondary transition-colors duration-200"
                  >
                    Browse All Products
                  </button>
                  <button
                    onClick={() => {
                      const searchInput = document.querySelector('input[type="search"]');
                      if (searchInput) {
                        searchInput.focus();
                      }
                    }}
                    className="px-6 py-2 border border-theme-border text-theme-secondary rounded-lg hover:bg-theme-surface transition-colors duration-200"
                  >
                    Try Different Search
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        {!loading && (
          <div className="mt-20 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Us?
              </h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                We're committed to providing you with the best shopping experience
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Best Prices
                </h3>
                <p className="text-foreground-secondary">
                  Competitive pricing on all our products with regular discounts
                </p>
              </div>
              
              <div className="glass-card text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Fast Delivery
                </h3>
                <p className="text-foreground-secondary">
                  Quick and reliable shipping to get your products to you fast
                </p>
              </div>
              
              <div className="glass-card text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-secondary rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Quality Assured
                </h3>
                <p className="text-foreground-secondary">
                  Every product is carefully selected and quality tested
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {!loading && (
          <div className="mt-20 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Numbers
              </h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                Here's what makes us a trusted choice for thousands of customers
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center glass-card p-8">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {productCount}{products.length > 0 && productCount === products.length ? '+' : ''}
                </div>
                <div className="text-foreground-tertiary font-medium">Products</div>
                <div className="text-sm text-muted-foreground mt-1">Available in store</div>
              </div>
              <div className="text-center glass-card p-8">
                <div className="text-4xl font-bold text-foreground mb-2">4.5★</div>
                <div className="text-foreground-tertiary font-medium">Rating</div>
                <div className="text-sm text-muted-foreground mt-1">Customer satisfaction</div>
              </div>
              <div className="text-center glass-card p-8">
                <div className="text-4xl font-bold text-foreground mb-2">24/7</div>
                <div className="text-foreground-tertiary font-medium">Support</div>
                <div className="text-sm text-muted-foreground mt-1">Always available</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
