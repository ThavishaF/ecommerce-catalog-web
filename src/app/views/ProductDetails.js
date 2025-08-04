'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLoading } from '../context/LoadingContext'

export default function ProductDetails({ productId }) {
  const router = useRouter()
  const { addToCart } = useApp()
  const { showLoading, hideLoading } = useLoading()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        showLoading('Loading product details...')
        
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        
        const data = await response.json()
        
        // Small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 600))
        
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setProduct(null)
      } finally {
        setLoading(false)
        hideLoading()
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, showLoading, hideLoading])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      )
    }

    return stars
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-2xl"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Product not found</h3>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-12 h-12 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 transition-all duration-200 group bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 rounded-full shadow-sm hover:shadow-md"
          title="Back to Products"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 animate-fade-in">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-[4/3] max-w-lg mx-auto relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-6"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square relative bg-white dark:bg-gray-800 border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-102'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={product.image}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>

            {/* Product Features */}
            <div className="product-details-section p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-lg mx-auto">
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
                DETAILS
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Category</span>
                  <span className="table-cell font-normal capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Rating</span>
                  <span className="table-cell font-normal">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {product.rating.rate}/5
                    </div>
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Reviews</span>
                  <span className="table-cell font-normal">
                    {product.rating.count}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Availability</span>
                  <span className="table-cell font-normal text-green-600 dark:text-green-400">
                    In Stock
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="table-cell font-medium">SKU</span>
                  <span className="table-cell font-normal">
                    PROD-{product.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Category Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-black" style={{ backgroundColor: '#7DF9FF' }}>
                {product.category.replace(/'/g, '')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(product.rating.rate)}
              </div>
              <span className="text-muted-foreground font-medium">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-foreground">
                ${product.price}
              </span>
              {product.price < 50 && (
                <div className="flex flex-col">
                  <span className="text-lg text-gray-500 line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Save ${((product.price * 1.2) - product.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center space-x-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-r border-gray-300 dark:border-gray-600"
                >
                  −
                </button>
                <div className="w-16 px-4 py-3 text-center bg-transparent font-medium text-gray-900 dark:text-white">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l border-gray-300 dark:border-gray-600"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Shipping Info */}
            <div className="product-details-section p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
                SHIPPING & RETURNS
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Free Shipping</span>
                  <span className="table-cell font-normal">
                    Orders over $50
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Standard Delivery</span>
                  <span className="table-cell font-normal">
                    3-5 business days
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Express Delivery</span>
                  <span className="table-cell font-normal">
                    1-2 business days
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="table-cell font-medium">Return Policy</span>
                  <span className="table-cell font-normal">
                    30-day returns
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="table-cell font-medium">Customer Support</span>
                  <span className="table-cell font-normal">
                    24/7 available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
