import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes: require admin role
    if (path.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        if (path.startsWith("/admin")) {
          return token?.role === "admin"
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"],
}
