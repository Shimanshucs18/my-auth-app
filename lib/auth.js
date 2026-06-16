import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

// User ki info nikalo — agar logged in hai
export async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    return user
  } catch {
    return null
  }
}

// User logged in hona chahiye — warna login pe bhejo
export async function requireAuth() {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")
  return user
}

// Specific role chahiye — warna redirect karo
export async function requireRole(role) {
  const user = await requireAuth()
  if (user.role !== role) redirect("/dashboard")
  return user
}