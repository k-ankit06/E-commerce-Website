
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../context/card-context"
import { motion } from "framer-motion"

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1)
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  const itemTotal = item.price * item.quantity

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 relative group">
        <img
          src={item.thumbnail || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.brand}</p>
        <p className="text-sm font-medium text-gray-700 mt-1">${item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </motion.button>

        <span className="w-8 text-center">{item.quantity}</span>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="flex items-center gap-4">
        <p className="font-medium text-gray-800 w-20 text-right">${itemTotal.toFixed(2)}</p>

        <motion.button
          whileHover={{ scale: 1.1, color: "#ef4444" }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemove}
          className="p-1 text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}
