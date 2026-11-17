import React from "react";
import Link from "next/link";
import { Landmark } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
            <Landmark className="w-7 h-7" />
          </div>
          <span className="font-serif font-bold text-2xl text-slate-900 group-hover:text-amber-800 transition-colors">
            Heritage Guard
          </span>
        </Link>
        <p className="text-xs text-slate-500">
          Smart Tourism & Monument Crowd Management Directorate
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>

      <div className="mt-8 text-center text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-700">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
