'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react'
import { useLoading } from '../context/LoadingContext'

export default function ProductCard({ product, onAddToCart }) {
  const router = useRouter()
  const { showLoading } = useLoading()
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleCardClick = (e) => {
    e.preventDefault()
    showLoading('Loading product details...')
    router.push(`/product/${product.id}`)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 fill-yellow-400 text-yellow-400 opacity-50" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <div className="product-card group animate-fade-in h-full flex flex-col">
      <div 
        onClick={handleCardClick}
        className="h-full flex flex-col cursor-pointer"
      >
        <div className="relative flex-1 flex flex-col">
          {/* Product Image */}
          <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-xl border-b border-gray-100 dark:border-gray-700">
            {!imageError ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-all duration-500 mix-blend-multiply dark:mix-blend-normal"
                  onError={() => setImageError(true)}
                />
                {/* Fading overlay to blend edges */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full dark:opacity-0" 
                       style={{
                         background: `
                           radial-gradient(ellipse at center, transparent 40%, rgba(249, 250, 251, 0.3) 70%, rgba(249, 250, 251, 0.8) 95%),
                           linear-gradient(to right, rgba(249, 250, 251, 0.2) 0%, transparent 15%, transparent 85%, rgba(249, 250, 251, 0.2) 100%),
                           linear-gradient(to bottom, rgba(249, 250, 251, 0.2) 0%, transparent 15%, transparent 85%, rgba(249, 250, 251, 0.2) 100%)
                         `,
                         mixBlendMode: 'multiply'
                       }}
                  />
                  <div className="w-full h-full opacity-0 dark:opacity-100" 
                       style={{
                         background: `
                           radial-gradient(ellipse at center, transparent 40%, rgba(31, 41, 55, 0.3) 70%, rgba(31, 41, 55, 0.8) 95%),
                           linear-gradient(to right, rgba(31, 41, 55, 0.2) 0%, transparent 15%, transparent 85%, rgba(31, 41, 55, 0.2) 100%),
                           linear-gradient(to bottom, rgba(31, 41, 55, 0.2) 0%, transparent 15%, transparent 85%, rgba(31, 41, 55, 0.2) 100%)
                         `,
                         mixBlendMode: 'normal'
                       }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 dark:text-gray-500 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                  </div>
                  <span className="text-xs">No image</span>
                </div>
              </div>
            )}
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-black shadow-lg border border-white/20 backdrop-blur-sm" style={{ backgroundColor: '#7DF9FF' }}>
                {product.category.replace(/'/g, '')}
              </span>
            </div>

            {/* Discount Badge (if applicable) */}
            {product.price < 50 && (
              <div className="absolute top-3 right-3">
                <span className="badge bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  Sale
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              {/* Title */}
              <h3 className="font-semibold text-card-foreground text-sm leading-tight min-h-[2rem] block">
                {truncateText(product.title, 50)}
              </h3>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-0.5">
                    {renderStars(product.rating.rate)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.rating.count})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-card-foreground">
                    ${product.price}
                  </span>
                  {product.price < 50 && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <span className="badge-success text-xs">
                  In Stock
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary btn-sm mt-2 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}