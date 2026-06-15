"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    setError("")
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    router.push("/dashboard")
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input placeholder="Email" type="email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />

      <input placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        style={{ display: "block", width: "100%", marginBottom: 16, padding: 8 }} />

      <button onClick={handleSubmit}
        style={{ width: "100%", padding: 10, background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Login
      </button>
      <p style={{ marginTop: 12, textAlign: "center" }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  )
}