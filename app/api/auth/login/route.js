import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req) {
  const { email, password } = await req.json()

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1", [email]
  )
  const user = result.rows[0]

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // Role bhi token mein save karo
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  const response = NextResponse.json({ message: "Logged in!" })
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}