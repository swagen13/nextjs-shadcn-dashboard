import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Get the session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Token:", token);

  // Check if the user is trying to access the signin page
  if (req.nextUrl.pathname === "/signin") {
    // If the user is logged in, redirect them to the dashboard
    if (token) {
      console.log("User is logged in, redirecting to /dashboard");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  // Define the protected routes
  const protectedRoutes = [
    "/",
    "/users/:path*",
    "/users",
    "/profile/:path*",
    "/profile",
    "/skills",
    "/skills/:path*",
    "/subSkill",
    "/subSkill/:path*",
    "/childrenSkill",
    "/childrenSkill//:path*",
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(":path*", "(.*)?")}$`);
    return regex.test(req.nextUrl.pathname);
  });

  console.log("Is protected route:", isProtectedRoute);

  // If the user is trying to access a protected route and is not authenticated
  if (isProtectedRoute && !token) {
    console.log("User is not logged in, redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Continue to the requested page
  return NextResponse.next();
}
