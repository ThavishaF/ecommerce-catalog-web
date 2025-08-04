import AllProducts from './views/AllProducts'

/**
 * Homepage Container Component
 * 
 * This is a container component following industrial best practices.
 * It delegates all business logic to the AllProducts view component,
 * maintaining separation of concerns between routing and presentation.
 */
export default function HomePage() {
  return <AllProducts />
}
