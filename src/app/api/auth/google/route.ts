import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PHONE, ADMIN_DOB } from "@/services/authService";
import { getBaseUrl } from "@/lib/utils/url";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseUrl = getBaseUrl(request);
  const redirectTarget = searchParams.get("redirect") || "/";
  const callbackUrl = `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirectTarget)}`;

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
      baseUrl
    )
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name } = body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (full_name || "").trim() || "Explorer";

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid Gmail address (e.g. name@gmail.com)." },
        { status: 400 }
      );
    }

    const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

    // Check or register in local memory store
    if (globalThis.__HERITAGE_USERS__) {
      const existing = globalThis.__HERITAGE_USERS__.get(cleanEmail);
      if (!existing) {
        const newUser = {
          id: `usr-google-${Date.now()}`,
          email: cleanEmail,
          passwordHash: "",
          full_name: isUserAdmin ? ADMIN_NAME : cleanName,
          dob: isUserAdmin ? ADMIN_DOB : "1998-05-14",
          phone_number: isUserAdmin ? ADMIN_PHONE : "",
          role: (isUserAdmin ? "admin" : "visitor") as "admin" | "visitor",
          created_at: new Date().toISOString(),
        };
        globalThis.__HERITAGE_USERS__.set(cleanEmail, newUser);
        globalThis.__CURRENT_USER_SESSION__ = newUser;
      } else {
        globalThis.__CURRENT_USER_SESSION__ = existing;
      }
    }

    const response = NextResponse.json({
      success: true,
      message: `Authenticated with Google as ${isUserAdmin ? ADMIN_NAME : cleanName}!`,
      user: {
        email: cleanEmail,
        full_name: isUserAdmin ? ADMIN_NAME : cleanName,
        role: isUserAdmin ? "admin" : "visitor",
      },
    });

    response.cookies.set("hg_user_email", cleanEmail, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google Auth POST error:", error);
    return NextResponse.json(
      { error: "Failed to establish Google authenticated session." },
      { status: 500 }
    );
  }
}
