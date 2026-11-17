import React from "react";
import { Metadata } from "next";
import {
  getDestinations,
  getDestinationTimeSlots,
  getDestinationTicketCategories,
  getDestinationBySlug,
} from "@/services/destinationQueries";
import { getCurrentActiveUser } from "@/services/authService";
import { TicketBookingForm } from "@/components/booking/TicketBookingForm";
import { SignInRequiredCard } from "@/components/booking/SignInRequiredCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Ticket, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Ticket Booking & Time Slot Reservation | Heritage Site Management",
  description:
    "Reserve official time slots and entry passes for India's protected heritage sites including Taj Mahal, Red Fort, Amer Fort, and Qutub Minar. Transparent pricing and crowd-managed entry.",
  keywords: [
    "Taj Mahal ticket online",
    "Red Fort entry ticket",
    "monument time slot booking",
    "ASI monument tickets",
    "Amer palace visiting reservation",
  ],
};

interface TicketsPageProps {
  searchParams: Promise<{ destination?: string }>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const resolvedParams = await searchParams;
  const initialSlug = resolvedParams.destination || "taj-mahal";

  const destinations = await getDestinations();
  const selectedDest =
    (await getDestinationBySlug(initialSlug)) || destinations[0];

  const timeSlots = selectedDest
    ? await getDestinationTimeSlots(selectedDest.id)
    : [];

  const ticketCategories = selectedDest
    ? await getDestinationTicketCategories(selectedDest.id)
    : [];

  const currentUser = await getCurrentActiveUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ name: "Ticket Reservations", url: "/tickets" }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Ticket className="w-3.5 h-3.5 text-amber-700" />
          <span>Official Digital Reservation Window</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          Heritage Entry Passes &amp; Time Slots
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Select your monument, choose a crowd-governed visiting window, and register your party. Official digital vouchers with unique reference codes are generated immediately.
        </p>
      </div>

      {/* Enforce Authentication Requirement */}
      {!currentUser ? (
        <SignInRequiredCard
          destination={selectedDest}
          redirectUrl={`/tickets?destination=${selectedDest.slug}`}
        />
      ) : (
        <TicketBookingForm
          destinations={destinations}
          initialDestinationSlug={initialSlug}
          initialTimeSlots={timeSlots}
          initialTicketCategories={ticketCategories}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
