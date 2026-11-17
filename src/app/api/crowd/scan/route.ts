import { NextRequest, NextResponse } from "next/server";
import {
  processTurnstileScan,
  registerTicketIssuance,
  getTicketIssuanceInfo,
} from "@/services/crowdEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action = "scan",
      destination_id,
      ticket_reference,
      scan_type,
      gate_id = "GATE-MAIN-01",
      scanner_device_id = "SCANNER-WEB-SIM",
      custom_scan_timestamp_ms,
      qr_issued_timestamp_ms,
    } = body;

    // Support ticket issuance registration & renewal for dynamic 3-hour window
    if (action === "refresh" || action === "register") {
      if (!ticket_reference) {
        return NextResponse.json(
          { error: "ticket_reference is required to register or refresh ticket" },
          { status: 400 }
        );
      }
      const reg = registerTicketIssuance(
        ticket_reference,
        qr_issued_timestamp_ms || Date.now()
      );
      return NextResponse.json({
        success: true,
        message: "Dynamic QR pass registered with fresh 3-hour validity.",
        ticket_reference: ticket_reference.toUpperCase(),
        issued_at: reg.issuedAt,
        expires_at: reg.expiresAt,
        validity_hours: 3,
        is_expired: reg.isExpired,
      });
    }

    if (action === "check") {
      if (!ticket_reference) {
        return NextResponse.json(
          { error: "ticket_reference is required" },
          { status: 400 }
        );
      }
      const info = getTicketIssuanceInfo(ticket_reference);
      return NextResponse.json({
        success: true,
        ticket_reference: ticket_reference.toUpperCase(),
        ...info,
      });
    }

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
      scanner_device_id,
      {
        customScanTimestampMs: custom_scan_timestamp_ms,
        qrIssuedTimestampMs: qr_issued_timestamp_ms,
      }
    );

    if (!result.success) {
      const statusCode =
        result.rejectionCode === "QR_EXPIRED"
          ? 410 // 410 Gone / Expired
          : result.rejectionCode === "ALREADY_CHECKED_IN"
          ? 409 // 409 Conflict / Duplicate
          : 400; // Bad request / Invalid

      return NextResponse.json(
        {
          success: false,
          error: result.message,
          rejectionCode: result.rejectionCode,
          rejection_reason: result.rejectionCode,
          scanLog: result.scanLog,
          timestamp: new Date().toISOString(),
        },
        { status: statusCode }
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
