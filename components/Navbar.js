"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  if (!user) return null;

  const linksByRole = {
    USER: [
      { href: "/products", label: "Products" },
      { href: "/cart", label: "Cart" },
      { href: "/orders", label: "Orders" },
    ],
    SELLER: [
      { href: "/seller/dashboard", label: "Seller Dashboard" },
      { href: "/products", label: "Products" },
    ],
    ADMIN: [{ href: "/admin", label: "Admin Panel" }],
    SUPPORT: [{ href: "/support", label: "Support Dashboard" }],
  };

  const links = linksByRole[user.role] || [];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex items-center gap-6">
      <span className="font-bold">MyAuthApp</span>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`text-sm ${
            pathname === link.href
              ? "text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          {link.label}
        </a>
      ))}
      <span className="ml-auto text-sm text-gray-500">{user.name}</span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:underline"
      >
        Logout
      </button>
    </nav>
  );
}
