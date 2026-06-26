import pool from "@/lib/db"
import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { products } from "@/lib/products-data"

// Take all orders from the user
export async function GET() {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id]
  )

  const ordersWithItems = await Promise.all(
    orders.rows.map(async (order) => {
      const items = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      )
      return { ...order, items: items.rows }
    })
  )

  return NextResponse.json({ orders: ordersWithItems })
}

// Place an order by checkout out from the cart.
export async function POST() {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cartResult = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = $1",
    [user.id]
  )

  if (cartResult.rows.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  const itemsWithPrice = cartResult.rows.map((item) => {
    const product = products.find((p) => p.id === item.product_id)
    return { ...item, price: product?.price || 0 }
  })

  const total = itemsWithPrice.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const orderResult = await pool.query(
    "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
    [user.id, total]
  )
  const order = orderResult.rows[0]

  for (const item of itemsWithPrice) {
    await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
      [order.id, item.product_id, item.quantity, item.price]
    )
  }

  await pool.query("DELETE FROM cart_items WHERE user_id = $1", [user.id])

  return NextResponse.json({ message: "Order placed!", order })
}