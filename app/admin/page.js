"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/users")
      .then(res => res.json())
      .then(data => {
        if (data.error) return setError(data.error)
        setUsers(data.users)
      })
  }, [])

  async function handleDelete(id) {
    if (!confirm("Kya aap sure hain?")) return

    const res = await fetch(`/api/auth/users/${id}`, {
      method: "DELETE",
    })
    const data = await res.json()

    if (!res.ok) return alert(data.error)

    // List se user hatao
    setUsers(users.filter(u => u.id !== id))
    alert("User delete ho gaya!")
  }

  if (error) return <p style={{ color: "red", padding: 40 }}>{error}</p>

  return (
    <div style={{ maxWidth: 800, margin: "80px auto", padding: 24 }}>
      <h2>Admin Panel 👑</h2>
      <h3 style={{ marginTop: 24 }}>Saare Users:</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr style={{ background: "#0070f3", color: "#fff" }}>
            <th style={{ padding: 10, textAlign: "left" }}>ID</th>
            <th style={{ padding: 10, textAlign: "left" }}>Name</th>
            <th style={{ padding: 10, textAlign: "left" }}>Email</th>
            <th style={{ padding: 10, textAlign: "left" }}>Role</th>
            <th style={{ padding: 10, textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>{u.id}</td>
              <td style={{ padding: 10 }}>{u.name}</td>
              <td style={{ padding: 10 }}>{u.email}</td>
              <td style={{ padding: 10 }}>
                <span style={{
                  background: u.role === "admin" ? "#e00" : "#0070f3",
                  color: "#fff", padding: "2px 8px", borderRadius: 4
                }}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: 10 }}>
                {u.role !== "admin" && (
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      background: "#e00", color: "#fff",
                      border: "none", padding: "6px 12px",
                      borderRadius: 4, cursor: "pointer"
                    }}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/dashboard" style={{ display: "inline-block", marginTop: 20, color: "#0070f3" }}>
        ← Dashboard pe jao
      </a>
    </div>
  )
}