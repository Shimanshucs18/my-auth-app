"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminClient({ currentUser }) {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/auth/users")
      .then(res => res.json())
      .then(data => {
        if (data.error) return setError(data.error)
        setUsers(data.users)
      })
  }, [])

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this user?")) return
    const res = await fetch(`/api/auth/users/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) return alert(data.error)
    setUsers(users.filter(u => u.id !== id))
  }

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel 👑</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Welcome, {currentUser.name}!
            </p>
          </div>
          <a href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm">ID</th>
                <th className="px-6 py-3 text-left text-sm">Name</th>
                <th className="px-6 py-3 text-left text-sm">Email</th>
                <th className="px-6 py-3 text-left text-sm">Role</th>
                <th className="px-6 py-3 text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 text-sm text-gray-700">{u.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      u.role === "ADMIN" ? "bg-red-500" : "bg-blue-500"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.role !== "ADMIN" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}