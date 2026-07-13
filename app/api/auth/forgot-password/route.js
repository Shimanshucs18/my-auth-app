import pool from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userResult.rows.length === 0) {
    return NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await pool.query("DELETE FROM password_resets WHERE email = $1", [email]);

  await pool.query(
    "INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)",
    [email, token, expiresAt],
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${req.headers.get("origin")}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });
    console.log("Email sent successfully to:", email);
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
  }

  return NextResponse.json({
    message: "If this email exists, a reset link has been sent.",
  });
}
