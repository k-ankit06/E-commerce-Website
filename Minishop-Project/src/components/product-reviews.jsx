

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/auth-context"
import { Star, ThumbsUp, ThumbsDown, Flag } from "lucide-react"
import toast from "react-hot-toast"

export default function ProductReviews({ productId, initialReviews = [] }) {
  const { currentUser } = useAuth()
  const [reviews, setReviews] = useState(initialReviews)
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating })
  }

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error("Please login to submit a review")
      return
    }

    if (newReview.rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (newReview.comment.trim() === "") {
      toast.error("Please enter a comment")
      return
    }

    // Create new review
    const review = {
      id: `review_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    }

    // Add to reviews
    setReviews([review, ...reviews])

    // Reset form
    setNewReview({ rating: 0, comment: "" })
    setShowReviewForm(false)

    toast.success("Review submitted successfully!")
  }

  const handleLikeReview = (reviewId) => {
    if (!currentUser) {
      toast.error("Please login to like a review")
      return
    }

    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)))
  }

  const handleDislikeReview = (reviewId) => {
    if (!currentUser) {
      toast.error("Please login to dislike a review")
      return
    }

    setReviews(
      reviews.map((review) => (review.id === reviewId ? { ...review, dislikes: review.dislikes + 1 } : review)),
    )
  }

  const handleReportReview = (reviewId) => {
    if (!currentUser) {
      toast.error("Please login to report a review")
      return
    }

    toast.success("Review reported. Thank you for your feedback.")
  }

  // Calculate average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Count ratings by star
  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++
    }
  })

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Review Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</div>
          </div>

          <div className="md:w-2/3 md:pl-8 md:border-l">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating - 1]
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={rating} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">{rating} stars</div>
                    <div className="flex-grow mx-3 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%`, transition: "width 0.5s ease" }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-gray-600 text-right">{count}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6">
              {currentUser ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showReviewForm ? "Cancel Review" : "Write a Review"}
                </motion.button>
              ) : (
                <p className="text-sm text-gray-600">
                  Please{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    login
                  </a>{" "}
                  to write a review.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`w-8 h-8 cursor-pointer ${
                      rating <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => handleRatingChange(rating)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                rows="4"
                value={newReview.comment}
                onChange={handleCommentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{review.userName}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleReportReview(review.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Flag size={16} />
                </button>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <button
                  onClick={() => handleLikeReview(review.id)}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp size={14} className="mr-1" />
                  <span>{review.likes}</span>
                </button>
                <button
                  onClick={() => handleDislikeReview(review.id)}
                  className="flex items-center ml-4 hover:text-red-600 transition-colors"
                >
                  <ThumbsDown size={14} className="mr-1" />
                  <span>{review.dislikes}</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
