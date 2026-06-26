// Details page

"use client"
import { useEffect, useState } from "react"
import { products, categories } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image";

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const addToCart = useCartStore((s) => s.addToCart)

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "All" || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <Image src={p.image} alt={p.name} width={400} height={192} className="w-full h-48 object-cover" />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-xl font-bold mt-2">₹{p.price}</p>
                <div className="flex gap-2 mt-auto pt-4">
                  <a href={`/products/${p.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </a>
                  <Button onClick={() => addToCart(p.id, 1)}>Add</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </div>
    </div>
  )
}