import { CrowdReport, CrowdLevel, CrowdTrend, CrowdPrediction, MonumentCrowdTelemetry } from "@/types";
import {
  getAllMonumentsCrowdTelemetry,
  getMonumentCrowdTelemetry,
  calibrateCrowdMetrics,
  processTurnstileScan,
} from "./crowdEngine";

export interface DestinationCrowdSummary {
  destinationId: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  category: string;
  currentVisitors: number;
  maxCapacity: number;
  currentCrowdLevel: CrowdLevel;
  currentCrowdPercentage: number;
  crowdTrend: CrowdTrend;
  totalEntries: number;
  totalExits: number;
  avgEntryRatePerMin: number;
  avgExitRatePerMin: number;
  queueLength: number;
  waitTimeMinutes: number;
  entryRatePerHour: number;
  bestVisitingHours: string;
  dataSource: string;
  isSimulated: boolean;
  lastTelemetryAt: string;
  officialConservationSource: string;
  thresholds: {
    low: number;
    moderate: number;
    high: number;
  };
  predictions: {
    m15: CrowdPrediction;
    m30: CrowdPrediction;
    m60: CrowdPrediction;
  };
  hourlyTrends: {
    hour: string;
    expectedLevel: CrowdLevel;
    percentage: number;
    entries?: number;
    exits?: number;
  }[];
}

export async function getAllCrowdSummaries(): Promise<DestinationCrowdSummary[]> {
  const telemetries = await getAllMonumentsCrowdTelemetry();

  return telemetries.map((t) => ({
    destinationId: t.destination.id,
    name: t.destination.name,
    slug: t.destination.slug,
    location: t.destination.location,
    state: t.destination.state,
    category: t.destination.category,
    currentVisitors: t.snapshot.current_visitors,
    maxCapacity: t.config.max_approved_capacity,
    currentCrowdLevel: t.snapshot.crowd_status,
    currentCrowdPercentage: t.snapshot.occupancy_percentage,
    crowdTrend: t.snapshot.crowd_trend,
    totalEntries: t.snapshot.total_entries,
    totalExits: t.snapshot.total_exits,
    avgEntryRatePerMin: t.snapshot.avg_entry_rate_per_min,
    avgExitRatePerMin: t.snapshot.avg_exit_rate_per_min,
    queueLength: t.snapshot.queue_length,
    waitTimeMinutes: t.snapshot.estimated_wait_time_minutes,
    entryRatePerHour: Math.round(t.snapshot.avg_entry_rate_per_min * 60),
    bestVisitingHours: t.destination.best_visiting_hours,
    dataSource: t.snapshot.data_source,
    isSimulated: true, // Transparently labelled DEMO DATA
    lastTelemetryAt: t.snapshot.last_telemetry_at,
    officialConservationSource: t.config.official_conservation_source,
    thresholds: {
      low: t.config.threshold_low,
      moderate: t.config.threshold_moderate,
      high: t.config.threshold_high,
    },
    predictions: t.predictions,
    hourlyTrends: t.hourlyTrends,
  }));
}

export async function getCrowdSummaryBySlug(
  slug: string
): Promise<DestinationCrowdSummary | null> {
  const telemetry = await getMonumentCrowdTelemetry(slug);
  if (!telemetry) return null;

  return {
    destinationId: telemetry.destination.id,
    name: telemetry.destination.name,
    slug: telemetry.destination.slug,
    location: telemetry.destination.location,
    state: telemetry.destination.state,
    category: telemetry.destination.category,
    currentVisitors: telemetry.snapshot.current_visitors,
    maxCapacity: telemetry.config.max_approved_capacity,
    currentCrowdLevel: telemetry.snapshot.crowd_status,
    currentCrowdPercentage: telemetry.snapshot.occupancy_percentage,
    crowdTrend: telemetry.snapshot.crowd_trend,
    totalEntries: telemetry.snapshot.total_entries,
    totalExits: telemetry.snapshot.total_exits,
    avgEntryRatePerMin: telemetry.snapshot.avg_entry_rate_per_min,
    avgExitRatePerMin: telemetry.snapshot.avg_exit_rate_per_min,
    queueLength: telemetry.snapshot.queue_length,
    waitTimeMinutes: telemetry.snapshot.estimated_wait_time_minutes,
    entryRatePerHour: Math.round(telemetry.snapshot.avg_entry_rate_per_min * 60),
    bestVisitingHours: telemetry.destination.best_visiting_hours,
    dataSource: telemetry.snapshot.data_source,
    isSimulated: true,
    lastTelemetryAt: telemetry.snapshot.last_telemetry_at,
    officialConservationSource: telemetry.config.official_conservation_source,
    thresholds: {
      low: telemetry.config.threshold_low,
      moderate: telemetry.config.threshold_moderate,
      high: telemetry.config.threshold_high,
    },
    predictions: telemetry.predictions,
    hourlyTrends: telemetry.hourlyTrends,
  };
}

export async function updateDestinationCrowd(
  destinationId: string,
  level: CrowdLevel,
  percentage: number,
  trend: CrowdTrend
): Promise<boolean> {
  try {
    const telemetry = await getMonumentCrowdTelemetry(destinationId);
    const capacity = telemetry?.config.max_approved_capacity || 5000;
    const calculatedVisitors = Math.round((percentage / 100) * capacity);

    await calibrateCrowdMetrics(destinationId, "admin@heritageguard.gov.in", {
      visitorCountOverride: calculatedVisitors,
      trendOverride: trend,
    });
    return true;
  } catch (err) {
    console.error("Error updating destination crowd:", err);
    return false;
  }
}

export {
  getAllMonumentsCrowdTelemetry,
  getMonumentCrowdTelemetry,
  calibrateCrowdMetrics,
  processTurnstileScan,
};
