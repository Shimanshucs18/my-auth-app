import { requireAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  // Ek line mein auth check!
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">

        {/* User Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome, {user.name}! 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Logged in as{" "}
            <span className="font-semibold text-blue-600">{user.email}</span>
          </p>
        </div>

        {/* Role Badge */}
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
            user.role === "admin" ? "bg-red-500" : "bg-blue-500"
          }`}>
            {user.role === "admin" ? "👑 Admin" : "👤 User"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {user.role === "admin" && (
            <a href="/admin">
              <Button variant="outline">
                Admin Panel 👑
              </Button>
            </a>
          )}
          <form action="/api/auth/logout" method="POST">
            <Button variant="destructive" type="submit">
              Logout
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}