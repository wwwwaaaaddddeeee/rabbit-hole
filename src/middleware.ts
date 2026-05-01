import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin") && path !== "/admin/login" && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*"] };
