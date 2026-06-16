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

  // Rate limiting check
  const attemptRecord = await pool.query(
    "SELECT * FROM login_attempts WHERE email = $1", [email]
  )

  if (attemptRecord.rows.length > 0) {
    const record = attemptRecord.rows[0]

    // Locked hai?
    if (record.locked_until && new Date(record.locked_until) > new Date()) {
      const remainingMs = new Date(record.locked_until) - new Date()
      const remainingMin = Math.ceil(remainingMs / 60000)
      return NextResponse.json({
        error: `Account locked! ${remainingMin} minute(s) baad try karo.`
      }, { status: 429 })
    }
  }

  // User dhundo
  const dbResult = await pool.query(
    "SELECT * FROM users WHERE email = $1", [email]
  )
  const user = dbResult.rows[0]

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // Password match karo
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    // Attempts update karo
    const currentAttempts = attemptRecord.rows[0]?.attempts || 0
    const newAttempts = currentAttempts + 1
    const lockTime = newAttempts >= 5 ? new Date(Date.now() + 1 * 60000) : null

    if (attemptRecord.rows.length === 0) {
      await pool.query(
        "INSERT INTO login_attempts (email, attempts, locked_until, updated_at) VALUES ($1, $2, $3, NOW())",
        [email, newAttempts, lockTime]
      )
    } else {
      await pool.query(
        "UPDATE login_attempts SET attempts = $1, locked_until = $2, updated_at = NOW() WHERE email = $3",
        [newAttempts, lockTime, email]
      )
    }

    const remaining = 5 - newAttempts
    if (remaining > 0) {
      return NextResponse.json({
        error: `Invalid password! ${remaining} attempts baaki hain.`
      }, { status: 401 })
    } else {
      return NextResponse.json({
        error: `Account locked. Please try again in 1 minute.`
      }, { status: 429 })
    }
  }

  // Login successful — attempts reset karo
  await pool.query(
    "DELETE FROM login_attempts WHERE email = $1", [email]
  )

  // Access Token banao — 15 min
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  )

  // Refresh Token banao — 7 days
  const refreshToken = crypto.randomBytes(64).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [user.id, refreshToken, expiresAt]
  )

  const response = NextResponse.json({ message: "Logged in!" })

  response.cookies.set("token", accessToken, {
    httpOnly: true,
    maxAge: 60 * 15
  })

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}