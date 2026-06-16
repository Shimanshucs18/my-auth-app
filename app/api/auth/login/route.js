import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations"
import crypto from "crypto"

export async function POST(req) {
  const body = await req.json()

  // Zod validation
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    const errors = {}
    result.error.issues.forEach(err => {
      errors[err.path[0]] = err.message
    })
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const { email, password } = result.data

  // Find Users
  const dbResult = await pool.query(
    "SELECT * FROM users WHERE email = $1", [email]
  )
  const user = dbResult.rows[0]

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // Match the Password
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // Create access token — Valid for 15 minutes
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  )

  // Create refresh token — 7 days valid
  const refreshToken = crypto.randomBytes(64).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // Save refresh token in database
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [user.id, refreshToken, expiresAt]
  )

  // Save both tokens in cookies.
  const response = NextResponse.json({ message: "Logged in!" })

  response.cookies.set("token", accessToken, {
    httpOnly: true,
    maxAge: 60 * 15  // 15 minutes
  })

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7  // 7 days
  })

  return response
}