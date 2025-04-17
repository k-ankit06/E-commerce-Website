

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingBag, CreditCard, ArrowLeft, Truck, ShieldCheck } from "lucide-react"
import { useCart } from "../context/card-context"
import { useAuth } from "../context/auth-context"
import CartItem from "../components/cart-item"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

export default function CartPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { currentUser, addOrder } = useAuth()
  const navigate = useNavigate()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Please login to checkout")
      navigate("/login")
      return
    }

    setIsCheckingOut(true)

    try {
      // Create order object
      const order = {
        id: `order_${Date.now()}`,
        items: [...cartItems],
        total: cartTotal,
        status: "processing",
        date: new Date().toISOString(),
      }

      // Add order to user's history
      await addOrder(order)

      // Clear the cart
      clearCart()

      // Show success message with confetti effect
      toast.success("Order placed successfully!")

      // Redirect to orders page
      navigate("/orders")
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
      console.error(error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cartItems.length === 0) {
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
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-medium text-gray-700">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="hidden sm:flex text-sm font-medium text-gray-500 border-b pb-2">
                <div className="w-1/2">Product</div>
                <div className="w-1/6 text-center">Quantity</div>
                <div className="w-1/3 text-right">Subtotal</div>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 sticky top-24"
          >
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">${(cartTotal + cartTotal * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              {isCheckingOut ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Checkout
                </span>
              )}
            </motion.button>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-500">
                <Truck className="h-4 w-4 mr-2 text-green-500" />
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
