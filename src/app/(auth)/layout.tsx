import React from "react";
import Link from "next/link";
import { Landmark, Compass, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background Atmospheric Blur Orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sandstone-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Branding Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-slate-900 group-hover:text-amber-800 transition-colors block leading-tight">
              Heritage Guard
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
              Informatics & Smart Tourism
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 hover:bg-amber-50 hover:border-amber-300 font-semibold transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </header>

      {/* Main Dynamic Auth Container */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center py-4">
        {children}
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl w-full mx-auto pt-6 text-center text-xs text-slate-500 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official ASI & Ministry of Tourism Smart Heritage Framework</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <Link href="/about" className="hover:text-amber-800">
            About Platform
          </Link>
          <Link href="/destinations" className="hover:text-amber-800">
            Explore 16 Monuments
          </Link>
          <Link href="/contact" className="hover:text-amber-800">
            Helpline Support
          </Link>
        </div>
      </footer>
    </div>
  );
}
