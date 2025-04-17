

import { useWishlist } from "../context/wishlist-context"
import { useCart } from "../context/card-context"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react"
import toast from "react-hot-toast"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`Added ${product.title} to cart!`)
  }

  const handleRemoveFromWishlist = (productId, productTitle) => {
    removeFromWishlist(productId)
    toast.success(`${productTitle} removed from wishlist!`)
  }

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist()
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Heart className="mx-auto h-16 w-16 text-gray-400" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-medium text-gray-700">Your wishlist is empty</h2>
        <p className="mt-2 text-gray-500">Save items you love to your wishlist and find them here anytime.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Start Shopping
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Wishlist</h1>
        <button
          onClick={handleClearWishlist}
          className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Link to={`/product/${item.id}`} className="block">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {item.discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {Math.round(item.discountPercentage)}% OFF
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <Link to={`/product/${item.id}`} className="block">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(item.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
                </div>
              </Link>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="text-lg font-bold text-gray-900">${item.price}</span>
                  {item.discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${Math.round(item.price / (1 - item.discountPercentage / 100))}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveFromWishlist(item.id, item.title)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
