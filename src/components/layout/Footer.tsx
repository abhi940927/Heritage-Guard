import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Landmark,
  Shield,
  Phone,
  Mail,
  MapPin,
  Heart,
  ExternalLink,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-900/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Heritage Guard
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              A state-of-the-art smart tourism platform empowering visitors with predictive crowd analytics, capacity-balanced time slot reservations, and architectural history, safeguarding India’s monumental legacy for generations to come.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Aligned with National Heritage Conservation Guidelines</span>
            </div>
          </div>

          {/* Quick Links: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Featured Monuments
            </h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links: Management */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Smart Tourism
            </h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.management.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links: Contact & Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Official Helpline
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.helpline}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="break-all">{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Heritage Guard Crowd Informatics Directorate. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-amber-300">
              About Platform
            </Link>
            <Link href="/contact" className="hover:text-amber-300">
              Support & Inquiries
            </Link>
            <Link href="/admin" className="hover:text-amber-300">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
