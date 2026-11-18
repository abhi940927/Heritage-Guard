import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentActiveUser } from "@/services/authService";
import { createNewBooking } from "@/services/bookingActions";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentActiveUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in to verify payment.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingPayload,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          error: "Missing Razorpay verification tokens (order_id, payment_id, or signature).",
        },
        { status: 400 }
      );
    }

    // Cryptographic HMAC SHA256 Signature Verification
    const secret =
      process.env.RAZORPAY_KEY_SECRET || "xwhNxGdMhPsZeqJfr2lYLKOy";

    const dataToVerify = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataToVerify)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error("Razorpay signature mismatch:", {
        generated: generatedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        {
          error: "Payment authentication failed: Invalid cryptographic signature from Razorpay.",
        },
        { status: 400 }
      );
    }

    // Attach authenticated user and verified Razorpay payment details to the reservation
    const bookingInput = {
      ...bookingPayload,
      userId: user.id,
      email: bookingPayload?.email || user.email,
      leadName: bookingPayload?.leadName || user.full_name,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "paid" as const,
      paymentMethod: "Razorpay",
    };

    const bookingResult = await createNewBooking(bookingInput);

    if (!bookingResult.success || !bookingResult.booking) {
      return NextResponse.json(
        {
          error: bookingResult.error || "Failed to confirm reservation pass after payment.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Razorpay payment verified and digital entry pass issued.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      booking: bookingResult.booking,
    });
  } catch (error: any) {
    console.error("Payment verification route error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error during payment verification.",
      },
      { status: 500 }
    );
  }
}
