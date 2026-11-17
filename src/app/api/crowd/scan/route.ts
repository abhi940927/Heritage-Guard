import { NextRequest, NextResponse } from "next/server";
import { processTurnstileScan } from "@/services/crowdEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      destination_id,
      ticket_reference,
      scan_type,
      gate_id = "GATE-MAIN-01",
      scanner_device_id = "SCANNER-WEB-SIM",
    } = body;

    if (!destination_id) {
      return NextResponse.json(
        { error: "destination_id or slug is required" },
        { status: 400 }
      );
    }
    if (!ticket_reference) {
      return NextResponse.json(
        { error: "ticket_reference is required" },
        { status: 400 }
      );
    }
    if (!scan_type || !["entry", "exit"].includes(scan_type)) {
      return NextResponse.json(
        { error: "scan_type must be either 'entry' or 'exit'" },
        { status: 400 }
      );
    }

    const result = await processTurnstileScan(
      destination_id,
      ticket_reference,
      scan_type,
      gate_id,
      scanner_device_id
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          rejectionCode: result.rejectionCode,
          rejection_reason: result.rejectionCode,
          scanLog: result.scanLog,
          timestamp: new Date().toISOString(),
        },
        { status: result.rejectionCode === "ALREADY_CHECKED_IN" ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      scanLog: result.scanLog,
      updatedSnapshot: result.updatedSnapshot,
      new_visitor_count: result.updatedSnapshot?.current_visitors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Turnstile scan error:", error);
    return NextResponse.json(
      { error: "Internal error processing turnstile scan." },
      { status: 500 }
    );
  }
}
