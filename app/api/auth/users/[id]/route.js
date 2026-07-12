import pool from "@/lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function DELETE(req, { params }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  if (parseInt(id) === user.id) {
    return NextResponse.json({ error: "Khud ko delete nahi kar sakte!" }, { status: 400 })
  }

  await pool.query("DELETE FROM users WHERE id = $1", [id])

  return NextResponse.json({ message: "User deleted!" })
}

export async function PATCH(req, { params }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { role } = await req.json()

  const validRoles = ["ADMIN", "USER", "SELLER", "SUPPORT"]
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  if (parseInt(id) === user.id) {
    return NextResponse.json({ error: "Apna role change nahi kar sakte!" }, { status: 400 })
  }

  await pool.query(
    "UPDATE users SET role = $1 WHERE id = $2",
    [role, id]
  )

  return NextResponse.json({ message: "Role updated!" })
}