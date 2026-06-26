"use client";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { products } from "@/lib/products-data";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, fetchCart, removeFromCart, loading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const cartDetails = items
    .map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return { ...item, product };
    })
    .filter((item) => item.product);

  const subtotal = cartDetails.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (cartDetails.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <a href="/products">
          <Button>Browse Products</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="bg-white rounded-xl shadow-md divide-y">
          {cartDetails.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  ₹{item.product.price} × {item.quantity}
                </p>
              </div>
              <p className="font-bold">₹{item.product.price * item.quantity}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md mt-6 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              {cartDetails.reduce((sum, i) => sum + i.quantity, 0)} item(s)
            </p>
            <p className="text-2xl font-bold">Subtotal: ₹{subtotal}</p>
          </div>
          <Button
            onClick={async () => {
              await fetch("/api/orders", { method: "POST" });
              window.location.href = "/orders";
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
