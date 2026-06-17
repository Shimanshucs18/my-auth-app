import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import pg from "pg"
import bcrypt from "bcryptjs"

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function seedAdmin() {
  try {
    // Check karo — admin pehle se hai?
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@myapp.com"]
    )

    if (existing.rows.length > 0) {
      console.log("✅ Admin already exists!")
      process.exit(0)
    }

    // Password hash karo
    const hashed = await bcrypt.hash("Admin@123", 10)

    // Admin save karo
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      ["Admin", "admin@myapp.com", hashed, "ADMIN"]
    )

    console.log("✅ Admin created successfully!")
    console.log("📧 Email: admin@myapp.com")
    console.log("🔑 Password: Admin@123")

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    process.exit(0)
  }
}

seedAdmin()