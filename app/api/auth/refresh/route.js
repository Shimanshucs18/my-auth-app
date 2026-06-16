import pool from "@/lib/db"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refresh_token")?.value

  // No Refresh Token
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 })
  }

  // Find the refresh token in the database.
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
    [refreshToken]
  )

  const tokenData = result.rows[0]

  // Didn't receive the token, or did it expire?
  if (!tokenData) {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 })
  }

  // Find User
  const userResult = await pool.query(
    "SELECT * FROM users WHERE id = $1", [tokenData.user_id]
  )
  const user = userResult.rows[0]

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 })
  }

  // Create New Access Token 
  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  )

  // Save New Access Token in Cookie
  const response = NextResponse.json({ message: "Token refreshed!" })
  response.cookies.set("token", newAccessToken, {
    httpOnly: true,
    maxAge: 60 * 15  // 15 minutes
  })

  return response
}