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
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input placeholder="Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />

      <input placeholder="Email" type="email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />

      <input placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        style={{ display: "block", width: "100%", marginBottom: 16, padding: 8 }} />

      <button onClick={handleSubmit}
        style={{ width: "100%", padding: 10, background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Register
      </button>
      <p style={{ marginTop: 12, textAlign: "center" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  )
}