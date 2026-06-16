import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations"

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

  // Email se user dhundo
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
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // JWT Token banao
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  // Cookie mein save karo
  const response = NextResponse.json({ message: "Logged in!" })
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}