import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { shop_name } = body;

  if (!shop_name) {
    return NextResponse.json(
      { error: "Shop name is required" },
      { status: 400 },
    );
  }

  // Check karo user ka pehle se seller_profile hai?
  const existing = await pool.query(
    "SELECT * FROM seller_profiles WHERE user_id = $1",
    [user.id],
  );

  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "You have already applied as a seller" },
      { status: 400 },
    );
  }
  // Naya seller_profile banao (status default PENDING hoga)
  await pool.query(
    "INSERT INTO seller_profiles (user_id, shop_name) VALUES ($1, $2)",
    [user.id, shop_name],
  );

  return NextResponse.json(
    {
      message:
        "Seller application submitted successfully! Waiting for admin approval.",
    },
    { status: 201 },
  );
}
