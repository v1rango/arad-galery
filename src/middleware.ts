import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

type JwtPayload = {
  userId: string;
  phone: string;
  role: "USER" | "ADMIN";
};

async function verifyTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("arad_token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedUserRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/checkout");

  if (isAdminRoute) {
    if (!token) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyTokenEdge(token);

    if (!payload) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete("arad_token");
      return response;
    }

    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isProtectedUserRoute) {
    if (!token) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyTokenEdge(token);

    if (!payload) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete("arad_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout/:path*"],
};