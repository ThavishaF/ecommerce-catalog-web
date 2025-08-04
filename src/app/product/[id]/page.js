'use client'

import { useParams } from 'next/navigation'
import ProductDetails from '../../views/ProductDetails'

/**
 * Product Detail Page Container Component
 * 
 * This is a container component following industrial best practices.
 * It extracts the productId from route parameters and passes it to
 * the ProductDetails view component, maintaining separation of concerns
 * between routing logic and presentation logic.
 */
export default function ProductPage() {
  const params = useParams()
  const productId = params.id

  return <ProductDetails productId={productId} />
}
