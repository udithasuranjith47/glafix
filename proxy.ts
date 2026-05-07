import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function emailFromJwt(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    return (json.email as string) ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("__session");
    const token = sessionCookie?.value;

    // No cookie → redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Cookie exists but email doesn't match admin → boot and clear cookie
    const email = emailFromJwt(token);
    if (!email || (ADMIN_EMAIL && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase())) {
      const loginUrl = new URL("/admin/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("__session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
