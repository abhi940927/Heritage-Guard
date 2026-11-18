import type { NextRequest } from "next/server";

/**
 * Returns the canonical base URL of the application.
 * Seamlessly handles:
 * 1. Production custom domain or Vercel production URL (from NEXT_PUBLIC_SITE_URL)
 * 2. Vercel deployment URLs (from VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL)
 * 3. Incoming request headers (x-forwarded-host, x-forwarded-proto) for server-side route handlers
 * 4. Client-side browser window.location.origin
 * 5. Localhost fallback for development
 */
export function getBaseUrl(request?: NextRequest): string {
  // 1. If running in the browser, always use current window origin
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Explicit production site URL from environment variables
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envSiteUrl && !envSiteUrl.includes("localhost") && !envSiteUrl.includes("127.0.0.1")) {
    let clean = envSiteUrl;
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    return clean.replace(/\/+$/, "");
  }

  // 3. Vercel system production URLs
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProdUrl) {
    return `https://${vercelProdUrl.replace(/\/+$/, "")}`;
  }

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/+$/, "")}`;
  }

  // 4. Server-side Request Headers (Proxy / Vercel Edge / CDN)
  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost.split(",")[0].trim()}`;
    }

    const host = request.headers.get("host");
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      return `https://${host}`;
    }

    if (request.nextUrl?.origin && !request.nextUrl.origin.includes("localhost")) {
      return request.nextUrl.origin;
    }
  }

  // 5. Fallback for local development
  return envSiteUrl || "http://localhost:3000";
}
