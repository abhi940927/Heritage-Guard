import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getAllCrowdSummaries } from "@/services/crowdQueries";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { CrowdChart } from "@/components/crowd/CrowdChart";
import { SimulatedNotice } from "@/components/crowd/SimulatedNotice";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Activity,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  Compass,
  ArrowRight,
  Filter,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Crowd Monitoring Dashboard | Heritage Site Crowd Management",
  description:
    "Live and predicted visitor crowd monitoring across India's premier monuments. Identify peak hours, quiet visiting windows, and queue wait times.",
  keywords: [
    "heritage crowd status",
    "Taj Mahal crowd forecast",
    "Red Fort queue wait time",
    "least crowded time to visit monuments",
    "monument entry statistics",
  ],
};

export default async function CrowdStatusPage() {
  const summaries = await getAllCrowdSummaries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ name: "Crowd Monitoring", url: "/crowd-status" }]} />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          <span>Real-Time Density & Flow Telemetry</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          Crowd Monitoring Dashboard
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Monitor current occupancy levels and hourly arrival forecasts across our monitored heritage sites. By choosing off-peak visiting windows, you enjoy a more intimate cultural experience and directly support monumental conservation.
        </p>
      </div>

      {/* Notice Banner */}
      <SimulatedNotice />

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Low Footfall Sites</span>
            <span className="text-xl font-bold text-slate-900">
              {summaries.filter((s) => s.currentCrowdLevel === "Low").length} Monuments
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Moderate Density</span>
            <span className="text-xl font-bold text-slate-900">
              {summaries.filter((s) => s.currentCrowdLevel === "Moderate").length} Sites
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Surging / High Density</span>
            <span className="text-xl font-bold text-slate-900">
              {summaries.filter((s) => s.currentCrowdLevel === "High" || s.currentCrowdLevel === "Very High").length} Sites
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Capacity Governed</span>
            <span className="text-xl font-bold text-slate-900">
              100% Monitored
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Monitored Sites Breakdown Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Live Monument Status & Hourly Flow Projections
          </h2>
          <span className="text-xs text-slate-500">
            Auto-refresh cadence: 60 seconds
          </span>
        </div>

        <div className="space-y-6">
          {summaries.map((summary) => (
            <GlassCard key={summary.destinationId} className="p-6 space-y-6">
              {/* Site Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {summary.name}
                    </h3>
                    <CrowdStatusBadge
                      level={summary.currentCrowdLevel}
                      percentage={summary.currentCrowdPercentage}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {summary.location} • Trend: <strong className="capitalize">{summary.crowdTrend}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/destinations/${summary.slug}`}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
                  >
                    View Guide
                  </Link>
                  <Link
                    href={`/tickets?destination=${summary.slug}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-amber-700 transition-colors"
                  >
                    Reserve Slot
                  </Link>
                </div>
              </div>

              {/* Chart & Metrics */}
              <CrowdChart
                hourlyTrends={summary.hourlyTrends}
                destinationName={summary.name}
                bestVisitingHours={summary.bestVisitingHours}
                waitTimeMinutes={summary.waitTimeMinutes}
                entryRatePerHour={summary.entryRatePerHour}
              />
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
