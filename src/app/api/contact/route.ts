import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage, getContactMessagesAdmin } from "@/services/contactActions";

export async function GET() {
  const messages = await getContactMessagesAdmin();
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await submitContactMessage(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
