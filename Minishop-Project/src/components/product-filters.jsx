

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"

export default function ProductFilters({ onFilterChange, minPrice = 0, maxPrice = 2000, categories = [] }) {
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handlePriceChange = (e) => {
    const value = Number.parseInt(e.target.value)
    const index = Number.parseInt(e.target.dataset.index)
    const newPriceRange = [...priceRange]
    newPriceRange[index] = value
    setPriceRange(newPriceRange)
  }

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? 0 : rating)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      rating: selectedRating,
      categories: selectedCategories,
    })
    if (window.innerWidth < 768) {
      setIsFilterOpen(false)
    }
  }

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedRating(0)
    setSelectedCategories([])
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      rating: 0,
      categories: [],
    })
  }

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button onClick={toggleFilters} className="md:hidden flex items-center text-blue-600 font-medium">
          <Filter size={18} className="mr-1" />
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`${
          isFilterOpen ? "block" : "hidden"
        } md:block bg-white rounded-lg shadow-md p-4 transition-all duration-300`}
      >
        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">${priceRange[0]}</span>
            <span className="text-sm text-gray-600">${priceRange[1]}</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{
                left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="relative mt-6">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              data-index="0"
              onChange={handlePriceChange}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              data-index="1"
              onChange={handlePriceChange}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <label className="text-sm text-gray-600">Min</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (value >= minPrice && value <= priceRange[1]) {
                    setPriceRange([value, priceRange[1]])
                  }
                }}
                className="w-24 p-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Max</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (value <= maxPrice && value >= priceRange[0]) {
                    setPriceRange([priceRange[0], value])
                  }
                }}
                className="w-24 p-1 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  selectedRating === rating ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm">{rating} & Up</span>
              </div>
            ))}
          </div>
        </div>

    
        {/* Filter Actions */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={applyFilters}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </div>
  )
}
