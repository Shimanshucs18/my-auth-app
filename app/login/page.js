"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    setServerError("")
    setErrors({})

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setServerError(data.error)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {serverError && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{serverError}</p>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <Label htmlFor="email" className="mb-1 block">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="abc@gmail.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <Label htmlFor="password" className="mb-1 block">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600">
          No account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}