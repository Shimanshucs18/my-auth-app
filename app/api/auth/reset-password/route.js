import pool from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password required" }, { status: 400 })
  }

  // Token valid hai aur expire nahi hua?
  const resetResult = await pool.query(
    "SELECT * FROM password_resets WHERE token = $1 AND expires_at > NOW()",
    [token]
  )

  if (resetResult.rows.length === 0) {
    return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
  }

  const { email } = resetResult.rows[0]

  // Naya password hash karo
  const hashed = await bcrypt.hash(password, 10)

  // Password update karo
  await pool.query(
    "UPDATE users SET password = $1 WHERE email = $2",
    [hashed, email]
  )

  // Token delete karo (ek baar use ho gaya)
  await pool.query(
    "DELETE FROM password_resets WHERE token = $1",
    [token]
  )

  return NextResponse.json({ message: "Password reset successfully!" })
}