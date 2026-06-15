import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) redirect("/login")

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    redirect("/login")
  }

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: 24 }}>
      <h2>Welcome, {user.name}! 👋</h2>
      <p>You logged in <strong>{user.email}</strong></p>
      <form action="/api/auth/logout" method="POST">
        <button type="submit"
          style={{ marginTop: 20, padding: "10px 20px", background: "#e00", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Logout
        </button>
      </form>
    </div>
  )
}