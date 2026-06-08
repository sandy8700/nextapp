import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("MIDDLEWARE:", req.nextUrl.pathname); 

  const token = req.cookies.get("token")?.value;

  if (
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const user = verifyToken(token);

    console.log("USER ROLE:", user.role); 
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      user.role !== "ADMIN"
    ) {
      console.log("BLOCKED ❌");
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.log("JWT ERROR", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};