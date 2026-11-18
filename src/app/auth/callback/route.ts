import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/services/authService";
import { getBaseUrl } from "@/lib/utils/url";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseUrl = getBaseUrl(request);
  const code = searchParams.get("code");
  const redirectTarget = searchParams.get("redirect") || searchParams.get("next") || "/dashboard";

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.user?.email) {
          const userEmail = data.user.email.toLowerCase();
          const isUserAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

          // Upsert Google user profile in Supabase PostgreSQL
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "Explorer",
              dob: data.user.user_metadata?.dob || "1998-05-14",
              phone_number: data.user.user_metadata?.phone_number || null,
              role: isUserAdmin ? "admin" : "visitor",
              updated_at: new Date().toISOString(),
            });
          } catch (profileErr) {
            console.warn("Could not upsert OAuth profile:", profileErr);
          }

          const response = NextResponse.redirect(new URL(redirectTarget, baseUrl));

          // Set secure session cookie
          response.cookies.set("hg_user_email", userEmail, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
          });

          return response;
        }
      }
    } catch (err) {
      console.error("OAuth code exchange error:", err);
    }
  }

  // Fallback to login with error parameter
  return NextResponse.redirect(
    new URL(`/login?error=oauth_failed&redirect=${encodeURIComponent(redirectTarget)}`, baseUrl)
  );
}
