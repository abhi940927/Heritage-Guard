"use client";

import React, { useState } from "react";
import { Destination, CrowdLevel, CrowdTrend } from "@/types";
import { CrowdStatusBadge } from "@/components/crowd/CrowdStatusBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";
import {
  Edit3,
  Plus,
  Trash2,
  Sliders,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

interface DestinationManagerProps {
  initialDestinations: Destination[];
}

export const DestinationManager: React.FC<DestinationManagerProps> = ({
  initialDestinations,
}) => {
  const [destinations, setDestinations] =
    useState<Destination[]>(initialDestinations);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [crowdModalDest, setCrowdModalDest] = useState<Destination | null>(null);

  // Form state for editing or creating
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    location: "",
    state: "Delhi",
    category: "Monument",
    short_description: "",
    base_ticket_price: 50,
    cover_image_url: "",
  });

  // Crowd override state
  const [overrideLevel, setOverrideLevel] = useState<CrowdLevel>("Moderate");
  const [overridePercent, setOverridePercent] = useState<number>(50);
  const [overrideTrend, setOverrideTrend] = useState<CrowdTrend>("stable");

  const startEdit = (dest: Destination) => {
    setEditingDest(dest);
    setIsAddingNew(false);
    setFormData({
      name: dest.name,
      slug: dest.slug,
      location: dest.location,
      state: dest.state,
      category: dest.category,
      short_description: dest.short_description,
      base_ticket_price: dest.base_ticket_price,
      cover_image_url: dest.cover_image_url,
    });
  };

  const startAddNew = () => {
    setEditingDest(null);
    setIsAddingNew(true);
    setFormData({
      name: "",
      slug: "",
      location: "",
      state: "Delhi",
      category: "Monument",
      short_description: "",
      base_ticket_price: 50,
      cover_image_url:
        "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1600&q=85",
    });
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAddingNew) {
      const newSlug =
        formData.slug.trim() ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const newDestPayload = {
        name: formData.name,
        slug: newSlug,
        location: formData.location,
        state: formData.state,
        category: formData.category,
        short_description: formData.short_description,
        historical_background: `${formData.name} is an important cultural heritage asset preserved under national guidelines.`,
        cultural_importance: "Historical and educational value for visitors and researchers.",
        architecture_details: "Built in classical regional architectural style.",
        cover_image_url:
          formData.cover_image_url ||
          "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1600&q=85",
        opening_time: "08:00:00",
        closing_time: "18:00:00",
        closed_days: [],
        visitor_guidelines: ["Valid ID required", "No plastic permitted"],
        facilities: ["Restrooms", "Drinking water"],
        recommended_visit_duration: "2 hours",
        best_visiting_hours: "Morning (09:00 - 11:30)",
        base_ticket_price: Number(formData.base_ticket_price),
        current_crowd_level: "Low" as CrowdLevel,
        current_crowd_percentage: 25,
        crowd_trend: "stable" as CrowdTrend,
        is_featured: false,
      };

      try {
        const res = await fetch("/api/destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDestPayload),
        });
        if (res.ok) {
          const created: Destination = await res.json();
          setDestinations((prev) => [created, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    } else if (editingDest) {
      const updatedPayload = {
        ...editingDest,
        ...formData,
        base_ticket_price: Number(formData.base_ticket_price),
      };

      try {
        const res = await fetch("/api/destinations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload),
        });
        if (res.ok) {
          const updated: Destination = await res.json();
          setDestinations((prev) =>
            prev.map((d) => (d.id === updated.id ? updated : d))
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    setEditingDest(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this destination?")) return;
    try {
      await fetch(`/api/destinations?id=${id}`, { method: "DELETE" });
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCrowd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crowdModalDest) return;

    try {
      await fetch("/api/crowd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: crowdModalDest.id,
          level: overrideLevel,
          percentage: overridePercent,
          trend: overrideTrend,
        }),
      });

      setDestinations((prev) =>
        prev.map((d) =>
          d.id === crowdModalDest.id
            ? {
                ...d,
                current_crowd_level: overrideLevel,
                current_crowd_percentage: overridePercent,
                crowd_trend: overrideTrend,
              }
            : d
        )
      );
      setCrowdModalDest(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-slate-900">
            Heritage Destination Management
          </h3>
          <p className="text-xs text-slate-500">
            Control monument descriptions, entry tariffs, and active crowd telemetry
          </p>
        </div>

        <Button onClick={startAddNew} variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Site
        </Button>
      </div>

      {/* Destination Records Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Monument</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Tariff</th>
                <th className="py-3.5 px-4">Live Crowd Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {destinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {dest.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {dest.state}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700 text-[11px]">
                      {dest.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatCurrency(dest.base_ticket_price)}
                  </td>
                  <td className="py-3 px-4">
                    <CrowdStatusBadge
                      level={dest.current_crowd_level}
                      percentage={dest.current_crowd_percentage}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setCrowdModalDest(dest);
                        setOverrideLevel(dest.current_crowd_level);
                        setOverridePercent(dest.current_crowd_percentage);
                        setOverrideTrend(dest.crowd_trend);
                      }}
                      className="p-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                      title="Override Crowd Level"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startEdit(dest)}
                      className="p-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      title="Edit Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                      title="Delete Site"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Edit / Add Modal */}
      {(editingDest || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-amber-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif font-bold text-lg text-slate-900">
                {isAddingNew ? "Add Heritage Monument" : `Edit ${editingDest?.name}`}
              </h4>
              <button
                onClick={() => {
                  setEditingDest(null);
                  setIsAddingNew(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Site Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Monument">Monument</option>
                    <option value="Fort">Fort</option>
                    <option value="Mausoleum">Mausoleum</option>
                    <option value="Cave Temple">Cave Temple</option>
                    <option value="Palace">Palace</option>
                    <option value="Memorial">Memorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Location Address *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Base Ticket Price (INR) *
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.base_ticket_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base_ticket_price: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingDest(null);
                    setIsAddingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crowd Level Override Modal */}
      {crowdModalDest && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-amber-300">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-slate-900">
                  Update Crowd Status
                </h4>
                <p className="text-xs text-slate-500">
                  {crowdModalDest.name}
                </p>
              </div>
              <button
                onClick={() => setCrowdModalDest(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCrowd} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Crowd Density Classification
                </label>
                <select
                  value={overrideLevel}
                  onChange={(e) =>
                    setOverrideLevel(e.target.value as CrowdLevel)
                  }
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
                >
                  <option value="Low">Low (&lt; 40%)</option>
                  <option value="Moderate">Moderate (40% - 65%)</option>
                  <option value="High">High (65% - 85%)</option>
                  <option value="Very High">Very High (&gt; 85%)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Occupancy Percentage
                  </label>
                  <span className="font-bold text-amber-800">
                    {overridePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={overridePercent}
                  onChange={(e) => setOverridePercent(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Flow Trend Direction
                </label>
                <select
                  value={overrideTrend}
                  onChange={(e) =>
                    setOverrideTrend(e.target.value as CrowdTrend)
                  }
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                >
                  <option value="rising">Rising (Incoming Surge)</option>
                  <option value="stable">Stable (Balanced Flow)</option>
                  <option value="falling">Falling (Diverging Exit)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
                Notice: Manual changes will instantly propagate to the live crowd dashboard and time slot recommendation indicators.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCrowdModalDest(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Apply Telemetry Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
