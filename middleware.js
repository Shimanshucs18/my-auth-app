import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Yeh routes protect karo
const protectedRoutes = ["/dashboard", "/admin"]

// Yeh routes sirf logged out users ke liye
const authRoutes = ["/login", "/register"]

export async function middleware(req) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // Protected route pe jaana chahta hai?
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      // Token ko verify karo
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      )
    } catch {
      // Token invalid hai → Login pe bhejo
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // Pehle se logged in hai aur login/register pe jaana chahta hai?
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      try {
        await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET)
        )
        // Token valid hai → Dashboard pe bhejo
        return NextResponse.redirect(new URL("/dashboard", req.url))
      } catch {
        // Token invalid — login karne do
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}