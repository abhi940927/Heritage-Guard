import React from "react";
import Link from "next/link";
import { Landmark, Shield, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-amber-900/30 py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Main Sleek Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
              Heritage Guard
            </span>
          </Link>

          {/* Clean Inline Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/destinations" className="hover:text-amber-300 transition-colors">
              Destinations
            </Link>
            <Link href="/crowd-status" className="hover:text-amber-300 transition-colors">
              Crowd Status
            </Link>
            <Link href="/tickets" className="hover:text-amber-300 transition-colors">
              Book Tickets
            </Link>
            <Link href="/about" className="hover:text-amber-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-amber-300 transition-colors">
              Contact
            </Link>
            <Link href="/dashboard" className="hover:text-amber-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-amber-300 transition-colors">
              Admin
            </Link>
          </nav>

          {/* Compact Helpline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400/90 shrink-0">
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>Helpline: +91 (011) 2307-5500</span>
          </div>
        </div>

        {/* Bottom Sub-row */}
        <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Heritage Guard Crowd Informatics Directorate. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-amber-500/80">
            <Shield className="w-3 h-3" />
            <span>National Heritage Site Conservation Directorate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
