import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { addToCartSchema } from "@/lib/validations";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    `SELECT 
      ci.id,
      ci.user_id,
      ci.product_id,
      ci.quantity,
      ci.created_at,
      p.name,
      p.price,
      p.image,
      p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
    ORDER BY ci.id ASC`,
    [user.id],
  );

  return NextResponse.json({ items: result.rows });
}

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const result = addToCartSchema.safeParse(body);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const { productId, quantity } = result.data;

  // Product exist karta hai? — DB se check karo
  const productResult = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [productId]
  );
  const product = productResult.rows[0];

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Out of stock check
  if (product.stock === 0) {
    return NextResponse.json(
      { error: "Product is out of stock" },
      { status: 400 },
    );
  }

  // Existing cart item check
  const existing = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
    [user.id, productId],
  );

  // Stock exceed check
  const currentQty = existing.rows.length > 0 ? existing.rows[0].quantity : 0;
  if (currentQty + quantity > product.stock) {
    return NextResponse.json(
      {
        error: `Only ${product.stock - currentQty} item(s) available in stock`,
      },
      { status: 400 },
    );
  }

  if (existing.rows.length > 0) {
    await pool.query(
      "UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, user.id, productId],
    );
  } else {
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [user.id, productId, quantity],
    );
  }

  return NextResponse.json({ message: "Added to cart!" });
}