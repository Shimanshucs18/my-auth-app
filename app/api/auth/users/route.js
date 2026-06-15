import pool from "@/lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  // Login check karo
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Admin check karo
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Saare users lo
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users"
  )

  return NextResponse.json({ users: result.rows })
}