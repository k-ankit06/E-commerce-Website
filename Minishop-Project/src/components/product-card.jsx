

import { useCart } from "../context/card-context"
import { useWishlist } from "../context/wishlist-context"
import toast from "react-hot-toast"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isLiked, setIsLiked] = useState(isInWishlist(product.id))

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent navigation when clicking the add to cart button
    addToCart(product)
    toast.success(`Added ${product.title} to cart!`)
  }

  const toggleLike = (e) => {
    e.preventDefault() // Prevent navigation when clicking the heart button
    if (isLiked) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
    setIsLiked(!isLiked)
  }

  // Calculate discount percentage
  const discountPercentage = Math.round(product.discountPercentage)

  return (
    <Link to={`/product/${product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -10 }}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
      >
        <div className="relative h-48 overflow-hidden group">
          <img
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {discountPercentage > 0 && <div className="deals-badge">{discountPercentage}% OFF</div>}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLike}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Heart className={`h-5 w-5 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Eye className="h-5 w-5 text-blue-600" />
            </motion.div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          <p className="text-sm text-gray-600 h-12 overflow-hidden">{product.description}</p>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              {discountPercentage > 0 && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${Math.round(product.price / (1 - product.discountPercentage / 100))}
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-1 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </motion.button>
          </div>

          <div className="mt-2 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: i < Math.round(product.rating) ? [0, 20, 0] : 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
