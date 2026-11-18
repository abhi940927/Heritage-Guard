import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const code = searchParams.get("code");

  // If Supabase redirected back with an OAuth authorization code to root / or any other page
  // instead of /auth/callback, intercept and forward directly to /auth/callback
  if (code && !pathname.startsWith("/auth/callback") && !pathname.startsWith("/api/")) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("code", code);

    // Forward any optional redirect destination (defaults to homepage /)
    const redirectParam = searchParams.get("redirect") || searchParams.get("next") || "/";
    callbackUrl.searchParams.set("redirect", redirectParam);

    return NextResponse.redirect(callbackUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
