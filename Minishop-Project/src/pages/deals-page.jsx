

import { useState, useEffect } from "react"
import ProductCard from "../components/product-card"
import { motion } from "framer-motion"
import { Percent } from "lucide-react"

export default function DealsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all products and filter for deals
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://dummyjson.com/products?limit=100")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()

        // Filter products with discount percentage > 15%
        const dealsProducts = data.products.filter((product) => product.discountPercentage > 15)

        // Sort by discount percentage (highest first)
        dealsProducts.sort((a, b) => b.discountPercentage - a.discountPercentage)

        setProducts(dealsProducts)
        setError(null)
      } catch (err) {
        setError("Failed to load deals. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-40 bg-gray-200 rounded-xl shimmer"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 shimmer"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded shimmer"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded shimmer w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded shimmer w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
        <p className="text-red-500 text-lg">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 mb-8 text-white"
      >
        <div className="flex items-center mb-2">
          <Percent className="mr-2" size={24} />
          <h1 className="text-3xl font-bold">Hot Deals</h1>
        </div>
        <p className="text-lg opacity-90">Discover our best discounts and special offers!</p>
      </motion.div>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No deals found at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
