"use client";

import React, { useState, useMemo } from "react";
import { Destination } from "@/types";
import { DestinationCard } from "./DestinationCard";
import { DestinationFilters } from "./DestinationFilters";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Compass, Sparkles } from "lucide-react";

interface DestinationsExplorerProps {
  initialDestinations: Destination[];
  initialSearch?: string;
  initialState?: string;
  initialCategory?: string;
}

export const DestinationsExplorer: React.FC<DestinationsExplorerProps> = ({
  initialDestinations,
  initialSearch = "",
  initialState = "All",
  initialCategory = "All",
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("name_asc");

  // Extract unique states and categories
  const availableStates = useMemo(() => {
    const set = new Set(initialDestinations.map((d) => d.state));
    return Array.from(set).sort();
  }, [initialDestinations]);

  const availableCategories = useMemo(() => {
    const set = new Set(initialDestinations.map((d) => d.category));
    return Array.from(set).sort();
  }, [initialDestinations]);

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let list = [...initialDestinations];

    if (selectedState !== "All") {
      list = list.filter(
        (d) => d.state.toLowerCase() === selectedState.toLowerCase()
      );
    }

    if (selectedCategory !== "All") {
      list = list.filter(
        (d) => d.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "name_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "price_asc":
        return list.sort((a, b) => a.base_ticket_price - b.base_ticket_price);
      case "price_desc":
        return list.sort((a, b) => b.base_ticket_price - a.base_ticket_price);
      case "crowd_asc":
        return list.sort(
          (a, b) => a.current_crowd_percentage - b.current_crowd_percentage
        );
      default:
        return list;
    }
  }, [initialDestinations, selectedState, selectedCategory, search, sortBy]);

  const handleReset = () => {
    setSearch("");
    setSelectedState("All");
    setSelectedCategory("All");
    setSortBy("name_asc");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ name: "Explore Destinations", url: "/destinations" }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>Archaeological & Historical Registry</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          Explore Heritage Destinations
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Filter and discover timeless architectural wonders across India. Monitor live crowd forecasts and reserve your entry passes in advance.
        </p>
      </div>

      {/* Filter Component */}
      <DestinationFilters
        search={search}
        onSearchChange={setSearch}
        selectedState={selectedState}
        onStateChange={setSelectedState}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleReset}
        availableStates={availableStates}
        availableCategories={availableCategories}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
        <span>
          Showing <strong>{filteredDestinations.length}</strong> of{" "}
          <strong>{initialDestinations.length}</strong> heritage destinations
        </span>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white/70 rounded-2xl border border-slate-200 space-y-3">
          <p className="font-serif text-lg font-bold text-slate-800">
            No destinations found matching your criteria
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or resetting the active filters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-700 text-white"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
