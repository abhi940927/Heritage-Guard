"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors block leading-tight">
                Heritage Guard
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700 block">
                Crowd Informatics & Smart Tourism
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {siteConfig.navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "text-amber-900 bg-amber-100/70 font-semibold shadow-sm"
                      : "text-slate-700 hover:text-amber-800 hover:bg-slate-100/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border",
                pathname.startsWith("/dashboard")
                  ? "bg-amber-100 border-amber-400 text-amber-900"
                  : "bg-white/70 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300"
              )}
            >
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border",
                pathname.startsWith("/admin")
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-slate-900/5 border-slate-300 text-slate-800 hover:bg-slate-900 hover:text-white"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Slot</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/tickets"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-900/10 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-3">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-3.5 py-2.5 rounded-xl text-base font-medium",
                isActive(link.href)
                  ? "bg-amber-100 text-amber-900 font-semibold"
                  : "text-slate-800 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-800"
            >
              <User className="w-4 h-4" />
              <span>Visitor Dashboard</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
