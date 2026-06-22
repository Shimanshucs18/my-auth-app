import { NextResponse } from "next/server"
import { products } from "@/lib/products-data"

export async function GET(req, { params }) {
  const { id } = await params
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ product })
}