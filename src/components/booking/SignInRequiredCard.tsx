"use client";

import React from "react";
import Link from "next/link";
import { Destination } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Clock,
  QrCode,
} from "lucide-react";

interface SignInRequiredCardProps {
  destination: Destination;
  redirectUrl: string;
}

export const SignInRequiredCard: React.FC<SignInRequiredCardProps> = ({
  destination,
  redirectUrl,
}) => {
  return (
    <GlassCard className="max-w-2xl mx-auto p-6 sm:p-10 space-y-8 border-2 border-amber-300 shadow-2xl bg-white/95 text-center">
      {/* Icon & Security Badge */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Explorer Sign In Required</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          Please Log In First to Book Tickets
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Under Archaeological Survey of India (ASI) regulations, tickets are crowd-governed and must be registered to a verified Gmail explorer account to generate your digital turnstile QR pass.
        </p>
      </div>

      {/* Selected Monument Preview Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-left space-y-3">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Target Sanctuary
            </span>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {destination.name}
            </h3>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{destination.location}, {destination.state}</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Live Density</span>
            <CrowdStatusBadge
              level={destination.current_crowd_level}
              percentage={destination.current_crowd_percentage}
              size="sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Fast-Track QR Turnstiles</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Capacity-Regulated Slot</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-3">
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 shadow-lg shadow-amber-600/30 transition-all text-sm"
        >
          <span>Sign In with Your Gmail to Book</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Continue with Google Option */}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
          className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </Link>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
          <span>New to Heritage Guard?</span>
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-bold text-amber-800 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};
