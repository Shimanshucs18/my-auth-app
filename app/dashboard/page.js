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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}! 👋
        </h2>
        <p className="text-gray-600 mb-6">
          Logged in as <span className="font-semibold text-blue-600">{user.email}</span>
        </p>

        <div className="flex gap-4">
          {user.role === "admin" && (
            <a
              href="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Admin Panel 👑
            </a>
          )}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}