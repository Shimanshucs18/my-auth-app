"use client";
import { useEffect, useState } from "react";
// import { products } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  async function handleCancel(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    const res = await fetch(`/api/orders/${orderId}`, { method: "PATCH" });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o)),
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg mb-4">No orders yet.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
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
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.status !== "CANCELLED" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.name || "Unknown product"} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
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
  );
}
