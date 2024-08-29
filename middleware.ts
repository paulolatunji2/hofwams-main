import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const protectedRoutes = [
  "/dashboard/chef",
  "/dashboard/organizer",
  "/dashboard/admin",
];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to the home page even if the user is logged in
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  if (!session && isProtected) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (session) {
    const role = session.user.role;

    let redirectURL;

    switch (role) {
      case UserRole.ADMIN:
        redirectURL = new URL("/dashboard/admin", request.nextUrl.origin);
        break;
      case UserRole.CHEF:
        redirectURL = new URL("/dashboard/chef", request.nextUrl.origin);
        break;
      default:
        redirectURL = new URL("/dashboard/organizer", request.nextUrl.origin);
        break;
    }

    if (!request.nextUrl.pathname.startsWith(redirectURL.pathname)) {
      return NextResponse.redirect(redirectURL.toString());
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
