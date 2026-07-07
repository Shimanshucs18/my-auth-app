import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return NextResponse.json({ products: result.rows });
}
