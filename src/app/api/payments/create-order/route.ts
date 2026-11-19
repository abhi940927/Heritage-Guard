import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrderDirect } from "@/lib/razorpay";
import { getCurrentActiveUser } from "@/services/authService";

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce user authentication
    const user = await getCurrentActiveUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in to book monument tickets.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      amount, // In INR (e.g., 50 or 100)
      destinationName = "Heritage Monument",
      destinationSlug = "",
      visitDate = "",
      slotLabel = "",
      leadName = user.full_name,
      email = user.email,
      phone = "",
    } = body;

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid ticket tariff amount." },
        { status: 400 }
      );
    }

    // Convert amount to Indian Paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(numericAmount * 100);
    const shortReceipt = `rcpt_${Date.now().toString(36).slice(-8)}`;

    const order = await createRazorpayOrderDirect({
      amount: amountInPaise,
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        destination: String(destinationName).slice(0, 40),
        destination_slug: String(destinationSlug).slice(0, 30),
        visit_date: String(visitDate).slice(0, 20),
        slot: String(slotLabel).slice(0, 30),
        lead_visitor: String(leadName).slice(0, 40),
        contact_email: String(email).slice(0, 40),
        contact_phone: String(phone).slice(0, 20),
        user_id: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      receipt: order.receipt,
      isSimulated: order.isSimulated,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to initialize Razorpay payment order.",
      },
      { status: 500 }
    );
  }
}
