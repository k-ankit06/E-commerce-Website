

import { useState, useEffect } from "react"
import ProductCard from "./product-card"

export default function RelatedProducts({ category, currentProductId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://dummyjson.com/products/category/${category}`)

        if (!response.ok) {
          throw new Error("Failed to fetch related products")
        }

        const data = await response.json()
        // Filter out the current product
        const filteredProducts = data.products.filter((product) => product.id !== currentProductId)
        setProducts(filteredProducts.slice(0, 4)) // Limit to 4 related products
      } catch (error) {
        console.error("Error fetching related products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchRelatedProducts()
    }
  }, [category, currentProductId])

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 shimmer"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
