import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req) {
  const { name, email, password, role } = await req.json()

  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1", [email]
  )
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const userRole = role === "admin" ? "admin" : "user"

  await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    [name, email, hashed, userRole]
  )

  return NextResponse.json({ message: "Account created!" }, { status: 201 })
}