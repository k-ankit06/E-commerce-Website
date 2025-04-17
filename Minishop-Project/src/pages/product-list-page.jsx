

import { useState, useEffect } from "react"
import CategoryList from "../components/category-list"
import HeroBanner from "../components/hero-banner"
import ProductFilters from "../components/product-filters"
import { motion } from "framer-motion"
import { SlidersHorizontal } from "lucide-react"

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState("default")
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    rating: 0,
    categories: [],
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const url = selectedCategory
          ? `https://dummyjson.com/products/category/${selectedCategory}`
          : "https://dummyjson.com/products?limit=100"

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
        setFilteredProducts(data.products)
        setError(null)
      } catch (err) {
        setError("Failed to load products. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products/categories")

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }

    fetchCategories()
  }, [])


  useEffect(() => {
    if (products.length === 0) return

    let result = [...products]


    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )


    if (filters.rating > 0) {
      result = result.filter((product) => Math.round(product.rating) >= filters.rating)
    }

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
      
        break
    }

    setFilteredProducts(result)
  }, [products, filters, sortOption])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters)
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-64 bg-gray-200 rounded-xl shimmer"></div>
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
          onClick={() => setSelectedCategory("")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <HeroBanner />

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="md:w-1/4 hidden md:block">
          <ProductFilters onFilterChange={handleFilterChange} categories={categories} />
        </div>

        {/* Products */}
        <div className="md:w-3/4">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4 flex justify-between items-center">
            <button
              onClick={toggleMobileFilters}
              className="flex items-center text-blue-600 font-medium"
            >
              <SlidersHorizontal size={18} className="mr-1" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <select
              value={sortOption}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="discount">Discount</option>
            </select>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="md:hidden mb-4">
              <ProductFilters onFilterChange={handleFilterChange} categories={categories} />
            </div>
          )}

          {/* Product List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-medium">{product.title}</h3>
                  <p className="text-gray-500 text-sm">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">${product.price}</span>
                    <span className="text-gray-500 text-sm">{product.rating}★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}