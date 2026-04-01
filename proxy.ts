import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const token = await getToken({ req })
  const isAuth = !!token
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")

  if (isDashboard && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
