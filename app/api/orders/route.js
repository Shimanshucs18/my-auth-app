import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id],
  );

  const ordersWithItems = await Promise.all(
    orders.rows.map(async (order) => {
      const items = await pool.query(
        `SELECT 
          oi.id,
          oi.order_id,
          oi.product_id,
          oi.quantity,
          oi.price,
          p.name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1`,
        [order.id],
      );
      return { ...order, items: items.rows };
    }),
  );

  return NextResponse.json({ orders: ordersWithItems });
}

export async function POST() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartResult = await client.query(
      "SELECT * FROM cart_items WHERE user_id = $1",
      [user.id],
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Har item validate karo transaction ke andar — DB se
    const itemsWithPrice = [];
    for (const item of cartResult.rows) {
      const productResult = await client.query(
        "SELECT * FROM products WHERE id = $1",
        [item.product_id],
      );
      const product = productResult.rows[0];

      // Product exist?
      if (!product) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: `Product not found for item ${item.product_id}` },
          { status: 400 },
        );
      }

      // Product out of stock?
      if (product.stock === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: `${product.name} is out of stock` },
          { status: 400 },
        );
      }

      // Quantity stock se zyada?
      if (item.quantity > product.stock) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            error: `Only ${product.stock} item(s) available for ${product.name}`,
          },
          { status: 400 },
        );
      }

      itemsWithPrice.push({ ...item, price: product.price });
    }

    const total = itemsWithPrice.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [user.id, total],
    );
    const order = orderResult.rows[0];

    for (const item of itemsWithPrice) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [order.id, item.product_id, item.quantity, item.price],
      );
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [user.id]);

    await client.query("COMMIT");

    return NextResponse.json({ message: "Order placed!", order });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
