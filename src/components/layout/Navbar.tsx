"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Landmark,
  Menu,
  X,
  Ticket,
  Activity,
  Compass,
  User,
  ShieldCheck,
  ChevronDown,
  Info,
  Phone,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setNavMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavMenuOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setNavMenuOpen(false);
      }
    };

    if (navMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      {/* Full width container with side padding so logo sits on the side */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16" ref={menuRef}>
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding - Positioned on the Side */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors block leading-tight">
                Heritage Guard
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
                Crowd Informatics & Smart Tourism
              </span>
            </div>
          </Link>

          {/* Right Action Elements: Clickable Navigation Trigger & Book Slot CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Navigation Toggle Button */}
            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              type="button"
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer select-none",
                navMenuOpen
                  ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/30"
                  : "bg-white/80 hover:bg-amber-50/80 text-slate-800 border-slate-300/80 hover:border-amber-400"
              )}
              aria-expanded={navMenuOpen}
              aria-label="Toggle navigation directory"
            >
              {navMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Close Menu</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Navigation Menu</span>
                  <span className="sm:hidden">Menu</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </>
              )}
            </button>

            {/* Direct Primary Call To Action */}
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Slot</span>
            </Link>
          </div>
        </div>

        {/* Expandable Glassmorphism Navigation Drawer / Directory */}
        {navMenuOpen && (
          <div className="w-full pb-8 pt-2 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-amber-900/10">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/60 shadow-2xl bg-white/90 backdrop-blur-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Monument Exploration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 pb-2 border-b border-amber-200/60">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>Monuments & Destinations</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link
                        href="/destinations"
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl font-semibold transition-colors",
                          isActive("/destinations") && pathname === "/destinations"
                            ? "bg-amber-100/80 text-amber-900"
                            : "text-slate-800 hover:bg-slate-100/70"
                        )}
                      >
                        <span>Explore All Destinations</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      </Link>
                    </li>
                    {[
                      { name: "Taj Mahal, Agra", href: "/destinations/taj-mahal" },
                      { name: "Red Fort (Lal Qila), Delhi", href: "/destinations/red-fort" },
                      { name: "Amer Fort & Palace, Jaipur", href: "/destinations/amer-fort" },
                      { name: "Qutub Minar, New Delhi", href: "/destinations/qutub-minar" },
                      { name: "Hawa Mahal, Jaipur", href: "/destinations/hawa-mahal" },
                      { name: "Ajanta & Ellora Caves, Maharashtra", href: "/destinations/ajanta-caves" },
                    ].map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:text-amber-900 hover:bg-amber-50/60 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Smart Tourism Telemetry & Reservations */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 pb-2 border-b border-amber-200/60">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span>Live Telemetry & Booking</span>
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/crowd-status"
                      className={cn(
                        "block p-3 rounded-xl border transition-all text-xs",
                        isActive("/crowd-status")
                          ? "bg-amber-100/70 border-amber-300 text-amber-950 font-semibold"
                          : "bg-white/60 border-slate-200/80 text-slate-800 hover:border-amber-300 hover:bg-amber-50/40"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                          Live Crowd Status
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                          Live
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Real-time visitor occupancy, queue wait times, and flow rates across sites.
                      </p>
                    </Link>

                    <Link
                      href="/tickets"
                      className={cn(
                        "block p-3 rounded-xl border transition-all text-xs",
                        isActive("/tickets")
                          ? "bg-amber-100/70 border-amber-300 text-amber-950 font-semibold"
                          : "bg-white/60 border-slate-200/80 text-slate-800 hover:border-amber-300 hover:bg-amber-50/40"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-amber-600" />
                          Time Slot Reservations
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">
                          Instant Pass
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Capacity-governed arrival windows with fast-track digital QR check-in.
                      </p>
                    </Link>

                    <Link
                      href="/about"
                      className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Heritage Conservation Framework</span>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Portals & Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 pb-2 border-b border-amber-200/60">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>Portals & Support</span>
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/dashboard"
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all text-xs",
                        isActive("/dashboard")
                          ? "bg-amber-100 border-amber-400 text-amber-900 font-semibold"
                          : "bg-white/70 border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/40"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold block">Visitor Dashboard</span>
                          <span className="text-[11px] text-slate-500">
                            Upcoming visits & booking passes
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      href="/admin"
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all text-xs",
                        isActive("/admin")
                          ? "bg-slate-900 border-slate-900 text-white font-semibold"
                          : "bg-slate-900/5 border-slate-200 text-slate-800 hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-900 text-amber-300">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold block">Admin Console</span>
                          <span className="text-[11px] opacity-75">
                            Tariff management & crowd override
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Contact & Official Helpline</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Row */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-amber-800 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  National Archaeological & Monument Informatics Directorate
                </span>
                <div className="flex items-center gap-4">
                  <Link href="/login" className="hover:text-amber-800 font-semibold">
                    Sign In
                  </Link>
                  <span>•</span>
                  <Link href="/register" className="hover:text-amber-800 font-semibold">
                    Register Explorer Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
