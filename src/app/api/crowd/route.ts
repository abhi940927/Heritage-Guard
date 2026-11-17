import { NextRequest, NextResponse } from "next/server";
import { getAllCrowdSummaries, updateDestinationCrowd } from "@/services/crowdQueries";

export async function GET() {
  const summaries = await getAllCrowdSummaries();
  return NextResponse.json(summaries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destinationId, level, percentage, trend } = body;
    const success = await updateDestinationCrowd(
      destinationId,
      level,
      Number(percentage),
      trend
    );
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to update crowd level" }, { status: 500 });
  }
}
