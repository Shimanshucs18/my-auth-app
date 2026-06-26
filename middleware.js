import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Sirf yeh routes public hain — baaki sab protected
const publicRoutes = ["/login", "/register"];

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Public route nahi hai → protect karo
  if (!isPublicRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Pehle se logged in hai aur login/register pe jaana chahta hai?
  if (isPublicRoute) {
    if (token) {
      try {
        await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET),
        );
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Token invalid — login karne do
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};
