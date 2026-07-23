import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Seller ka profile dhoondho
    const sellerProfile = await pool.query(
      "SELECT * FROM seller_profiles WHERE user_id = $1",
      [user.id],
    );

    // Case 1: Seller profile hi nahi hai
    if (sellerProfile.rows.length === 0) {
      return NextResponse.json(
        { error: "You are not a registered seller" },
        { status: 403 },
      );
    }

    // Case 2: Profile hai, but APPROVED nahi
    if (sellerProfile.rows[0].status !== "APPROVED") {
      return NextResponse.json(
        { error: "Your seller account is not approved yet" },
        { status: 403 },
      );
    }
    // Product ka data lo
    const body = await req.json();
    const { name, price, category, image, description, stock } = body;

    // Check karo saare fields aaye hain
    if (!name || !price || !category || !image || !description) {
      return NextResponse.json(
        { error: "All product fields are required" },
        { status: 400 },
      );
    }
    // Product banao
    const result = await pool.query(
      `INSERT INTO products (name, price, category, image, description, seller_name, stock, seller_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
      [
        name,
        price,
        category,
        image,
        description,
        sellerProfile.rows[0].shop_name,
        stock || 0,
        user.id,
      ],
    );

    return NextResponse.json(
      { message: "Product created successfully!", product: result.rows[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
