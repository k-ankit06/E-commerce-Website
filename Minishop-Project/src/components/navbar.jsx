

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ShoppingCart, User, Menu, X, LogOut, Package, Search, Percent, Heart } from "lucide-react"
import { useCart } from "../context/card-context"
import { useAuth } from "../context/auth-context"
import { useWishlist } from "../context/wishlist-context"
import { motion } from "framer-motion"

export default function Navbar() {
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 ${
        scrolled
          ? "bg-white shadow-md transition-all duration-300"
          : "bg-white bg-opacity-95 transition-all duration-300"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800 flex items-center">
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="text-blue-600 mr-1"
            >
              Mini
            </motion.span>
            Shop
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex relative mx-4 flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                location.pathname === "/" ? "font-semibold text-blue-600" : ""
              }`}
            >
              Products
            </Link>

            <Link
              to="/deals"
              className={`text-gray-600 hover:text-blue-600 transition-colors flex items-center ${
                location.pathname === "/deals" ? "font-semibold text-blue-600" : ""
              }`}
            >
              <Percent size={16} className="mr-1" />
              Deals
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/wishlist"
                  className={`text-gray-600 hover:text-blue-600 transition-colors relative ${
                    location.pathname === "/wishlist" ? "font-semibold text-blue-600" : ""
                  }`}
                >
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${
                    location.pathname === "/orders" ? "font-semibold text-blue-600" : ""
                  }`}
                >
                  Orders
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <span className="mr-1">Hi, {currentUser.name.split(" ")[0]}</span>
                    <User className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link to="/cart" className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            <button onClick={toggleMobileMenu} className="text-gray-600">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 md:hidden border-t pt-4"
          >
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={18} />
              </button>
            </form>

            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>

              <Link
                to="/deals"
                className="text-gray-600 hover:text-blue-600 py-2 flex items-center transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Percent size={16} className="mr-1" />
                Deals
              </Link>

              {currentUser ? (
                <>
                  <Link
                    to="/wishlist"
                    className="text-gray-600 hover:text-blue-600 py-2 flex items-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-blue-600 py-2 flex items-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-blue-600 py-2 flex items-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-blue-600 py-2 flex items-center transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
