import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PHONE } from "@/services/authService";
import { getBaseUrl } from "@/lib/utils/url";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseUrl = getBaseUrl(request);
  const code = searchParams.get("code");
  // Default redirect destination is the production homepage as specified
  const redirectTarget = searchParams.get("redirect") || searchParams.get("next") || "/";

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.user?.email) {
          const user = data.user;
          const userEmail = user.email!.toLowerCase();
          const isUserAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

          // Extract Google metadata
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (isUserAdmin ? ADMIN_NAME : userEmail.split("@")[0]);

          const avatarUrl =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "";

          let isNewUser = false;

          // Check if user profile already exists in PostgreSQL profiles table
          try {
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url, role")
              .eq("id", user.id)
              .maybeSingle();

            if (!existingProfile) {
              isNewUser = true;
              // Register new profile
              await supabase.from("profiles").insert({
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                role: isUserAdmin ? "admin" : "visitor",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            } else {
              // Existing profile: update login timestamp and sync avatar if available
              const updatePayload: Record<string, any> = {
                updated_at: new Date().toISOString(),
              };
              if (avatarUrl && !existingProfile.avatar_url) {
                updatePayload.avatar_url = avatarUrl;
              }
              if (isUserAdmin && existingProfile.role !== "admin") {
                updatePayload.role = "admin";
              }

              await supabase
                .from("profiles")
                .update(updatePayload)
                .eq("id", user.id);
            }
          } catch (profileErr) {
            console.warn("OAuth profile registration/update warning:", profileErr);
          }

          // Build final production redirect URL
          const finalUrl = new URL(redirectTarget, baseUrl);
          finalUrl.searchParams.set("auth_success", isNewUser ? "google_register" : "google_login");
          if (fullName) {
            finalUrl.searchParams.set("user_name", encodeURIComponent(fullName));
          }

          const response = NextResponse.redirect(finalUrl);

          // Set secure session cookie (HTTP-only)
          response.cookies.set("hg_user_email", userEmail, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });

          return response;
        }
      }
    } catch (err) {
      console.error("OAuth code exchange error:", err);
    }
  }

  // Fallback to login page with error indicator if code exchange could not be completed
  return NextResponse.redirect(
    new URL(`/login?error=oauth_failed&redirect=${encodeURIComponent(redirectTarget)}`, baseUrl)
  );
}
