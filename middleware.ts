import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  // Allow all API routes to pass through untouched.
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // If user is on an auth page (login/register)
  if (isAuthPage) {
    // If they are already authenticated, redirect them to the home page
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Otherwise, let them see the page
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected page
  if (!isAuthenticated) {
    // Redirect them to the login page, preserving the intended URL
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and not on an auth page, allow the request
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static files, image optimization files, and favicons.
  // The logic to handle API routes is now inside the middleware function.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads/).*)"],
};