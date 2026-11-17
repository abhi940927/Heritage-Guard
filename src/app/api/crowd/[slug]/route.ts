import { NextRequest, NextResponse } from "next/server";
import { getCrowdSummaryBySlug } from "@/services/crowdQueries";
import { getMonumentCrowdTelemetry } from "@/services/crowdEngine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const [summary, telemetry] = await Promise.all([
      getCrowdSummaryBySlug(slug),
      getMonumentCrowdTelemetry(slug),
    ]);

    if (!summary || !telemetry) {
      return NextResponse.json(
        { error: `Monument with slug '${slug}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: summary,
      telemetry,
      // For convenience when unwrapping top-level properties
      destination: telemetry.destination,
      config: telemetry.config,
      snapshot: telemetry.snapshot,
      predictions: telemetry.predictions,
      hourlyTrends: telemetry.hourlyTrends,
      slug: telemetry.destination.slug,
      timestamp: new Date().toISOString(),
      source: "Supabase & IoT Turnstile Live Telemetry Engine",
      data_label: "DEMO DATA (Simulated for Evaluation)",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch monument crowd telemetry." },
      { status: 500 }
    );
  }
}
