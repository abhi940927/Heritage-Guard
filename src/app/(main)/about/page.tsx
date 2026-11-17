import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ShieldCheck,
  Landmark,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Our Mission & Heritage Conservation Framework",
  description:
    "Learn about Heritage Guard's mission to balance monument preservation with world-class tourist experiences through predictive crowd analytics and capacity regulation.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Breadcrumbs items={[{ name: "About the Project", url: "/about" }]} />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Landmark className="w-3.5 h-3.5 text-amber-700" />
          <span>Conservation Through Informatics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Balancing Eternal Heritage with Mindful Exploration
        </h1>
        <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
          India&apos;s architectural heritage—spanning pristine Mughal marble tombs, rugged Rajput cliffside citadels, and millenia-old Buddhist rock-cut monasteries—represents a cultural gift to humanity. As travel expands, the tension between open public access and physical conservation requires intelligent technology.
        </p>
      </div>

      {/* Section 1: The Problem of Overcrowding */}
      <GlassCard className="p-8 space-y-5 border-amber-900/10">
        <div className="flex items-center gap-2.5 text-amber-800 font-serif font-bold text-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2>The Hidden Toll of Tourism Overcrowding</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          When thousands of tourists converge simultaneously on a heritage structure during narrow midday hours, several critical problems occur:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Microscopic Stone Abrasion
            </span>
            <p className="leading-relaxed">
              Foot traffic carrying abrasive dust slowly grinds away delicate Makrana marble paving stones and stone friezes that have endured for centuries.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Microclimate Disruption
            </span>
            <p className="leading-relaxed">
              In confined environments like the Ajanta and Ellora rock-cut caves, visitor respiration elevates ambient humidity and carbon dioxide, threatening ancient mineral frescoes.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Severe Gate Bottlenecks
            </span>
            <p className="leading-relaxed">
              Uncontrolled arrival peaks produce queue times exceeding 60 to 90 minutes in sweltering temperatures, leading to visitor exhaustion and safety hazards.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Loss of Cultural Contemplation
            </span>
            <p className="leading-relaxed">
              Overpacked courtyards drown out the contemplative acoustic harmony intended by royal architects and master builders.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Section 2: How Smart Tourism Solves This */}
      <GlassCard variant="gold" className="p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-amber-950 font-serif font-bold text-xl">
          <Lightbulb className="w-5 h-5 text-amber-700" />
          <h2>The Heritage Guard Solution: Smart Capacity Management</h2>
        </div>
        <p className="text-sm text-amber-950 leading-relaxed">
          Instead of capping visitor numbers through blunt prohibitions, Heritage Guard introduces capacity-governed time slots and predictive telemetry that gently smooths arrivals throughout the day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/70 border border-amber-300 space-y-1.5">
            <span className="font-serif font-bold text-sm text-amber-950 block">
              Predictive Distribution
            </span>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Shifting 20% to 30% of peak visitors into golden sunrise and late-afternoon windows balances daily load across operating hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-amber-300 space-y-1.5">
            <span className="font-serif font-bold text-sm text-amber-950 block">
              Guaranteed Entry Windows
            </span>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Visitors travel with confidence knowing their designated time slot ensures rapid digital turnstile check-in without queue fatigue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-amber-300 space-y-1.5">
            <span className="font-serif font-bold text-sm text-amber-950 block">
              Heritage Stewardship
            </span>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Monitored capacity thresholds protect ancient surfaces and provide archaeological authorities with continuous telemetry.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Section 3: Architecture & Technology */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Open Architecture & Modern Next.js Framework
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Heritage Guard is engineered with modern full-stack technologies including Next.js 16 App Router, React 19, Supabase PostgreSQL with Row Level Security, and accessible Tailwind CSS design tokens. Our platform is built from the ground up to integrate real hardware turnstiles, optical density sensors, and state tourism APIs.
        </p>
      </div>

      {/* CTA */}
      <div className="pt-4 flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl">
        <div>
          <h3 className="font-serif font-bold text-lg">
            Ready to explore our monitored monuments?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Check real-time crowd status or reserve your visiting slot in minutes.
          </p>
        </div>
        <Link
          href="/tickets"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
        >
          Book Your Visit
        </Link>
      </div>
    </div>
  );
}
