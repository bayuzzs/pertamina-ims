import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type Role = "admin" | "technician";

const isRole = (value: unknown): value is Role => {
  return value === "admin" || value === "technician";
};

const roleHomePath = (role: Role) => {
  return role === "admin" ? "/admin" : "/technician";
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const tokenRole = token?.role;
  const role = isRole(tokenRole) ? tokenRole : null;

  if (pathname.startsWith("/auth")) {
    if (role) {
      return NextResponse.redirect(new URL(roleHomePath(role), request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!role) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL(roleHomePath(role), request.url));
    }
  }

  if (pathname.startsWith("/technician")) {
    if (!role) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (role !== "technician") {
      return NextResponse.redirect(new URL(roleHomePath(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
