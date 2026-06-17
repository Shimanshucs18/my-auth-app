import { requireRole } from "@/lib/auth"
import AdminClient from "./AdminClient"

export default async function AdminPage() {
  const user = await requireRole("ADMIN")
  return <AdminClient currentUser={user} />
}