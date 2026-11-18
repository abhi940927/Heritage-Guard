import { NextResponse } from "next/server";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isPlaceholder =
    !supabaseUrl ||
    supabaseUrl.includes("your-project-id") ||
    supabaseUrl.includes("placeholder");

  if (isPlaceholder) {
    return NextResponse.json({
      connected: false,
      status: "placeholder_configured",
      message:
        "Backend is currently running on the local fallback store because .env.local contains placeholder credentials (your-project-id.supabase.co).",
      configuredUrl: supabaseUrl,
      help: "To connect your real database, retrieve your Project URL and API Keys from Supabase Dashboard -> Project Settings -> API, and update .env.local.",
    });
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        connected: false,
        status: "client_initialization_failed",
        message: "Failed to initialize Supabase server client with provided credentials.",
      });
    }

    const start = Date.now();
    const { data, error } = await supabase.from("destinations").select("id").limit(1);
    const latency = Date.now() - start;

    if (error) {
      return NextResponse.json({
        connected: false,
        status: "database_query_error",
        error: error.message,
        hint: error.hint || "Verify that the database tables (destinations, bookings, profiles) exist in your Supabase project.",
      });
    }

    return NextResponse.json({
      connected: true,
      status: "healthy",
      latencyMs: latency,
      message: "Successfully connected to live Supabase PostgreSQL database.",
      sampleQueryResult: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error connecting to Supabase.";
    return NextResponse.json({
      connected: false,
      status: "network_error",
      error: message,
    });
  }
}
