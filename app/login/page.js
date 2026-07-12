"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setServerError("");
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setServerError(data.error);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your credentials to continue
        </p>

        {serverError && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {serverError}
          </p>
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

        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-gray-500">Password</label>
          <Link
            href="/forgot-password"
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`mb-5 ${errors.password ? "border-red-500" : ""}`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mb-2">{errors.password}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-center text-sm text-gray-500">
          No account?{" "}
          <Link
            href="/register"
            className="text-gray-900 font-medium underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
