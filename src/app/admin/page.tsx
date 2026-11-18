import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getDestinations } from "@/services/destinationQueries";
import { getAllBookingsAdmin } from "@/services/bookingActions";
import { getCurrentActiveUser, ADMIN_EMAIL } from "@/services/authService";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { DestinationManager } from "@/components/admin/DestinationManager";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { AdminCrowdCalibration } from "@/components/admin/AdminCrowdCalibration";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShieldCheck, Lock, Activity, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrator Directorate Portal | Heritage Site Crowd Management",
  description:
    "Official administration console for managing monument capacities, updating live crowd telemetries, adjusting entry tariffs, and inspecting visitor reservation rosters.",
};

export default async function AdminPage() {
  const user = await getCurrentActiveUser();

  // Strict Senior Developer RBAC Gate: Only single designated admin is granted access
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-md">
          <Lock className="w-8 h-8 text-amber-700" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300 inline-block">
            Strict RBAC Security Gate &bull; Directorate Supervisory
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Directorate Admin Access Required
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            This supervisory console is restricted exclusively to the designated Directorate Administrator ({ADMIN_EMAIL}). Please sign in with your verified administrator credentials to calibrate monument capacities, manage tariffs, and supervise visitor manifests.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 max-w-sm mx-auto shadow-sm text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Administrator Identity</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {ADMIN_EMAIL}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login?redirect=/admin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs hover:bg-slate-800 shadow-lg transition-all"
          >
            <span>Sign In to Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Smart Crowd Telemetry & Gate Calibration */}
      <div className="space-y-6 pt-4">
        <AdminCrowdCalibration />
      </div>

      {/* Tab / Section: Destination Management & Crowd Overrides */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <DestinationManager initialDestinations={destinations} />
      </div>

      {/* Tab / Section: Booking Telemetry & Logs */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <BookingsTable initialBookings={bookings} />
      </div>
    </div>
  );
}
