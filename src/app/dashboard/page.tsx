import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getUserBookings } from "@/services/bookingActions";
import { getFeaturedDestinations } from "@/services/destinationQueries";
import { getCurrentActiveUser } from "@/services/authService";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { BookingHistoryList } from "@/components/dashboard/BookingHistoryList";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  Calendar,
  Ticket,
  Bookmark,
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
  const activeUser = await getCurrentActiveUser();

  const userProfile = {
    id: activeUser?.id || "usr-abhinav-001",
    full_name: activeUser?.full_name || "Abhinav Singh",
    email: activeUser?.email || "abhinav.singh@gmail.com",
    dob: activeUser?.dob || "1998-05-14",
    phone_number: activeUser?.phone_number || "+91 98765 43210",
    role: activeUser?.role || "visitor",
    created_at: activeUser?.created_at || new Date().toISOString(),
  };

  const bookings = await getUserBookings(userProfile.email);
  const savedDestinations = await getFeaturedDestinations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ name: "Visitor Dashboard", url: "/dashboard" }]} />

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Welcome back, {userProfile.full_name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Explorer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Account verified in Supabase &bull; {userProfile.email}
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
            profile={userProfile}
            totalBookings={bookings.length}
          />

          {/* Quick Notice Card */}
          <GlassCard variant="gold" className="p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Carrying-Capacity Regulated Entry</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Your reservations guarantee priority access through fast-track digital QR turnstiles, avoiding crowded queues during peak hours.
            </p>
          </GlassCard>
        </div>

        {/* Right Column (2 Cols): Active Bookings & Recommendations */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Your Visiting Passes
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {bookings.length} active reservations
              </span>
            </div>

            <BookingHistoryList bookings={bookings} />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Curated Sanctuaries For You
                </h3>
              </div>
              <Link
                href="/destinations"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
