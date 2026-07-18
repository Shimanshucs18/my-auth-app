import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // User ka seller_profile dhoondho
  const result = await pool.query(
    "SELECT * FROM seller_profiles WHERE user_id = $1",
    [user.id],
  );

  // Case 1: Apply hi nahi kiya
  if (result.rows.length === 0) {
    return NextResponse.json({ status: "NOT_APPLIED" });
  }

  // Case 2: Profile hai — status batao
  return NextResponse.json({
    status: result.rows[0].status,
    shop_name: result.rows[0].shop_name,
  });
}
