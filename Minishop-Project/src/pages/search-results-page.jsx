

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ProductCard from "../components/product-card"
import ProductFilters from "../components/product-filters"
import { Search, SlidersHorizontal } from "lucide-react"

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState("relevance")
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    rating: 0,
    categories: [],
  })

  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://dummyjson.com/products/search?q=${query}`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
        setFilteredProducts(data.products)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.products.map((product) => product.category))]
        setCategories(uniqueCategories)

        setError(null)
      } catch (err) {
        setError("Failed to load search results. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query])

  // Apply filters and sorting
  useEffect(() => {
    if (products.length === 0) return

    let result = [...products]

    // Apply price filter
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => Math.round(product.rating) >= filters.rating)
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "discount":
        result.sort((a, b) => b.discountPercentage - a.discountPercentage)
        break
      default:
        // Default is relevance, no additional sorting needed
        break
    }

    setFilteredProducts(result)
  }, [products, filters, sortOption])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-12 bg-gray-200 rounded shimmer w-1/2"></div>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="md:w-1/4">
          <ProductFilters onFilterChange={handleFilterChange} categories={categories} />
        </div>

        {/* Products */}
        <div className="md:w-3/4">
          {/* Sort Options */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <SlidersHorizontal className="mr-2 h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Sort by:</span>
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search for something else.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
