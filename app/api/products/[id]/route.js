import { NextResponse } from "next/server";
// import { products } from "@/lib/products-data"
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = await params;

  // const product = products.find(p => p.id === parseInt(id))

  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

  // if (!product) {
  //   return NextResponse.json({ error: "Product not found" }, { status: 404 })
  // }

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: result.rows[0] });
}
