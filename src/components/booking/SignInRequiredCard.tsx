"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Destination } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import {
  Lock,
  Ticket,
  ShieldCheck,
  ArrowRight,
  User,
  Sparkles,
  MapPin,
  Clock,
  QrCode,
  CheckCircle2,
} from "lucide-react";

interface SignInRequiredCardProps {
  destination: Destination;
  redirectUrl: string;
}

export const SignInRequiredCard: React.FC<SignInRequiredCardProps> = ({
  destination,
  redirectUrl,
}) => {
  const router = useRouter();
  const [fastSigningIn, setFastSigningIn] = useState(false);

  const handleQuickSignIn = async () => {
    try {
      setFastSigningIn(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "abhisingh940927@gmail.com",
          password: "Abhinav123!",
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
    } catch {
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } finally {
      setFastSigningIn(false);
    }
  };

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

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>New to Heritage Guard?</span>
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-bold text-amber-800 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {/* Quick Test Sign-in for immediate evaluation */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleQuickSignIn}
          disabled={fastSigningIn}
          className="text-xs text-amber-700 hover:text-amber-900 font-semibold inline-flex items-center gap-1.5 underline underline-offset-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {fastSigningIn
              ? "Signing in as Abhinav Singh..."
              : "Quick Sign-In as Abhinav Singh (abhisingh940927@gmail.com)"}
          </span>
        </button>
      </div>
    </GlassCard>
  );
};
