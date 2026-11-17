"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface DestinationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedState: string;
  onStateChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  availableStates: string[];
  availableCategories: string[];
}

export const DestinationFilters: React.FC<DestinationFiltersProps> = ({
  search,
  onSearchChange,
  selectedState,
  onStateChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onReset,
  availableStates,
  availableCategories,
}) => {
  const hasActiveFilters =
    search.trim() !== "" ||
    selectedState !== "All" ||
    selectedCategory !== "All" ||
    sortBy !== "name_asc";

  return (
    <GlassCard className="p-4 sm:p-6 mb-8 border-amber-900/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Search Destination
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="e.g. Taj Mahal, Jaipur, Fort..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Region / State
          </label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
          >
            <option value="All">All Regions / States</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Heritage Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
          >
            <option value="All">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Sort Order
            </label>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white/80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
          >
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="crowd_asc">Crowd: Least Crowded First</option>
          </select>
        </div>
      </div>
    </GlassCard>
  );
};
