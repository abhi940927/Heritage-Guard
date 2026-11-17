import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getDestinations, getFeaturedDestinations } from "@/services/destinationQueries";
import { getAllCrowdSummaries } from "@/services/crowdQueries";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { SimulatedNotice } from "@/components/crowd/SimulatedNotice";
import { GlassCard } from "@/components/ui/GlassCard";
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/utils/seoMetadata";
import {
  Compass,
  Activity,
  Ticket,
  ShieldCheck,
  Clock,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Quote,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

export const metadata = {
  title: "Discover Heritage. Travel Smarter | Heritage Site Crowd Management",
  description:
    "Experience India's majestic monuments without overcrowding. Check real-time crowd levels, book reserved visiting slots, and discover rich architectural history.",
};

export default async function HomePage() {
  const featuredDestinations = await getFeaturedDestinations();
  const allDestinations = await getDestinations();
  const crowdSummaries = await getAllCrowdSummaries();

  const websiteSchema = generateWebsiteSchema();
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="space-y-20 pb-20">
      {/* Inject Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* 1. HERO SECTION - Full Viewport Coverage (No white cut at bottom) */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center overflow-hidden py-16 sm:py-24">
        {/* Background Image with Glass Overlay covering entire screen */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85"
            alt="Majestic Taj Mahal Agra during golden sunrise"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 hero-gradient-overlay" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/85" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Tourism & Heritage Conservation Framework</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Discover Heritage. <br />
            <span className="gold-gradient-text">Travel Smarter.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Protecting our timeless monuments while elevating your travel experience. Check crowd density predictions, reserve priority entry slots, and explore architectural marvels at their most peaceful hours.
          </p>

          {/* Interactive Search Bar on Hero */}
          <div className="max-w-2xl mx-auto pt-2">
            <form
              action="/destinations"
              method="GET"
              className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/30 shadow-2xl"
            >
              <div className="flex items-center gap-2 px-3 py-2 w-full flex-1">
                <Search className="w-5 h-5 text-amber-600 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search Taj Mahal, Red Fort, Amer Palace, Caves..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-xs tracking-wide uppercase hover:from-amber-500 hover:to-amber-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Find Site</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Key CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/destinations"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white text-slate-900 hover:bg-amber-50 transition-colors shadow-lg shadow-black/20"
            >
              Explore Destinations
            </Link>
            <Link
              href="/crowd-status"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/40 hover:bg-slate-900 transition-colors"
            >
              Check Crowd Levels
            </Link>
            <Link
              href="/tickets"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 transition-all shadow-lg shadow-amber-600/30"
            >
              Plan Your Visit
            </Link>
          </div>

          {/* Subtle Scroll Guide */}
          <div className="pt-6 flex flex-col items-center justify-center text-xs text-amber-300/80 animate-pulse">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Explore Live Crowd Telemetry Below
            </span>
            <ChevronRight className="w-4 h-4 rotate-90 mt-1" />
          </div>
        </div>
      </section>

      {/* 2. LIVE CROWD OVERVIEW WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <GlassCard className="p-6 sm:p-8 space-y-6 border-amber-900/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                  Live Monument Density & Crowd Overview
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Current telemetry status and entry queue flow across key historical sites
              </p>
            </div>

            <Link
              href="/crowd-status"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors group"
            >
              <span>Full Analytics Dashboard</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crowdSummaries.slice(0, 4).map((c) => (
              <div
                key={c.destinationId}
                className="p-4 rounded-xl bg-white/70 border border-slate-200/80 space-y-2 hover:border-amber-400/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {c.name}
                  </span>
                  <CrowdStatusBadge level={c.currentCrowdLevel} size="sm" />
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Est. Wait: <strong>{c.waitTimeMinutes} mins</strong></span>
                  <span className="capitalize text-slate-700 font-medium">{c.crowdTrend} trend</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      c.currentCrowdPercentage > 75
                        ? "bg-rose-500"
                        : c.currentCrowdPercentage > 45
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${c.currentCrowdPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <SimulatedNotice compact />
        </GlassCard>
      </section>

      {/* 3. FEATURED HERITAGE DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Iconic Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Featured Heritage Destinations
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Immerse yourself in UNESCO World Heritage sites, royal palaces, and monolithic wonders with optimal visiting time suggestions.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-amber-700 transition-colors"
          >
            <span>View All ({allDestinations.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDestinations.slice(0, 6).map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      {/* 4. HOW THE PLATFORM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Seamless Tourism Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            How Heritage Guard Works
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Four simple steps to transform your historical visits from stressful overcrowded queues into serene cultural discoveries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discover & Learn",
              desc: "Explore verified architectural history, monument timings, and official visitor guidelines.",
              icon: Compass,
            },
            {
              step: "02",
              title: "Check Crowd Status",
              desc: "Inspect live and forecasted visitor densities to discover peaceful visiting hours.",
              icon: Activity,
            },
            {
              step: "03",
              title: "Reserve Time Slot",
              desc: "Choose a capacity-governed visiting slot with transparent government-approved tariffs.",
              icon: CalendarCheck,
            },
            {
              step: "04",
              title: "Fast-Track Entry",
              desc: "Present your digital verification pass at turnstiles for instant admission without ticket lines.",
              icon: Ticket,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <GlassCard key={idx} hoverEffect className="space-y-4 relative">
                <span className="font-serif font-bold text-4xl text-amber-200/80 block">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* 5. BENEFITS OF SMART TOURISM */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-amber-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Conservation & Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Why Smart Crowd Management Matters
            </h2>
            <p className="text-sm text-slate-400">
              Uncontrolled surges accelerate the degradation of fragile sandstone and marble structures while diminishing visitor satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">
                Structural Preservation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Regulating peak footfall reduces microscopic abrasion on ancient marble plinths and curtails moisture spikes inside sealed cave sanctuaries like Ajanta and Ellora.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">
                Zero Queue Waiting Times
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visitors with reserved slots bypass lengthy on-site ticketing queues in harsh sun, cutting security check times from 45+ minutes to under 8 minutes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">
                Atmosphere & Serenity
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Appreciating the symphony of Persian calligraphy, Rajput mirrorwork, or rock-cut chaitya halls requires contemplative quietude rather than congested corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VISITOR TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Traveler Voices
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            What Visitors Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Using Heritage Guard, we booked the 06:00 AM sunrise slot for the Taj Mahal. The crowd prediction said 25% occupancy and it was exactly that: calm, misty, and breathtaking without waiting in line.",
              name: "Siddharth & Meera Roy",
              location: "Bengaluru, India",
            },
            {
              quote:
                "As an architectural historian, visiting Ellora Caves without the midday tour bus surge was magical. The platform's recommended visiting hours saved us hours of queue time.",
              name: "Elena Rostova",
              location: "Prague, Czech Republic",
            },
            {
              quote:
                "Booking our family slots for Amer Fort with the digital pass was straightforward. The instant confirmation and guidelines were clear and reassuring for our senior parents.",
              name: "Harishankar Joshi",
              location: "Ahmedabad, India",
            },
          ].map((t, idx) => (
            <GlassCard key={idx} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-amber-500/60" />
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <span className="font-serif font-bold text-slate-900 text-sm block">
                  {t.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {t.location}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the crowd prediction model work?",
              a: "Our system combines historical hourly gate statistics, seasonal tourism trends, and real-time turnstile telemetry to forecast visitor density in 2-hour increments.",
            },
            {
              q: "Can I enter outside my reserved visiting time slot?",
              a: "To prevent bottleneck surges at security gates, visitors are granted entry within a 30-minute buffer window around their booked slot.",
            },
            {
              q: "Is photography permitted at all heritage sites?",
              a: "Still photography for non-commercial use is permitted at most sites. However, tripods and drones are strictly prohibited, and camera flash is forbidden inside Ajanta Caves to prevent pigment damage.",
            },
            {
              q: "What identification documents do I need to carry?",
              a: "Indian citizens must present a valid government photo ID (Aadhaar, Passport, Voter ID, or Driving License). Foreign nationals must present their original passport.",
            },
          ].map((faq, idx) => (
            <GlassCard key={idx} className="p-5 space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-start gap-2">
                <span className="text-amber-700">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard variant="gold" className="p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950">
            Ready to Experience Heritage Without the Crowds?
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-amber-900 leading-relaxed">
            Reserve your visiting window today and help preserve India&apos;s cultural legacy through sustainable, mindful travel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tickets"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 shadow-md transition-all"
            >
              Book Entry Slot Now
            </Link>
            <Link
              href="/destinations"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/80 border border-amber-300 text-slate-900 hover:bg-white transition-all"
            >
              Explore All 8 Destinations
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
