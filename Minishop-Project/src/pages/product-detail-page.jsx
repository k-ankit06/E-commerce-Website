

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useCart } from "../context/card-context"
import { useWishlist } from "../context/wishlist-context"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, ChevronRight, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import toast from "react-hot-toast"
import ProductReviews from "../components/product-reviews"
import RelatedProducts from "../components/related-product"

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://dummyjson.com/products/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data)
        setIsLiked(isInWishlist(data.id))
        setError(null)
      } catch (err) {
        setError("Failed to load product. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isInWishlist])

  const handleAddToCart = () => {
    if (product) {
      // Add the product with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      toast.success(`Added ${quantity} ${product.title} to cart!`)
    }
  }

  const toggleLike = () => {
    if (!product) return

    if (isLiked) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="h-96 bg-gray-200 rounded-lg shimmer"></div>
            <div className="mt-4 flex gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-20 h-20 bg-gray-200 rounded shimmer"></div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded shimmer w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded shimmer w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded shimmer"></div>
            <div className="h-8 bg-gray-200 rounded shimmer w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded shimmer w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error || "Product not found"}</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Back to Products
        </Link>
      </div>
    )
  }

  // Calculate discount percentage
  const discountPercentage = Math.round(product.discountPercentage)
  const originalPrice = Math.round(product.price / (1 - product.discountPercentage / 100))

  // Generate mock reviews
  const mockReviews = [
    {
      id: "review_1",
      userId: "user_1",
      userName: "John Doe",
      rating: 5,
      comment:
        "This product exceeded my expectations! The quality is outstanding and it works perfectly. I would definitely recommend it to anyone looking for a reliable solution.",
      date: "2023-05-15T10:30:00Z",
      likes: 12,
      dislikes: 1,
    },
    {
      id: "review_2",
      userId: "user_2",
      userName: "Jane Smith",
      rating: 4,
      comment:
        "Very good product overall. It has most of the features I was looking for and the price is reasonable. The only downside is that it took a bit longer to arrive than expected.",
      date: "2023-04-22T14:15:00Z",
      likes: 8,
      dislikes: 0,
    },
    {
      id: "review_3",
      userId: "user_3",
      userName: "Robert Johnson",
      rating: 3,
      comment:
        "It's an okay product. Does the job but nothing spectacular. I think there are better options available at this price point.",
      date: "2023-03-10T09:45:00Z",
      likes: 3,
      dislikes: 2,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Breadcrumb */}
      <nav className="flex mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link to={`/category/${product.category}`} className="hover:text-blue-600 transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-gray-700 truncate">{product.title}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-96 bg-white rounded-lg overflow-hidden"
          >
            <img
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-md">
                {discountPercentage}% OFF
              </div>
            )}
          </motion.div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                  selectedImage === index ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            {product.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center mt-2"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{product.rating} rating</span>
            <span className="mx-2 text-gray-400">|</span>
            <a href="#reviews" className="text-sm text-blue-600 hover:underline">
              See all reviews
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4"
          >
            <p className="text-gray-600">{product.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Brand: <span className="font-medium">{product.brand}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Category: <span className="font-medium capitalize">{product.category}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Stock:{" "}
              <span className="font-medium">{product.stock > 0 ? `${product.stock} units` : "Out of stock"}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {discountPercentage > 0 && (
                <span className="ml-3 text-lg text-gray-500 line-through">${originalPrice}</span>
              )}
              {discountPercentage > 0 && (
                <span className="ml-3 text-sm font-medium text-green-600">Save ${originalPrice - product.price}</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <div className="flex items-center">
              <div className="mr-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(product.stock, Math.max(1, Number.parseInt(e.target.value) || 1)))
                    }
                    className="w-12 text-center border-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="text-lg font-bold">${(product.price * quantity).toFixed(2)}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLike}
              className={`px-4 py-3 font-medium rounded-md flex items-center justify-center ${
                isLiked
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 border-t pt-6 space-y-4"
          >
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500">Free standard shipping on orders over $50</p>
              </div>
            </div>
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-500">Your payment information is processed securely</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCcw className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">30-Day Returns</h4>
                <p className="text-sm text-gray-500">Simple returns up to 30 days after purchase</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Reviews */}
      <div id="reviews">
        <ProductReviews productId={product.id} initialReviews={mockReviews} />
      </div>

      {/* Related Products */}
      <RelatedProducts category={product.category} currentProductId={product.id} />
    </motion.div>
  )
}
