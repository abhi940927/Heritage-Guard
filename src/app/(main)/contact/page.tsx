import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "./ContactForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Official Helpline | Heritage Site Crowd Management",
  description:
    "Contact the Heritage Site Crowd Management System control center for slot inquiries, accessibility arrangements, or group tourist permissions.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ name: "Contact & Helpline", url: "/contact" }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Phone className="w-3.5 h-3.5 text-amber-700" />
          <span>Support & Grievances Directorate</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          Contact & Tourism Support
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Need assistance with a scheduled reservation, group pass, or special accessibility accommodations? Our team is available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>National Helpline</span>
            </div>
            <p className="text-xs text-slate-600 font-mono">
              {siteConfig.contact.helpline}
            </p>
            <span className="text-[11px] text-slate-400 block">
              Toll-free across all Indian telecom circles
            </span>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Direct Electronic Mail</span>
            </div>
            <p className="text-xs text-slate-600 font-mono">
              {siteConfig.contact.email}
            </p>
            <span className="text-[11px] text-slate-400 block">
              Official verification & compliance responses
            </span>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Operating Shift</span>
            </div>
            <p className="text-xs text-slate-600">
              {siteConfig.contact.operationalHours}
            </p>
            <span className="text-[11px] text-slate-400 block">
              Continuous monitoring during monument hours
            </span>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Headquarters</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {siteConfig.contact.address}
            </p>
          </GlassCard>
        </div>

        {/* Form Container */}
        <div className="md:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
