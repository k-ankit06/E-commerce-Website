
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth()
  const [cartItems, setCartItems] = useState([])


  useEffect(() => {
    const cartKey = currentUser ? `cart_${currentUser.id}` : "cart_guest"
    const savedCart = localStorage.getItem(cartKey)

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } else {
      setCartItems([])
    }
  }, [currentUser])


  useEffect(() => {
    if (cartItems.length >= 0) {
      const cartKey = currentUser ? `cart_${currentUser.id}` : "cart_guest"
      localStorage.setItem(cartKey, JSON.stringify(cartItems))
    }
  }, [cartItems, currentUser])

 
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {

        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {

        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }


  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

 
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }


  const clearCart = () => {
    setCartItems([])
  }


  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)


  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
