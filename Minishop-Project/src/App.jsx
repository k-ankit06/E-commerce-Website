"use client"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./context/auth-context"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/navbar"
import ProductListPage from "./pages/product-list-page"
import CartPage from "./pages/cart-page"
import LoginPage from "./pages/login-page"
import SignupPage from "./pages/signup-page"
import ProfilePage from "./pages/profile-page"
import OrdersPage from "./pages/orders-page"
import DealsPage from "./pages/deals-page"
import ProductDetailPage from "./pages/product-detail-page"
import WishlistPage from "./pages/wishlist-page"
import SearchResultsPage from "./pages/search-results-page"
import Footer from "./components/footer"
import ScrollToTop from "./components/scroll-to-top"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
