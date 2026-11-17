import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDestinationBySlug,
  getDestinations,
  getDestinationTimeSlots,
  getDestinationTicketCategories,
} from "@/services/destinationQueries";
import { getCrowdSummaryBySlug } from "@/services/crowdQueries";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { CrowdChart } from "@/components/crowd/CrowdChart";
import { PredictionForecastWidget } from "@/components/crowd/PredictionForecastWidget";
import { SimulatedNotice } from "@/components/crowd/SimulatedNotice";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency, formatTime } from "@/lib/utils/formatters";
import {
  generateTouristAttractionSchema,
  generateBreadcrumbSchema,
} from "@/lib/utils/seoMetadata";
import {
  MapPin,
  Clock,
  Ticket,
  Calendar,
  ShieldAlert,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Destination Not Found",
    };
  }

  return {
    title: `${destination.name} - Timings, Tickets & Live Crowd Status`,
    description: `Plan your visit to ${destination.name} in ${destination.location}. View architecture history, ticket prices, official visiting hours, and crowd density forecasts.`,
    keywords: [
      `${destination.name} ticket price`,
      `${destination.name} visiting hours`,
      `best time to visit ${destination.name}`,
      `${destination.name} crowd status`,
      `${destination.name} architecture`,
    ],
    openGraph: {
      title: `${destination.name} - Heritage Site Crowd Management`,
      description: destination.short_description,
      images: [{ url: destination.cover_image_url }],
    },
  };
}

// Generate static params for all destinations
export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationDetailPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const timeSlots = await getDestinationTimeSlots(destination.id);
  const ticketCategories = await getDestinationTicketCategories(destination.id);
  const crowdSummary = await getCrowdSummaryBySlug(slug);

  const attractionSchema = generateTouristAttractionSchema(destination);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Destinations", url: "/destinations" },
    { name: destination.name, url: `/destinations/${destination.slug}` },
  ]);

  return (
    <article className="space-y-12 pb-20">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Cover Image Section */}
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={destination.cover_image_url}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 text-white">
          <Breadcrumbs
            items={[
              { name: "Destinations", url: "/destinations" },
              { name: destination.name, url: `/destinations/${destination.slug}` },
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-semibold">
                  {destination.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-slate-200 text-xs">
                  {destination.state}
                </span>
                <CrowdStatusBadge
                  level={destination.current_crowd_level}
                  percentage={destination.current_crowd_percentage}
                />
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {destination.name}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{destination.location}</span>
              </div>
            </div>

            <Link
              href={`/tickets?destination=${destination.slug}`}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Reserve Entry Slot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): History, Architecture, Culture, Guidelines */}
          <div className="lg:col-span-2 space-y-8">
            {/* Short overview */}
            <GlassCard className="p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Overview
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {destination.short_description}
              </p>
            </GlassCard>

            {/* Historical Background */}
            <GlassCard className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Historical Chronology</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Historical Background
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {destination.historical_background}
              </p>
            </GlassCard>

            {/* Architecture Details */}
            <GlassCard className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Engineering & Craftsmanship</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Architecture & Design Details
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {destination.architecture_details}
              </p>
            </GlassCard>

            {/* Cultural Importance */}
            <GlassCard className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Global Heritage Status</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Cultural Importance
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {destination.cultural_importance}
              </p>
            </GlassCard>

            {/* Visitor Guidelines & Facilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlassCard className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-base">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Visitor Guidelines</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {destination.visitor_guidelines?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>On-Site Facilities</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {destination.facilities?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Density Telemetry, Carrying Capacity & Short-Term Predictions */}
            {crowdSummary && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-2xl font-bold text-slate-900">
                      Live Carrying Capacity & Density Telemetry
                    </h3>
                    <p className="text-xs text-slate-500">
                      Citing {crowdSummary.officialConservationSource}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 self-start sm:self-auto">
                    DEMO DATA
                  </span>
                </div>

                {/* Capacity Gauge */}
                <GlassCard className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Current Monument Occupancy</span>
                    <span>
                      {crowdSummary.currentVisitors.toLocaleString()} / {crowdSummary.maxCapacity.toLocaleString()} visitors ({crowdSummary.currentCrowdPercentage}%)
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        crowdSummary.currentCrowdPercentage >= crowdSummary.thresholds.high
                          ? "bg-gradient-to-r from-orange-500 to-rose-600"
                          : crowdSummary.currentCrowdPercentage >= crowdSummary.thresholds.moderate
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${Math.min(100, crowdSummary.currentCrowdPercentage)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block">Queue Wait</span>
                      <span className="text-sm font-bold text-amber-700">{crowdSummary.waitTimeMinutes} mins</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block">Queue Length</span>
                      <span className="text-sm font-bold text-slate-800">{crowdSummary.queueLength} visitors</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block">Entry Flow</span>
                      <span className="text-sm font-bold text-emerald-700">{crowdSummary.avgEntryRatePerMin} /min</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block">Flow Trend</span>
                      <span className="text-sm font-bold text-slate-800 capitalize">{crowdSummary.crowdTrend}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Short-Term Predictions */}
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 shadow-xs">
                  <PredictionForecastWidget
                    predictions={crowdSummary.predictions}
                    config={{
                      max_approved_capacity: crowdSummary.maxCapacity,
                      threshold_low: crowdSummary.thresholds.low,
                      threshold_moderate: crowdSummary.thresholds.moderate,
                      threshold_high: crowdSummary.thresholds.high,
                    }}
                  />
                </div>

                {/* Hourly Diurnal Curve */}
                <CrowdChart
                  hourlyTrends={crowdSummary.hourlyTrends}
                  destinationName={destination.name}
                  bestVisitingHours={destination.best_visiting_hours}
                  waitTimeMinutes={crowdSummary.waitTimeMinutes}
                  entryRatePerHour={crowdSummary.entryRatePerHour}
                />
              </div>
            )}
          </div>

          {/* Right Column (1 Col Sticky): Timings, Ticket Tiers, Slot Picker */}
          <div className="space-y-6">
            {/* Visiting Timings Card */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3">
                Visiting Hours & Schedule
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Daily Opening</span>
                  <span className="font-bold text-slate-800">
                    {formatTime(destination.opening_time)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Daily Closing</span>
                  <span className="font-bold text-slate-800">
                    {formatTime(destination.closing_time)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Closed Days</span>
                  <span className="font-bold text-rose-700">
                    {destination.closed_days?.length > 0
                      ? destination.closed_days.join(", ")
                      : "Open 7 Days a Week"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Avg Duration</span>
                  <span className="font-bold text-slate-800">
                    {destination.recommended_visit_duration}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 space-y-1 border border-amber-200">
                <span className="font-bold block">Recommended Window:</span>
                <p>{destination.best_visiting_hours}</p>
              </div>
            </GlassCard>

            {/* Ticket Categories Card */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3">
                Official Entry Tariffs
              </h3>

              <div className="space-y-3">
                {ticketCategories.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {tc.category_name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(tc.price)}
                      </span>
                    </div>
                    {tc.description && (
                      <p className="text-[11px] text-slate-500">
                        {tc.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href={`/tickets?destination=${destination.slug}`}
                className="w-full py-3 rounded-xl font-semibold text-xs tracking-wide uppercase bg-slate-900 text-white hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Book Slot For This Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </GlassCard>

            {/* Time Slots Preview */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3">
                Available Entry Slots
              </h3>

              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">
                      {slot.label}
                    </span>
                    <CrowdStatusBadge
                      level={slot.expected_crowd_level}
                      size="sm"
                      showDot={false}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            <SimulatedNotice compact />
          </div>
        </div>
      </div>
    </article>
  );
}
