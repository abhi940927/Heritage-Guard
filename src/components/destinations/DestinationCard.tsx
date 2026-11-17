import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Destination } from "@/types";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { MapPin, Clock, ArrowRight, Ticket } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md border border-amber-900/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] hover:border-amber-400/40 transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Crowd Badge */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={destination.cover_image_url}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-[11px] font-medium text-amber-200 border border-white/10">
            {destination.category}
          </span>
          <CrowdStatusBadge
            level={destination.current_crowd_level}
            percentage={destination.current_crowd_percentage}
            size="sm"
          />
        </div>

        {/* Bottom image overlay info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{destination.location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
              {destination.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 whitespace-nowrap">
              {destination.state}
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {destination.short_description}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Avg. Visit: {destination.recommended_visit_duration}</span>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Starts From
            </span>
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(destination.base_ticket_price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/tickets?destination=${destination.slug}`}
              className="p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
              title="Book Visiting Time Slot"
            >
              <Ticket className="w-4 h-4" />
            </Link>
            <Link
              href={`/destinations/${destination.slug}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-amber-700 transition-colors shadow-sm"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
