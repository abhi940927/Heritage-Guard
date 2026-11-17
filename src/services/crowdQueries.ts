import { CrowdReport, CrowdLevel, CrowdTrend } from "@/types";
import { INITIAL_CROWD_REPORTS } from "./seedData";
import { getDestinations } from "./destinationQueries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

let localCrowdReports: CrowdReport[] = [...INITIAL_CROWD_REPORTS];

export interface DestinationCrowdSummary {
  destinationId: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  category: string;
  currentCrowdLevel: CrowdLevel;
  currentCrowdPercentage: number;
  crowdTrend: CrowdTrend;
  waitTimeMinutes: number;
  entryRatePerHour: number;
  bestVisitingHours: string;
  dataSource: string;
  isSimulated: boolean;
  hourlyTrends: { hour: string; expectedLevel: CrowdLevel; percentage: number }[];
}

export async function getAllCrowdSummaries(): Promise<DestinationCrowdSummary[]> {
  const destinations = await getDestinations();

  return destinations.map((d) => {
    const report = localCrowdReports.find((r) => r.destination_id === d.id);
    const hourlyTrends = generateHourlyTrends(d.current_crowd_percentage);

    return {
      destinationId: d.id,
      name: d.name,
      slug: d.slug,
      location: d.location,
      state: d.state,
      category: d.category,
      currentCrowdLevel: d.current_crowd_level,
      currentCrowdPercentage: d.current_crowd_percentage,
      crowdTrend: d.crowd_trend,
      waitTimeMinutes: report?.wait_time_minutes ?? Math.round(d.current_crowd_percentage * 0.3),
      entryRatePerHour: report?.entry_rate_per_hour ?? Math.round(d.current_crowd_percentage * 15 + 200),
      bestVisitingHours: d.best_visiting_hours,
      dataSource: report?.data_source ?? "Simulated Heritage Informatics Model (Demo)",
      isSimulated: true, // Transparently labelled
      hourlyTrends,
    };
  });
}

export async function getCrowdSummaryBySlug(slug: string): Promise<DestinationCrowdSummary | null> {
  const all = await getAllCrowdSummaries();
  return all.find((item) => item.slug === slug) || null;
}

export async function updateDestinationCrowd(
  destinationId: string,
  level: CrowdLevel,
  percentage: number,
  trend: CrowdTrend
): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase
        .from("destinations")
        .update({
          current_crowd_level: level,
          current_crowd_percentage: percentage,
          crowd_trend: trend,
        })
        .eq("id", destinationId);

      await supabase.from("crowd_reports").insert({
        destination_id: destinationId,
        crowd_level: level,
        crowd_percentage: percentage,
        wait_time_minutes: Math.round(percentage * 0.3),
        entry_rate_per_hour: Math.round(percentage * 16 + 200),
        data_source: "Admin Manual Override Stream (Simulated Demo)",
        is_simulated: true,
      });
    }
  } catch (err) {
    console.warn("Error updating crowd in Supabase:", err);
  }

  // Update local reports
  const repIdx = localCrowdReports.findIndex((r) => r.destination_id === destinationId);
  if (repIdx !== -1) {
    localCrowdReports[repIdx] = {
      ...localCrowdReports[repIdx],
      crowd_level: level,
      crowd_percentage: percentage,
      wait_time_minutes: Math.round(percentage * 0.3),
      entry_rate_per_hour: Math.round(percentage * 16 + 200),
      recorded_at: new Date().toISOString(),
    };
  } else {
    localCrowdReports.push({
      id: `cr-${Date.now()}`,
      destination_id: destinationId,
      recorded_at: new Date().toISOString(),
      crowd_level: level,
      crowd_percentage: percentage,
      wait_time_minutes: Math.round(percentage * 0.3),
      entry_rate_per_hour: Math.round(percentage * 16 + 200),
      data_source: "Admin Manual Override Stream (Simulated Demo)",
      is_simulated: true,
    });
  }

  return true;
}

function generateHourlyTrends(basePercentage: number): {
  hour: string;
  expectedLevel: CrowdLevel;
  percentage: number;
}[] {
  const hours = [
    { hour: "06:00 AM", factor: 0.35 },
    { hour: "07:30 AM", factor: 0.5 },
    { hour: "09:00 AM", factor: 0.8 },
    { hour: "10:30 AM", factor: 1.1 },
    { hour: "12:00 PM", factor: 1.25 },
    { hour: "01:30 PM", factor: 1.15 },
    { hour: "03:00 PM", factor: 1.0 },
    { hour: "04:30 PM", factor: 0.85 },
    { hour: "06:00 PM", factor: 0.55 },
  ];

  return hours.map(({ hour, factor }) => {
    const calculated = Math.min(100, Math.max(10, Math.round(basePercentage * factor)));
    let expectedLevel: CrowdLevel = "Low";
    if (calculated >= 80) expectedLevel = "Very High";
    else if (calculated >= 65) expectedLevel = "High";
    else if (calculated >= 40) expectedLevel = "Moderate";

    return {
      hour,
      percentage: calculated,
      expectedLevel,
    };
  });
}
