import { Destination, VisitingTimeSlot, TicketCategory } from "@/types";
import { INITIAL_DESTINATIONS, INITIAL_TIME_SLOTS, INITIAL_TICKET_CATEGORIES } from "./seedData";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// In-memory runtime state for mutations when Supabase live DB is not yet connected
let localDestinations: Destination[] = [...INITIAL_DESTINATIONS];

export interface DestinationFilterParams {
  search?: string;
  state?: string;
  category?: string;
  sort?: "name_asc" | "name_desc" | "price_asc" | "price_desc" | "crowd_asc";
}

export async function getDestinations(
  filters: DestinationFilterParams = {}
): Promise<Destination[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from("destinations").select("*");

      if (filters.state && filters.state !== "All") {
        query = query.eq("state", filters.state);
      }
      if (filters.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,location.ilike.%${filters.search}%,state.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = data as Destination[];
        if (filters.sort) {
          results = sortDestinations(results, filters.sort);
        }
        return results;
      }
    }
  } catch (err) {
    console.warn("Supabase query error, falling back to repository data:", err);
  }

  // Graceful fallback logic
  let results = [...localDestinations];

  if (filters.state && filters.state !== "All") {
    results = results.filter((d) => d.state.toLowerCase() === filters.state!.toLowerCase());
  }

  if (filters.category && filters.category !== "All") {
    results = results.filter((d) => d.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters.search) {
    const query = filters.search.toLowerCase().trim();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query) ||
        d.state.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
    );
  }

  if (filters.sort) {
    results = sortDestinations(results, filters.sort);
  }

  return results;
}

function sortDestinations(
  items: Destination[],
  sort: "name_asc" | "name_desc" | "price_asc" | "price_desc" | "crowd_asc"
): Destination[] {
  const sorted = [...items];
  switch (sort) {
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "price_asc":
      return sorted.sort((a, b) => a.base_ticket_price - b.base_ticket_price);
    case "price_desc":
      return sorted.sort((a, b) => b.base_ticket_price - a.base_ticket_price);
    case "crowd_asc":
      return sorted.sort((a, b) => a.current_crowd_percentage - b.current_crowd_percentage);
    default:
      return sorted;
  }
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const all = await getDestinations();
  return all.filter((d) => d.is_featured);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) {
        return data as Destination;
      }
    }
  } catch (err) {
    console.warn("Supabase query error for slug:", slug, err);
  }

  const found = localDestinations.find((d) => d.slug === slug);
  return found || null;
}

export async function getDestinationTimeSlots(
  destinationId: string
): Promise<VisitingTimeSlot[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("visiting_time_slots")
        .select("*")
        .eq("destination_id", destinationId)
        .order("start_time", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as VisitingTimeSlot[];
      }
    }
  } catch (err) {
    console.warn("Error fetching slots from Supabase:", err);
  }

  const filtered = INITIAL_TIME_SLOTS.filter(
    (slot) => slot.destination_id === destinationId
  );

  if (filtered.length > 0) return filtered;

  // Provide realistic slots if destinationId is generic
  return [
    {
      id: `slot-${destinationId}-1`,
      destination_id: destinationId,
      start_time: "08:00:00",
      end_time: "11:00:00",
      label: "Morning Batch (08:00 - 11:00)",
      max_capacity: 2500,
      expected_crowd_level: "Low",
    },
    {
      id: `slot-${destinationId}-2`,
      destination_id: destinationId,
      start_time: "11:30:00",
      end_time: "14:30:00",
      label: "Midday Batch (11:30 - 14:30)",
      max_capacity: 3500,
      expected_crowd_level: "High",
    },
    {
      id: `slot-${destinationId}-3`,
      destination_id: destinationId,
      start_time: "15:00:00",
      end_time: "18:00:00",
      label: "Sunset Batch (15:00 - 18:00)",
      max_capacity: 3000,
      expected_crowd_level: "Moderate",
    },
  ];
}

export async function getDestinationTicketCategories(
  destinationId: string
): Promise<TicketCategory[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("ticket_categories")
        .select("*")
        .eq("destination_id", destinationId)
        .order("price", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as TicketCategory[];
      }
    }
  } catch (err) {
    console.warn("Error fetching ticket categories from Supabase:", err);
  }

  const filtered = INITIAL_TICKET_CATEGORIES.filter(
    (tc) => tc.destination_id === destinationId
  );

  if (filtered.length > 0) return filtered;

  return [
    {
      id: `tc-${destinationId}-1`,
      destination_id: destinationId,
      category_name: "Indian Citizen",
      price: 50,
      currency: "INR",
      description: "General adult entry pass for Indian nationals",
    },
    {
      id: `tc-${destinationId}-2`,
      destination_id: destinationId,
      category_name: "Foreign Tourist",
      price: 550,
      currency: "INR",
      description: "International visitor entry with priority turnstile lane",
    },
    {
      id: `tc-${destinationId}-3`,
      destination_id: destinationId,
      category_name: "Child (Below 15 Years)",
      price: 0,
      currency: "INR",
      description: "Free entry with age verification document",
    },
  ];
}

export async function updateDestination(
  updatedData: Partial<Destination> & { id: string }
): Promise<Destination> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("destinations")
        .update(updatedData)
        .eq("id", updatedData.id)
        .select()
        .single();
      if (!error && data) {
        return data as Destination;
      }
    }
  } catch (err) {
    console.warn("Error updating destination in Supabase:", err);
  }

  const idx = localDestinations.findIndex((d) => d.id === updatedData.id);
  if (idx !== -1) {
    localDestinations[idx] = { ...localDestinations[idx], ...updatedData };
    return localDestinations[idx];
  }
  throw new Error("Destination not found");
}

export async function createDestination(
  newDest: Omit<Destination, "id">
): Promise<Destination> {
  const created: Destination = {
    ...newDest,
    id: `custom-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("destinations")
        .insert(created)
        .select()
        .single();
      if (!error && data) {
        return data as Destination;
      }
    }
  } catch (err) {
    console.warn("Error inserting destination into Supabase:", err);
  }

  localDestinations.unshift(created);
  return created;
}

export async function deleteDestination(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("destinations").delete().eq("id", id);
      if (!error) return true;
    }
  } catch (err) {
    console.warn("Error deleting destination from Supabase:", err);
  }

  localDestinations = localDestinations.filter((d) => d.id !== id);
  return true;
}
