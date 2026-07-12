import { requireAuth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-3 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
            {user.role}
          </span>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {user.role === "USER" && (
            <>
              <Link
                href="/products"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">
                  Browse products
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Explore our catalog
                </p>
              </Link>
              <Link
                href="/cart"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Your cart</p>
                <p className="text-xs text-gray-400 mt-0.5">Review items</p>
              </Link>
              <Link
                href="/orders"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Orders</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track your orders
                </p>
              </Link>
              <Link
                href="/profile"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Profile</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your info</p>
              </Link>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <Link
                href="/admin"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                <p className="text-xs text-gray-400 mt-0.5">Manage users</p>
              </Link>
              <Link
                href="/profile"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Profile</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your info</p>
              </Link>
            </>
          )}

          {user.role === "SELLER" && (
            <>
              <Link
                href="/products"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Products</p>
                <p className="text-xs text-gray-400 mt-0.5">View catalog</p>
              </Link>
              <Link
                href="/profile"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Profile</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your info</p>
              </Link>
            </>
          )}

          {user.role === "SUPPORT" && (
            <>
              <Link
                href="/profile"
                className="bg-white border border-gray-200 rounded-xl p-5 block hover:border-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">Profile</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your info</p>
              </Link>
            </>
          )}
        </div>

        {/* Logout */}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full border border-red-200 text-red-500 py-2.5 rounded-lg text-sm hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
