"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setName(data.user?.name || "");
      });
  }, []);

  async function handleSubmit() {
    setError("");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    const body = {};
    if (name !== user?.name) body.name = name;
    if (currentPassword && newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    if (Object.keys(body).length === 0) {
      setLoading(false);
      return setError("No changes to save");
    }

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error);
    setMessage(data.message);

    // Password change hua toh logout ho jao aur login page pe redirect ho jao
    if (body.newPassword) {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
            {message}
          </p>
        )}

        {/* Name */}
        <div className="mb-4">
          <Label className="mb-1 block">Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* Email (readonly) */}
        <div className="mb-6">
          <Label className="mb-1 block">Email</Label>
          <Input value={user.email} disabled className="bg-gray-50" />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <hr className="mb-6" />

        <h3 className="font-semibold mb-4">Change Password</h3>

        <div className="mb-4">
          <Label className="mb-1 block">Current Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Label className="mb-1 block">New Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <Label className="mb-1 block">Confirm New Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
