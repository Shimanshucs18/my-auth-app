import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
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

  const { id } = await params;
  const { quantity } = await req.json();

  if (!quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  await pool.query(
    "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3",
    [quantity, id, user.id],
  );
  return NextResponse.json({ message: "Quantity updated!" });
}

export async function DELETE(req, { params }) {
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

  const { id } = await params;

  await pool.query("DELETE FROM cart_items WHERE id = $1 AND user_id = $2", [
    id,
    user.id,
  ]);

  return NextResponse.json({ message: "Removed from cart!" });
}
