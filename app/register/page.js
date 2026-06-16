"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    setError("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setSuccess("Account created! Redirecting to login...")
    setTimeout(() => router.push("/login"), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>
        )}
        {success && (
          <p className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</p>
        )}

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}