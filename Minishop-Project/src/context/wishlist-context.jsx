

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import toast from "react-hot-toast"

const WishlistContext = createContext()

export function useWishlist() {
  return useContext(WishlistContext)
}

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])

  // Load wishlist from localStorage on initial render or when user changes
  useEffect(() => {
    const wishlistKey = currentUser ? `wishlist_${currentUser.id}` : "wishlist_guest"
    const savedWishlist = localStorage.getItem(wishlistKey)

    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    } else {
      setWishlistItems([])
    }
  }, [currentUser])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlistItems.length >= 0) {
      const wishlistKey = currentUser ? `wishlist_${currentUser.id}` : "wishlist_guest"
      localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, currentUser])

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      // Check if item already exists in wishlist
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Item already in wishlist, do nothing
        toast.error(`${product.title} is already in your wishlist!`)
        return prevItems
      } else {
        // Add new item to wishlist
        toast.success(`${product.title} added to wishlist!`)
        return [...prevItems, product]
      }
    })
  }

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId)
      if (itemToRemove) {
        toast.success(`${itemToRemove.title} removed from wishlist!`)
      }
      return prevItems.filter((item) => item.id !== productId)
    })
  }

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlistItems([])
    toast.success("Wishlist cleared!")
  }

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
