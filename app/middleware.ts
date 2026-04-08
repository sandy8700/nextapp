import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  try {
    const user = verifyToken(token);
     if (req.nextUrl.pathname.startsWith("/admin")) {
      if (user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

