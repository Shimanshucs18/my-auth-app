import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { products } from "@/lib/products-data";
import { addToCartSchema } from "@/lib/validations";

// User ki cart items lo
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
    "SELECT * FROM cart_items WHERE user_id = $1",
    [user.id],
  );

  return NextResponse.json({ items: result.rows });
}

// Cart mein product add karo
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

  // Zod validation
  const result = addToCartSchema.safeParse(body);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const { productId, quantity } = result.data;

  // Check karo — product actually exist karta hai?
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check karo — product already cart mein hai?
  const existing = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
    [user.id, productId],
  );

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
