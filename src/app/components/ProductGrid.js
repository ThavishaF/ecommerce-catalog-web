'use client'

import ProductCard from './ProductCard'
import { ProductGridSkeleton } from './LoadingComponents'

export default function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return <ProductGridSkeleton />
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 auto-rows-fr">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-slide-up h-full"
            style={{ 
              animationDelay: typeof window !== 'undefined' ? `${index * 0.1}s` : '0s' 
            }}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  )
}