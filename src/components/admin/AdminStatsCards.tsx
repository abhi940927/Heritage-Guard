import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Landmark, Ticket, Users, Activity, TrendingUp } from "lucide-react";

interface AdminStatsCardsProps {
  totalDestinations: number;
  totalBookings: number;
  totalVisitors: number;
  averageCrowdPercent: number;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  totalDestinations,
  totalBookings,
  totalVisitors,
  averageCrowdPercent,
}) => {
  const cards = [
    {
      title: "Monitored Heritage Sites",
      value: totalDestinations,
      subtext: "ASI Protected Monuments & Caves",
      icon: Landmark,
      color: "text-amber-700",
      bg: "bg-amber-100/70",
    },
    {
      title: "Total Confirmed Bookings",
      value: totalBookings,
      subtext: "Digital Slot Reservations Active",
      icon: Ticket,
      color: "text-blue-700",
      bg: "bg-blue-100/70",
    },
    {
      title: "Managed Visitors Processed",
      value: totalVisitors,
      subtext: "Verified through Telemetry Gates",
      icon: Users,
      color: "text-emerald-700",
      bg: "bg-emerald-100/70",
    },
    {
      title: "Average Monument Occupancy",
      value: `${averageCrowdPercent}%`,
      subtext: "Across All Monitored Zones",
      icon: Activity,
      color: "text-purple-700",
      bg: "bg-purple-100/70",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <GlassCard key={i} className="p-5 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">
                {c.title}
              </span>
              <span className="text-2xl font-serif font-bold text-slate-900 block">
                {c.value}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {c.subtext}
              </span>
            </div>
            <div className={`p-3 rounded-xl ${c.bg} ${c.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
