import React from "react";
import { Metadata } from "next";
import { getDestinations } from "@/services/destinationQueries";
import { getAllBookingsAdmin } from "@/services/bookingActions";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { DestinationManager } from "@/components/admin/DestinationManager";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShieldCheck, Lock, Activity, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Administrator Directorate Portal | Heritage Site Crowd Management",
  description:
    "Official administration console for managing monument capacities, updating live crowd telemetries, adjusting entry tariffs, and inspecting visitor reservation rosters.",
};

export default async function AdminPage() {
  const destinations = await getDestinations();
  const bookings = await getAllBookingsAdmin();

  // Statistics calculation
  const totalDestinations = destinations.length;
  const totalBookings = bookings.length;
  const totalVisitors = bookings.reduce((sum, b) => sum + (b.total_visitors || 1), 0);
  const averageCrowdPercent = Math.round(
    destinations.reduce((sum, d) => sum + d.current_crowd_percentage, 0) /
      (totalDestinations || 1)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ name: "Admin Portal", url: "/admin" }]} />

      {/* Admin Title & Security Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Monument Administration Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-400/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              Supervisory Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time management of monument capacities, tariffs, slot allocations, and crowd overrides
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Server Role: RLS Verified</span>
        </div>
      </div>

      {/* Key Metric Stats Cards */}
      <AdminStatsCards
        totalDestinations={totalDestinations}
        totalBookings={totalBookings}
        totalVisitors={totalVisitors}
        averageCrowdPercent={averageCrowdPercent}
      />

      {/* Tab / Section: Destination Management & Crowd Overrides */}
      <div className="space-y-6 pt-4">
        <DestinationManager initialDestinations={destinations} />
      </div>

      {/* Tab / Section: Booking Telemetry & Logs */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <BookingsTable initialBookings={bookings} />
      </div>
    </div>
  );
}
