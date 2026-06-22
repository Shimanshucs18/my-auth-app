import pool from "@/lib/db"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// User ki cart items lo
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = $1",
    [user.id]
  )

  return NextResponse.json({ items: result.rows })
}

// Cart mein product add karo
export async function POST(req) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { productId, quantity } = await req.json()

  // Check karo — product already cart mein hai?
  const existing = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
    [user.id, productId]
  )

  if (existing.rows.length > 0) {
    // Already hai — quantity update karo
    await pool.query(
      "UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
      [quantity || 1, user.id, productId]
    )
  } else {
    // Naya item add karo
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [user.id, productId, quantity || 1]
    )
  }

  return NextResponse.json({ message: "Added to cart!" })
}