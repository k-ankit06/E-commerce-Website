

import { Link } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { Package } from "lucide-react"

export default function OrdersPage() {
  const { currentUser } = useAuth()
  const orders = currentUser?.orders || []

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-medium text-gray-700">No orders yet</h2>
        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id.split("_")[1]}</p>
                <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {order.items.reduce((total, item) => total + item.quantity, 0)} items
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
