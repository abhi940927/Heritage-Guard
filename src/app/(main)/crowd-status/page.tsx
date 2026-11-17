import React from "react";
import { Metadata } from "next";
import { getAllCrowdSummaries } from "@/services/crowdQueries";
import { CrowdMonitoringDashboard } from "@/components/crowd/CrowdMonitoringDashboard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Monument Crowd Telemetry & Predictive Analytics | Heritage Guard",
  description:
    "Real-time carrying capacity monitoring, occupancy percentage, and short-term +15m/+30m/+60m arrival predictions across India's premier monitored heritage monuments.",
  keywords: [
    "heritage crowd status",
    "monument carrying capacity",
    "Taj Mahal crowd forecast",
    "Red Fort queue wait time",
    "smart tourism crowd prediction",
    "monument entry statistics",
  ],
};

export default async function CrowdStatusPage() {
  const summaries = await getAllCrowdSummaries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ name: "Crowd Monitoring", url: "/crowd-status" }]} />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300/60">
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          <span>Real-Time Density, Carrying Capacity & Short-Term Prediction Engine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Smart Crowd Monitoring & Forecast Console
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Monitor approved monument carrying capacities, current visitor occupancies, and short-term predictive forecasts across India&apos;s monitored heritage destinations. Dynamic gate telemetry integrates digital turnstile entries, exits, and queue wait times.
        </p>
      </div>

      {/* Dynamic Client-Side Interactive Dashboard with Filters, Simulator & Predictions */}
      <CrowdMonitoringDashboard initialSummaries={summaries} />
    </div>
  );
}
