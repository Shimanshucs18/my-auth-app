import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations"

export async function POST(req) {
  const body = await req.json()

  // Zod validation
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    const errors = {}
    result.error.issues.forEach(err => {
      errors[err.path[0]] = err.message
    })
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const { name, email, password } = result.data

  // Email already hai?
  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1", [email]
  )
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  // Password hash karo
  const hashed = await bcrypt.hash(password, 10)

  // Database mein save karo
  await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hashed]
  )

  return NextResponse.json({ message: "Account created!" }, { status: 201 })
}