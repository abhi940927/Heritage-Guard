import { NextRequest, NextResponse } from "next/server";
import { getAllCrowdSummaries, updateDestinationCrowd } from "@/services/crowdQueries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateFilter = searchParams.get("state");
    const categoryFilter = searchParams.get("category");
    const levelFilter = searchParams.get("level");

    let summaries = await getAllCrowdSummaries();

    if (stateFilter) {
      summaries = summaries.filter((s) => s.state.toLowerCase() === stateFilter.toLowerCase());
    }
    if (categoryFilter) {
      summaries = summaries.filter((s) => s.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (levelFilter) {
      summaries = summaries.filter((s) => s.currentCrowdLevel.toLowerCase() === levelFilter.toLowerCase());
    }

    return NextResponse.json({
      data: summaries,
      total_monuments: summaries.length,
      timestamp: new Date().toISOString(),
      source: "Supabase & IoT Turnstile Live Telemetry Engine",
      data_label: "DEMO DATA (Simulated for Evaluation)",
    });
  } catch (error) {
    console.error("API error fetching crowd summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch crowd telemetry data." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destinationId, level, percentage, trend } = body;

    if (!destinationId) {
      return NextResponse.json({ error: "destinationId is required" }, { status: 400 });
    }

    const success = await updateDestinationCrowd(
      destinationId,
      level,
      Number(percentage),
      trend
    );

    return NextResponse.json({
      success,
      message: "Crowd status updated successfully.",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update crowd level" }, { status: 500 });
  }
}
