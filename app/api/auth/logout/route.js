// import { NextResponse } from "next/server"

// export async function POST() {
//   const response = NextResponse.redirect(new URL("/login", "http://localhost:3000"))
//   response.cookies.set("token", "", { maxAge: 0 })
//   return response
// }

import { NextResponse } from "next/server"

export async function POST(req) {
  const url = new URL("/login", req.url)
  const response = NextResponse.redirect(url)
  
  // Both cookies delete
  response.cookies.set("token", "", { maxAge: 0 })
  response.cookies.set("refresh_token", "", { maxAge: 0 })
  
  return response
}