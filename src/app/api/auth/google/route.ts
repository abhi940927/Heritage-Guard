import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTarget)}`;

  if (isServerSupabaseConfigured) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: callbackUrl,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (!error && data?.url) {
          return NextResponse.redirect(data.url);
        }
      }
    } catch (err) {
      console.error("Google OAuth server redirect error:", err);
    }
  }

  // If Supabase Google OAuth provider is not yet activated with live client IDs,
  // inform user and return to login page with clear instructions.
  return NextResponse.redirect(
    new URL(
      `/login?redirect=${encodeURIComponent(redirectTarget)}&notice=google_provider_setup`,
      origin
    )
  );
}
