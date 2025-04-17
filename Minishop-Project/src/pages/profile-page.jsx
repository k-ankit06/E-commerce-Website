

import { useState } from "react"
import { useAuth } from "../context/auth-context"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth()

  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name) {
      setError("Name is required")
      return
    }

    try {
      setError("")
      setLoading(true)

      await updateProfile({ name })

      toast.success("Profile updated successfully")
    } catch (err) {
      setError("Failed to update profile")
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input type="email" id="email" value={email} className="form-input bg-gray-100" disabled />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary px-6" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">{new Date(currentUser?.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="font-medium">{currentUser?.orders?.length || 0} orders</p>
          </div>
        </div>
      </div>
    </div>
  )
}
