import { NextRequest, NextResponse } from "next/server";
import { calibrateCrowdMetrics, getCrowdAuditRecords } from "@/services/crowdEngine";
import { getCurrentActiveUser, ADMIN_EMAIL } from "@/services/authService";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destinationId = searchParams.get("destination_id");
  const records = getCrowdAuditRecords(destinationId || undefined);
  return NextResponse.json({
    data: records,
    total: records.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Senior Developer Authorization Check: RBAC validation
    const user = await getCurrentActiveUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Directorate Administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      destination_id,
      visitor_count,
      max_capacity,
      thresholds,
      queue_length,
      trend,
    } = body;

    const actor_email = user.email || ADMIN_EMAIL;

    if (!destination_id) {
      return NextResponse.json(
        { error: "destination_id is required" },
        { status: 400 }
      );
    }

    const result = await calibrateCrowdMetrics(destination_id, actor_email, {
      visitorCountOverride: visitor_count !== undefined ? Number(visitor_count) : undefined,
      maxCapacityOverride: max_capacity !== undefined ? Number(max_capacity) : undefined,
      thresholds,
      queueLengthOverride: queue_length !== undefined ? Number(queue_length) : undefined,
      trendOverride: trend,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      snapshot: result.snapshot,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error("Calibration error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to calibrate crowd telemetry." },
      { status: 500 }
    );
  }
}
