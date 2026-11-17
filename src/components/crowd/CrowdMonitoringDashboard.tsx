"use client";

import React, { useState, useEffect } from "react";
import { DestinationCrowdSummary } from "@/services/crowdQueries";
import { LiveTelemetryCard } from "./LiveTelemetryCard";
import { SimulatedNotice } from "./SimulatedNotice";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Users,
  Clock,
  Activity,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  QrCode,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { TurnstileScannerModal } from "./TurnstileScannerModal";

interface CrowdMonitoringDashboardProps {
  initialSummaries: DestinationCrowdSummary[];
}

export const CrowdMonitoringDashboard: React.FC<CrowdMonitoringDashboardProps> = ({
  initialSummaries,
}) => {
  const [summaries, setSummaries] = useState<DestinationCrowdSummary[]>(initialSummaries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString("en-IN"));
  const [isGlobalScannerOpen, setIsGlobalScannerOpen] = useState(false);
  const [selectedMonumentForScan, setSelectedMonumentForScan] = useState(initialSummaries[0]?.destinationId || "");

  const states = Array.from(new Set(initialSummaries.map((s) => s.state))).sort();

  const fetchLiveTelemetry = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/crowd");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setSummaries(json.data);
          setLastUpdated(new Date().toLocaleTimeString("en-IN"));
        }
      }
    } catch (e) {
      console.warn("Could not fetch live crowd telemetry:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh cadence every 45 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLiveTelemetry();
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const filteredSummaries = summaries.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchState = selectedState === "all" || s.state.toLowerCase() === selectedState.toLowerCase();
    const matchLevel = selectedLevel === "all" || s.currentCrowdLevel.toLowerCase() === selectedLevel.toLowerCase();
    return matchSearch && matchState && matchLevel;
  });

  const lowCount = summaries.filter((s) => s.currentCrowdLevel === "Low").length;
  const modCount = summaries.filter((s) => s.currentCrowdLevel === "Moderate").length;
  const highCount = summaries.filter((s) => s.currentCrowdLevel === "High" || s.currentCrowdLevel === "Very High").length;
  const totalVisitorsAcrossAll = summaries.reduce((acc, s) => acc + s.currentVisitors, 0);

  return (
    <div className="space-y-10">
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
            <span className="text-xl font-bold text-slate-900">{lowCount} Monuments</span>
            <span className="text-[10px] text-emerald-600 block">&le; 30% occupancy</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Moderate Density</span>
            <span className="text-xl font-bold text-slate-900">{modCount} Sites</span>
            <span className="text-[10px] text-amber-600 block">Comfortable pace</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Surging / High Density</span>
            <span className="text-xl font-bold text-slate-900">{highCount} Sites</span>
            <span className="text-[10px] text-rose-600 block">Priority slot recommended</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Monitored Footfall</span>
            <span className="text-xl font-bold text-slate-900">
              {totalVisitorsAcrossAll.toLocaleString()}
            </span>
            <span className="text-[10px] text-blue-600 block">Visitors across 16 sites</span>
          </div>
        </GlassCard>
      </div>

      {/* Filters and Control Toolbar */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by monument name, city, or category..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="all">All States (10)</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="all">All Crowd Levels</option>
              <option value="low">Low Crowd</option>
              <option value="moderate">Moderate Crowd</option>
              <option value="high">High Crowd</option>
              <option value="very high">Very High Crowd</option>
            </select>

            {/* Manual Refresh Button */}
            <button
              onClick={fetchLiveTelemetry}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-600" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Global Test Turnstile Scanner Trigger */}
            <button
              onClick={() => setIsGlobalScannerOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Simulate Turnstile Gate</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filteredSummaries.length}</strong> of {summaries.length} monitored heritage sites
          </span>
          <span className="font-mono">
            Last live sync: <strong>{lastUpdated}</strong> (cadence: 45s)
          </span>
        </div>
      </GlassCard>

      {/* Live Monitored Telemetry Cards */}
      <div className="space-y-6">
        {filteredSummaries.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3">
            <Activity className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-slate-800">
              No monuments match your selected filters.
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or reset filters to view all monitored heritage sites.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("all");
                setSelectedLevel("all");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white"
            >
              Reset Filters
            </button>
          </GlassCard>
        ) : (
          filteredSummaries.map((summary) => (
            <LiveTelemetryCard
              key={summary.destinationId}
              summary={summary}
              onRefreshNeeded={fetchLiveTelemetry}
            />
          ))
        )}
      </div>

      {/* Global Turnstile Gate Simulator Modal */}
      {isGlobalScannerOpen && (
        <TurnstileScannerModal
          isOpen={isGlobalScannerOpen}
          onClose={() => setIsGlobalScannerOpen(false)}
          destinationId={selectedMonumentForScan}
          destinationName={
            summaries.find((s) => s.destinationId === selectedMonumentForScan)?.name || "Taj Mahal"
          }
          onScanCompleted={fetchLiveTelemetry}
        />
      )}
    </div>
  );
};
