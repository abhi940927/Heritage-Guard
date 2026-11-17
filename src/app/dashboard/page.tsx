import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getUserBookings } from "@/services/bookingActions";
import { getFeaturedDestinations } from "@/services/destinationQueries";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { BookingHistoryList } from "@/components/dashboard/BookingHistoryList";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  Calendar,
  Ticket,
  Bookmark,
  Settings,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Explorer Dashboard | Heritage Site Crowd Management",
  description:
    "Manage your heritage visiting passes, upcoming monument slots, and personal profile settings.",
};

export default async function DashboardPage() {
  const bookings = await getUserBookings("heritage.traveler@example.com");
  const savedDestinations = await getFeaturedDestinations();

  const mockProfile = {
    id: "usr-demo-123",
    full_name: "Rahul Sharma",
    avatar_url: "",
    phone_number: "+91 98765 43210",
    role: "visitor" as const,
    created_at: "2026-01-15T10:00:00Z",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ name: "Visitor Dashboard", url: "/dashboard" }]} />

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Welcome back, {mockProfile.full_name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Explorer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Track your reserved heritage arrival passes and plan upcoming visits.
          </p>
        </div>

        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 shadow-md shadow-amber-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Slot</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (1 Col): Profile Info & Quick Stats */}
        <div className="space-y-6">
          <UserProfileCard
            profile={mockProfile}
            totalBookings={bookings.length}
          />

          {/* Quick Notice Card */}
          <GlassCard variant="gold" className="p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Digital Check-in Instructions</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Arrive at the monument entry gate within your 30-minute arrival window. Present the QR code voucher or quote your booking reference number directly to gate security personnel.
            </p>
          </GlassCard>
        </div>

        {/* Right Column (2 Cols): Active Bookings & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-600" />
              <h2 className="font-serif font-bold text-xl text-slate-900">
                Your Scheduled Visits & Entry Passes
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {bookings.length} active pass(es)
            </span>
          </div>

          <BookingHistoryList bookings={bookings} />

          {/* Saved / Recommended Destinations */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  Recommended For Your Next Trip
                </h3>
              </div>
              <Link
                href="/destinations"
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                Browse All Sites →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedDestinations.slice(0, 2).map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
