import { NextResponse } from "next/server"
import { products } from "@/lib/products-data"

export async function GET() {
  return NextResponse.json({ products })
}