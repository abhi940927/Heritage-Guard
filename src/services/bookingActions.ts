import { Booking, BookingVisitor, BookingStatus } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { registerTicketIssuance, QR_EXPIRY_DURATION_MS } from "@/services/crowdEngine";

// In-memory runtime store for bookings in fallback/demo environment
let localBookings: Booking[] = [
  {
    id: "bk-sample-001",
    booking_reference: "HG-2026-89412",
    user_id: "demo-user-123",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    destination_name: "Taj Mahal",
    destination_slug: "taj-mahal",
    time_slot_id: "ts-taj-1",
    visit_date: "2026-11-25",
    slot_label: "Sunrise Slot (06:00 - 08:30)",
    total_visitors: 2,
    total_amount: 100,
    status: "confirmed",
    contact_email: "heritage.traveler@example.com",
    contact_phone: "+91 98765 43210",
    visitor_lead_name: "Rahul Sharma",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    qr_issued_at: new Date(Date.now() - 3600000).toISOString(),
    qr_expires_at: new Date(Date.now() - 3600000 + QR_EXPIRY_DURATION_MS).toISOString(),
    visitors: [
      {
        full_name: "Rahul Sharma",
        age: 32,
        category_name: "Indian Citizen",
        id_proof_type: "Aadhaar Card",
        id_proof_number: "XXXX-XXXX-4512",
      },
      {
        full_name: "Pooja Sharma",
        age: 29,
        category_name: "Indian Citizen",
        id_proof_type: "Passport",
        id_proof_number: "ZXXXXXX8",
      },
    ],
  },
  {
    id: "bk-sample-002",
    booking_reference: "HG-2026-67129",
    user_id: "demo-user-123",
    destination_id: "a2222222-2222-2222-2222-222222222222",
    destination_name: "Red Fort (Lal Qila)",
    destination_slug: "red-fort",
    time_slot_id: "ts-red-1",
    visit_date: "2026-12-05",
    slot_label: "Morning Batch (09:30 - 12:00)",
    total_visitors: 1,
    total_amount: 35,
    status: "confirmed",
    contact_email: "heritage.traveler@example.com",
    contact_phone: "+91 98765 43210",
    visitor_lead_name: "Rahul Sharma",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    qr_issued_at: new Date(Date.now() - 1800000).toISOString(),
    qr_expires_at: new Date(Date.now() - 1800000 + QR_EXPIRY_DURATION_MS).toISOString(),
    visitors: [
      {
        full_name: "Rahul Sharma",
        age: 32,
        category_name: "Indian Citizen",
        id_proof_type: "Aadhaar Card",
        id_proof_number: "XXXX-XXXX-4512",
      },
    ],
  },
];

export interface CreateBookingInput {
  destinationId: string;
  destinationName: string;
  destinationSlug: string;
  timeSlotId: string;
  slotLabel: string;
  visitDate: string;
  leadName: string;
  email: string;
  phone: string;
  visitors: {
    fullName: string;
    age: number;
    categoryName: string;
    idProofType?: string;
    idProofNumber?: string;
  }[];
  totalAmount: number;
  userId?: string;
}

export async function createNewBooking(
  input: CreateBookingInput
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    const reference = `HG-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    const nowMs = Date.now();
    const expiresMs = nowMs + QR_EXPIRY_DURATION_MS;

    const newBooking: Booking = {
      id: `bk-${nowMs}`,
      booking_reference: reference,
      user_id: input.userId || "guest-user",
      destination_id: input.destinationId,
      destination_name: input.destinationName,
      destination_slug: input.destinationSlug,
      time_slot_id: input.timeSlotId,
      visit_date: input.visitDate,
      slot_label: input.slotLabel,
      total_visitors: input.visitors.length,
      total_amount: input.totalAmount,
      status: "confirmed",
      contact_email: input.email,
      contact_phone: input.phone,
      visitor_lead_name: input.leadName,
      created_at: new Date(nowMs).toISOString(),
      qr_issued_at: new Date(nowMs).toISOString(),
      qr_expires_at: new Date(expiresMs).toISOString(),
      visitors: input.visitors.map((v) => ({
        full_name: v.fullName,
        age: v.age,
        category_name: v.categoryName,
        id_proof_type: v.idProofType || "Government Photo ID",
        id_proof_number: v.idProofNumber || "N/A",
      })),
    };

    // Register active 3-hour QR ticket issuance in the crowd engine
    registerTicketIssuance(reference, nowMs);

    // Attempt to persist in Supabase
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data: dbBooking, error: bookingErr } = await supabase
          .from("bookings")
          .insert({
            booking_reference: reference,
            user_id: input.userId || null,
            destination_id: input.destinationId,
            time_slot_id: input.timeSlotId,
            visit_date: input.visitDate,
            slot_label: input.slotLabel,
            total_visitors: input.visitors.length,
            total_amount: input.totalAmount,
            status: "confirmed",
            contact_email: input.email,
            contact_phone: input.phone,
            visitor_lead_name: input.leadName,
          })
          .select()
          .single();

        if (!bookingErr && dbBooking) {
          const visitorInserts = input.visitors.map((v) => ({
            booking_id: dbBooking.id,
            full_name: v.fullName,
            age: v.age,
            category_name: v.categoryName,
            id_proof_type: v.idProofType,
            id_proof_number: v.idProofNumber,
          }));

          await supabase.from("booking_visitors").insert(visitorInserts);
          newBooking.id = dbBooking.id;
        }
      }
    } catch (dbError) {
      console.warn("Supabase booking insert skipped (fallback active):", dbError);
    }

    // Always store in local array as well for immediate rendering
    localBookings.unshift(newBooking);

    return { success: true, booking: newBooking };
  } catch (err) {
    console.error("Booking creation error:", err);
    return { success: false, error: "Failed to generate reservation. Please try again." };
  }
}

export async function getUserBookings(
  emailOrUserId?: string
): Promise<Booking[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase && emailOrUserId) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, visitors:booking_visitors(*), destination:destinations(*)")
        .or(`user_id.eq.${emailOrUserId},contact_email.eq.${emailOrUserId}`)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Booking[];
      }
    }
  } catch (err) {
    console.warn("Error fetching user bookings from Supabase:", err);
  }

  // Fallback demo bookings
  return localBookings;
}

export async function getAllBookingsAdmin(): Promise<Booking[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, visitors:booking_visitors(*), destination:destinations(name, slug)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Booking[];
      }
    }
  } catch (err) {
    console.warn("Error fetching all bookings from Supabase:", err);
  }

  return localBookings;
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus
): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);
    }
  } catch (err) {
    console.warn("Error updating booking status in Supabase:", err);
  }

  const idx = localBookings.findIndex((b) => b.id === bookingId);
  if (idx !== -1) {
    localBookings[idx].status = newStatus;
    return true;
  }
  return false;
}
