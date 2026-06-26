// Listing page

"use client";
import { products } from "@/lib/products-data";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const addToCart = useCartStore((s) => s.addToCart);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 grid md:grid-cols-2 gap-8">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={320}
          className="w-full h-80 object-cover rounded-lg"
        />

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{product.category}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-3xl font-bold mb-2">₹{product.price}</p>
          <p className="text-sm text-gray-500 mb-1">
            Sold by: {product.sellerName}
          </p>
          <p
            className={`text-sm font-semibold mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>

          <Button
            disabled={product.stock === 0}
            onClick={() => addToCart(product.id, 1)}
            className="w-full"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <Link
            href="/products"
            className="text-blue-600 hover:underline text-sm mt-4 text-center"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
