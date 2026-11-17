import { NextRequest, NextResponse } from "next/server";
import { createNewBooking, getUserBookings, getAllBookingsAdmin, updateBookingStatus } from "@/services/bookingActions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || undefined;
  const isAdmin = searchParams.get("admin") === "true";

  if (isAdmin) {
    const all = await getAllBookingsAdmin();
    return NextResponse.json(all);
  }

  const bookings = await getUserBookings(email);
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createNewBooking(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result.booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid booking request" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;
    const success = await updateBookingStatus(bookingId, status);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
