import { NextRequest, NextResponse } from "next/server";
import { getCurrentActiveUser } from "@/services/authService";
import { createNewBooking } from "@/services/bookingActions";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentActiveUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in to generate an entry pass.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingPayload } = body;

    if (!bookingPayload || !bookingPayload.destinationId || !bookingPayload.visitors?.length) {
      return NextResponse.json(
        { error: "Invalid booking payload. Destination and visitor manifest are required." },
        { status: 400 }
      );
    }

    const now = Date.now();
    const demoOrderId = `demo_ord_${now}`;
    const demoPaymentId = `demo_pay_${now}_${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingInput = {
      ...bookingPayload,
      userId: user.id,
      email: bookingPayload.email || user.email,
      leadName: bookingPayload.leadName || user.full_name,
      paymentId: demoPaymentId,
      orderId: demoOrderId,
      paymentStatus: "paid" as const,
      paymentMethod: "Demo Payment (Instant Test)",
    };

    const bookingResult = await createNewBooking(bookingInput);

    if (!bookingResult.success || !bookingResult.booking) {
      return NextResponse.json(
        { error: bookingResult.error || "Failed to confirm demo booking." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Demo payment successful. Entry pass generated.",
      booking: bookingResult.booking,
    });
  } catch (error: any) {
    console.error("Demo payment error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error processing demo payment." },
      { status: 500 }
    );
  }
}
