import { getAuthenticatedUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, currentPassword, newPassword } = await req.json();

  // Name update karo
  if (name) {
    await pool.query("UPDATE users SET name = $1 WHERE id = $2", [
      name,
      user.id,
    ]);
  }

  // Password update karo
  if (currentPassword && newPassword) {
    // Current password verify karo
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [user.id],
    );
    const match = await bcrypt.compare(
      currentPassword,
      result.rows[0].password,
    );

    if (!match) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashed,
      user.id,
    ]);

    // Purane refresh tokens delete karo — security ke liye
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [
      user.id,
    ]);
  }

  return NextResponse.json({ message: "Profile updated successfully!" });
}
