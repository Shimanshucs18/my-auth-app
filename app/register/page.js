"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setServerError("");
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setServerError(data.error);
    setSuccess("Account created! Redirecting...");
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Create account
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Fill in your details to get started
        </p>

        {serverError && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {serverError}
          </p>
        )}
        {success && (
          <p className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
            {success}
          </p>
        )}

        <label className="text-sm text-gray-500 block mb-1">Full name</label>
        <Input
          placeholder="Shimanshu Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`mb-3 ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mb-2">{errors.name}</p>
        )}

        <label className="text-sm text-gray-500 block mb-1">
          Email address
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`mb-3 ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mb-2">{errors.email}</p>
        )}

        <label className="text-sm text-gray-500 block mb-1">Password</label>
        <Input
          type="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`mb-1 ${errors.password ? "border-red-500" : ""}`}
        />
        <p className="text-xs text-gray-400 mb-5">
          Use uppercase, a number, and 8+ characters.
        </p>
        {errors.password && (
          <p className="text-red-500 text-xs mb-2">{errors.password}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white"
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered?{" "}
          <Link href="/login" className="text-gray-900 font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
