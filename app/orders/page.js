"use client"
import { useEffect, useState } from "react"
import { products } from "@/lib/products-data"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg mb-4">No orders yet.</p>
        <a href="/products">
          <Button>Browse Products</Button>
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {order.status}
                </span>
              </div>

              <div className="divide-y">
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.product_id)
                  return (
                    <div key={item.id} className="flex justify-between py-2 text-sm">
                      <span>{product?.name || "Unknown product"} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}