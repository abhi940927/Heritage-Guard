import {
  CrowdLevel,
  CrowdTrend,
  Destination,
  DestinationCrowdConfig,
  VisitorAccessLog,
  CrowdLiveSnapshot,
  CrowdPrediction,
  CrowdAuditRecord,
  MonumentCrowdTelemetry,
} from "@/types";
import { INITIAL_DESTINATIONS } from "./seedData";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ============================================================================
// DEFAULT MONUMENT CAPACITIES & CONFIGURABLE THRESHOLDS
// Citing Official ASI Conservation Carrying Capacity Framework
// ============================================================================
export const DEFAULT_CROWD_CONFIGS: Record<string, DestinationCrowdConfig> = {
  // Taj Mahal: World Heritage Mausoleum with strict sensitive marble carrying capacity
  "taj-mahal": {
    destination_id: "a1111111-1111-1111-1111-111111111111",
    max_approved_capacity: 12000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 45.0,
    baseline_visitor_count: 9360, // 78% occupancy
    official_conservation_source: "ASI Agra Circle Carrying Capacity Directives (2024)",
  },
  // Red Fort: Expansive Mughal citadel with multiple broad courtyards
  "red-fort": {
    destination_id: "a2222222-2222-2222-2222-222222222222",
    max_approved_capacity: 8500,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 35.0,
    baseline_visitor_count: 4420, // 52% occupancy
    official_conservation_source: "ASI Delhi Circle Heritage Conservation Plan",
  },
  // Qutub Minar: Archaeological park anchoring Delhi's oldest Islamic enclave
  "qutub-minar": {
    destination_id: "a3333333-3333-3333-3333-333333333333",
    max_approved_capacity: 4000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 30.0,
    baseline_visitor_count: 1120, // 28% occupancy
    official_conservation_source: "Mehrauli Archaeological Park Safety Mandate",
  },
  // Hawa Mahal: Multi-tier palace facade with narrow interior ramps
  "hawa-mahal": {
    destination_id: "a4444444-4444-4444-4444-444444444444",
    max_approved_capacity: 3500,
    threshold_low: 25,
    threshold_moderate: 55,
    threshold_high: 80,
    queue_service_rate_per_min: 25.0,
    baseline_visitor_count: 2870, // 82% occupancy
    official_conservation_source: "Jaipur Walled City Heritage Directorate",
  },
  // Amer Fort: Hilltop fortress with cobblestone corridors and Sheesh Mahal
  "amer-fort": {
    destination_id: "a5555555-5555-5555-5555-555555555555",
    max_approved_capacity: 6500,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 30.0,
    baseline_visitor_count: 4160, // 64% occupancy
    official_conservation_source: "Rajasthan Tourism Development Corporation (RTDC)",
  },
  // India Gate: Broad open ceremonial plaza and war memorial
  "india-gate": {
    destination_id: "a6666666-6666-6666-6666-666666666666",
    max_approved_capacity: 15000,
    threshold_low: 35,
    threshold_moderate: 65,
    threshold_high: 85,
    queue_service_rate_per_min: 60.0,
    baseline_visitor_count: 13650, // 91% occupancy
    official_conservation_source: "Central Secretariat & NDMC Public Gathering Guideline",
  },
  // Ajanta Caves: Sensitive volcanic basalt rock sanctuaries
  "ajanta-caves": {
    destination_id: "a7777777-7777-7777-7777-777777777777",
    max_approved_capacity: 2500,
    threshold_low: 25,
    threshold_moderate: 50,
    threshold_high: 75,
    queue_service_rate_per_min: 20.0,
    baseline_visitor_count: 600, // 24% occupancy
    official_conservation_source: "UNESCO World Heritage In Situ Pigment Protection Norms",
  },
  // Ellora Caves: Multi-religious monolithic cliff excavations
  "ellora-caves": {
    destination_id: "a8888888-8888-8888-8888-888888888888",
    max_approved_capacity: 4500,
    threshold_low: 25,
    threshold_moderate: 55,
    threshold_high: 80,
    queue_service_rate_per_min: 25.0,
    baseline_visitor_count: 2160, // 48% occupancy
    official_conservation_source: "ASI Chhatrapati Sambhaji Nagar Circle",
  },
  // Gateway of India: Maritime waterfront triumphal promenade
  "gateway-of-india": {
    destination_id: "a9999999-9999-9999-9999-999999999999",
    max_approved_capacity: 10000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 50.0,
    baseline_visitor_count: 8800, // 88% occupancy
    official_conservation_source: "Mumbai Port Trust & Heritage Conservation Committee",
  },
  // Konark Sun Temple: Khondalite stone cosmic chariot
  "konark-sun-temple": {
    destination_id: "b1111111-1111-1111-1111-111111111111",
    max_approved_capacity: 4000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 30.0,
    baseline_visitor_count: 2320, // 58% occupancy
    official_conservation_source: "Odisha State Archaeological Directorate",
  },
  // Hampi Group of Monuments: 41 sq km open ruins of Vijayanagara Empire
  "hampi-monuments": {
    destination_id: "b2222222-2222-2222-2222-222222222222",
    max_approved_capacity: 5000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 30.0,
    baseline_visitor_count: 1600, // 32% occupancy
    official_conservation_source: "Hampi World Heritage Area Management Authority",
  },
  // Meenakshi Amman Temple: Living spiritual sanctuary with soaring gopurams
  "meenakshi-temple": {
    destination_id: "b3333333-3333-3333-3333-333333333333",
    max_approved_capacity: 8000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 40.0,
    baseline_visitor_count: 6720, // 84% occupancy
    official_conservation_source: "HR&CE Department Tamil Nadu Crowd Management Manual",
  },
  // Victoria Memorial Hall: 64-acre heritage garden and marble museum
  "victoria-memorial": {
    destination_id: "b4444444-4444-4444-4444-444444444444",
    max_approved_capacity: 6000,
    threshold_low: 30,
    threshold_moderate: 60,
    threshold_high: 85,
    queue_service_rate_per_min: 35.0,
    baseline_visitor_count: 3600, // 60% occupancy
    official_conservation_source: "Victoria Memorial Board of Trustees Safety Protocol",
  },
  // Golden Temple: Sacred gilded gurdwara floating in Amrit Sarovar
  "golden-temple": {
    destination_id: "b5555555-5555-5555-5555-555555555555",
    max_approved_capacity: 25000,
    threshold_low: 35,
    threshold_moderate: 65,
    threshold_high: 85,
    queue_service_rate_per_min: 80.0,
    baseline_visitor_count: 23500, // 94% occupancy
    official_conservation_source: "SGPC Pilgrim Safety & Sarovar Carrying Norms",
  },
  // Buddhist Monuments at Sanchi: Mauryan dome and Ashokan toranas
  "sanchi-stupa": {
    destination_id: "b6666666-6666-6666-6666-666666666666",
    max_approved_capacity: 2500,
    threshold_low: 25,
    threshold_moderate: 50,
    threshold_high: 75,
    queue_service_rate_per_min: 20.0,
    baseline_visitor_count: 550, // 22% occupancy
    official_conservation_source: "ASI Bhopal Circle Archaeological Protection Code",
  },
  // Sree Padmanabhaswamy Temple: Royal Travancore temple
  "padmanabhaswamy-temple": {
    destination_id: "b7777777-7777-7777-7777-777777777777",
    max_approved_capacity: 5000,
    threshold_low: 25,
    threshold_moderate: 55,
    threshold_high: 80,
    queue_service_rate_per_min: 25.0,
    baseline_visitor_count: 3800, // 76% occupancy
    official_conservation_source: "Travancore Royal Trust Temple Crowd Security Directives",
  },
};

// ============================================================================
// IN-MEMORY ACTIVE STATE FOR LIVE CALCULATIONS, SCAN SIMULATION & AUDIT
// ============================================================================
class SmartCrowdEngineState {
  private static instance: SmartCrowdEngineState;

  public configs: Map<string, DestinationCrowdConfig> = new Map();
  public snapshots: Map<string, CrowdLiveSnapshot> = new Map();
  public scans: VisitorAccessLog[] = [];
  public auditTrail: CrowdAuditRecord[] = [];
  public activeInsideTickets: Map<string, Set<string>> = new Map(); // destination_id -> Set of ticket references inside
  public ticketIssuanceTimestamps: Map<string, number> = new Map(); // ticket_reference -> issuance timestamp (ms)

  private constructor() {
    this.initDefaults();
  }

  public static getInstance(): SmartCrowdEngineState {
    if (!SmartCrowdEngineState.instance) {
      SmartCrowdEngineState.instance = new SmartCrowdEngineState();
    }
    return SmartCrowdEngineState.instance;
  }

  private initDefaults() {
    for (const [slug, cfg] of Object.entries(DEFAULT_CROWD_CONFIGS)) {
      this.configs.set(cfg.destination_id, cfg);
      this.configs.set(slug, cfg);
      this.activeInsideTickets.set(cfg.destination_id, new Set());

      // Find matching destination
      const dest = INITIAL_DESTINATIONS.find((d) => d.slug === slug || d.id === cfg.destination_id);
      if (!dest) continue;

      const previousVisitors = Math.round(cfg.baseline_visitor_count * 0.92);
      const totalEntries = Math.round(cfg.baseline_visitor_count * 0.28);
      const totalExits = Math.round(cfg.baseline_visitor_count * 0.20);
      const currentVisitors = calculateCurrentVisitors(previousVisitors, totalEntries, totalExits);
      const occupancyPercentage = calculateOccupancyPercentage(currentVisitors, cfg.max_approved_capacity);
      const crowdStatus = evaluateCrowdCategory(occupancyPercentage, cfg);
      const entryRatePerMin = Number((dest.current_crowd_percentage * 0.28 + 2.5).toFixed(2));
      const exitRatePerMin = Number((entryRatePerMin * (dest.crowd_trend === 'rising' ? 0.82 : dest.crowd_trend === 'falling' ? 1.18 : 0.98)).toFixed(2));
      const queueLength = Math.round(dest.current_crowd_percentage * 3.8);
      const estimatedWaitTime = calculateEntranceWaitTime(queueLength, cfg.queue_service_rate_per_min);

      const snapshot: CrowdLiveSnapshot = {
        id: `snap-${dest.slug}`,
        destination_id: dest.id,
        destination_name: dest.name,
        destination_slug: dest.slug,
        recorded_at: new Date().toISOString(),
        previous_visitors: previousVisitors,
        total_entries: totalEntries,
        total_exits: totalExits,
        current_visitors: currentVisitors,
        max_capacity: cfg.max_approved_capacity,
        occupancy_percentage: occupancyPercentage,
        crowd_status: crowdStatus,
        avg_entry_rate_per_min: entryRatePerMin,
        avg_exit_rate_per_min: exitRatePerMin,
        queue_length: queueLength,
        estimated_wait_time_minutes: estimatedWaitTime,
        crowd_trend: dest.crowd_trend,
        data_source: "Optical Turnstile & IoT Sensor Stream (Demo Data)",
        is_simulated: true, // Transparently labelled as simulated demo data
        last_telemetry_at: new Date().toISOString(),
        thresholds: {
          low: cfg.threshold_low,
          moderate: cfg.threshold_moderate,
          high: cfg.threshold_high,
        },
      };

      this.snapshots.set(dest.id, snapshot);
      this.snapshots.set(dest.slug, snapshot);

      // Seed 2 initial sample access logs
      this.scans.push({
        id: `scan-init-${dest.slug}-1`,
        destination_id: dest.id,
        ticket_reference: `HG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        scan_type: "entry",
        gate_id: "GATE-NORTH-MAIN",
        scanner_device_id: "SCANNER-DESK-01",
        scanned_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        is_valid: true,
      });
      this.scans.push({
        id: `scan-init-${dest.slug}-2`,
        destination_id: dest.id,
        ticket_reference: `HG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        scan_type: "exit",
        gate_id: "GATE-SOUTH-EXIT",
        scanner_device_id: "SCANNER-DESK-02",
        scanned_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        is_valid: true,
      });
    }
  }
}

const state = SmartCrowdEngineState.getInstance();

// ============================================================================
// CORE MATHEMATICAL FORMULAS
// ============================================================================

/**
 * Crowd Calculation Formula 1:
 * Current Visitors = Previous Visitors + Total Entries - Total Exits (clamped >= 0)
 */
export function calculateCurrentVisitors(
  previousVisitors: number,
  totalEntries: number,
  totalExits: number
): number {
  return Math.max(0, previousVisitors + totalEntries - totalExits);
}

/**
 * Crowd Calculation Formula 2:
 * Occupancy Percentage = (Current Visitors / Maximum Capacity) * 100
 */
export function calculateOccupancyPercentage(
  currentVisitors: number,
  maxCapacity: number
): number {
  if (maxCapacity <= 0) return 0;
  const raw = (currentVisitors / maxCapacity) * 100;
  return Number(Math.min(100, Math.max(0, raw)).toFixed(1));
}

/**
 * Configurable Destination Threshold Classification:
 * - 0 - threshold_low %: Low Crowd
 * - threshold_low - threshold_moderate %: Moderate Crowd
 * - threshold_moderate - threshold_high %: High Crowd
 * - threshold_high - 100 %: Very High Crowd
 */
export function evaluateCrowdCategory(
  occupancyPercentage: number,
  config: DestinationCrowdConfig
): CrowdLevel {
  const { threshold_low, threshold_moderate, threshold_high } = config;
  if (occupancyPercentage <= threshold_low) return "Low";
  if (occupancyPercentage <= threshold_moderate) return "Moderate";
  if (occupancyPercentage <= threshold_high) return "High";
  return "Very High";
}

/**
 * Entrance Queue Waiting Time Calculation:
 * Wait Time = round(Queue Length / Service Processing Rate per minute)
 * Measured distinctly from total internal monument occupancy.
 */
export function calculateEntranceWaitTime(
  queueLength: number,
  queueServiceRatePerMin: number
): number {
  if (queueLength <= 0 || queueServiceRatePerMin <= 0) return 0;
  return Math.max(0, Math.round(queueLength / queueServiceRatePerMin));
}

/**
 * Crowd Trend Evaluation based on measured flow differentials:
 */
export function calculateCrowdTrend(
  entryRate: number,
  exitRate: number
): CrowdTrend {
  const delta = entryRate - exitRate;
  if (delta > entryRate * 0.08) return "rising";
  if (delta < -entryRate * 0.08) return "falling";
  return "stable";
}

// ============================================================================
// SHORT-TERM PREDICTION ENGINE (15m, 30m, 60m Horizons)
// ============================================================================

/**
 * Expected Visitors = Current Visitors + Predicted Entries - Predicted Exits
 * Predicted Entries = round(entryRatePerMin * horizonMinutes * dampingFactor)
 * Predicted Exits   = round(exitRatePerMin  * horizonMinutes * dampingFactor)
 */
export function generateShortTermPredictions(
  currentVisitors: number,
  maxCapacity: number,
  entryRatePerMin: number,
  exitRatePerMin: number,
  config: DestinationCrowdConfig
): {
  m15: CrowdPrediction;
  m30: CrowdPrediction;
  m60: CrowdPrediction;
} {
  const horizons: (15 | 30 | 60)[] = [15, 30, 60];
  const now = new Date().toISOString();

  const predictions: Record<string, CrowdPrediction> = {};

  for (const h of horizons) {
    // Damping factor accounts for arrival waves and physical queue limits
    const timeFactor = h === 15 ? 1.0 : h === 30 ? 0.95 : 0.88;
    const predictedEntries = Math.round(entryRatePerMin * h * timeFactor);
    const predictedExits = Math.round(exitRatePerMin * h * timeFactor);

    const expectedVisitors = Math.max(
      0,
      Math.min(Math.round(maxCapacity * 1.05), currentVisitors + predictedEntries - predictedExits)
    );
    const predictedOccupancy = calculateOccupancyPercentage(expectedVisitors, maxCapacity);
    const expectedCategory = evaluateCrowdCategory(predictedOccupancy, config);
    const predictedTrend = calculateCrowdTrend(predictedEntries / h, predictedExits / h);

    predictions[`m${h}`] = {
      destination_id: config.destination_id,
      generated_at: now,
      horizon_minutes: h,
      predicted_entries: predictedEntries,
      predicted_exits: predictedExits,
      expected_visitors: expectedVisitors,
      predicted_occupancy_percentage: predictedOccupancy,
      expected_crowd_category: expectedCategory,
      predicted_crowd_trend: predictedTrend,
      is_simulated: true, // Transparently labelled
    };
  }

  return {
    m15: predictions["m15"],
    m30: predictions["m30"],
    m60: predictions["m60"],
  };
}

// ============================================================================
// TURNSTILE TICKET SCANNING ENGINE (DUPLICATE DETECTION & AUDIT)
// ============================================================================
// 3-HOUR QR CODE EXPIRATION CONFIGURATION & HELPERS
// ============================================================================
export const QR_EXPIRY_DURATION_MS = 3 * 60 * 60 * 1000; // 3 Hours (10,800,000 ms)

export function registerTicketIssuance(
  ticketReference: string,
  timestampMs: number = Date.now()
): { issuedAt: string; expiresAt: string; isExpired: boolean; remainingMs: number } {
  const cleanRef = ticketReference.trim().toUpperCase();
  const engineState = SmartCrowdEngineState.getInstance();
  engineState.ticketIssuanceTimestamps.set(cleanRef, timestampMs);
  const expiresMs = timestampMs + QR_EXPIRY_DURATION_MS;
  const remainingMs = Math.max(0, expiresMs - Date.now());
  return {
    issuedAt: new Date(timestampMs).toISOString(),
    expiresAt: new Date(expiresMs).toISOString(),
    isExpired: remainingMs === 0,
    remainingMs,
  };
}

export function getTicketIssuanceInfo(ticketReference: string): {
  issuedAt: string;
  expiresAt: string;
  remainingMs: number;
  isExpired: boolean;
} {
  const cleanRef = ticketReference.trim().toUpperCase();
  const engineState = SmartCrowdEngineState.getInstance();
  let issuedMs = engineState.ticketIssuanceTimestamps.get(cleanRef);
  if (!issuedMs) {
    issuedMs = Date.now();
    engineState.ticketIssuanceTimestamps.set(cleanRef, issuedMs);
  }
  const expiresMs = issuedMs + QR_EXPIRY_DURATION_MS;
  const remainingMs = Math.max(0, expiresMs - Date.now());
  return {
    issuedAt: new Date(issuedMs).toISOString(),
    expiresAt: new Date(expiresMs).toISOString(),
    remainingMs,
    isExpired: remainingMs === 0,
  };
}

// ============================================================================

export interface ScanResult {
  success: boolean;
  message: string;
  rejectionCode?: "INVALID_TICKET" | "ALREADY_CHECKED_IN" | "NO_ACTIVE_ENTRY" | "CAPACITY_EXCEEDED" | "QR_EXPIRED";
  scanLog?: VisitorAccessLog;
  updatedSnapshot?: CrowdLiveSnapshot;
}

export async function processTurnstileScan(
  destinationIdOrSlug: string,
  ticketReference: string,
  scanType: "entry" | "exit",
  gateId: string = "GATE-MAIN",
  deviceId: string = "SCANNER-DEVICE-01",
  options?: {
    customScanTimestampMs?: number;
    qrIssuedTimestampMs?: number;
  }
): Promise<ScanResult> {
  const cleanRef = ticketReference.trim().toUpperCase();
  if (!cleanRef || cleanRef.length < 5) {
    return {
      success: false,
      message: "Invalid ticket reference number format. Must be at least 5 alphanumeric characters.",
      rejectionCode: "INVALID_TICKET",
    };
  }

  const config = getDestinationCrowdConfig(destinationIdOrSlug);
  const dest = INITIAL_DESTINATIONS.find(
    (d) => d.id === destinationIdOrSlug || d.slug === destinationIdOrSlug
  );
  if (!config || !dest) {
    return {
      success: false,
      message: "Destination not found.",
      rejectionCode: "INVALID_TICKET",
    };
  }

  const nowMs = options?.customScanTimestampMs ?? Date.now();
  let ticketIssuedMs = options?.qrIssuedTimestampMs ?? state.ticketIssuanceTimestamps.get(cleanRef);

  // If this ticket reference has not been registered yet, auto-register it (unless explicitly simulated)
  if (!ticketIssuedMs) {
    ticketIssuedMs = options?.customScanTimestampMs ? options.customScanTimestampMs - 60000 : Date.now();
    state.ticketIssuanceTimestamps.set(cleanRef, ticketIssuedMs);
  }

  // 3-HOUR STRICT QR CODE EXPIRATION CHECK:
  const elapsedMs = nowMs - ticketIssuedMs;
  if (elapsedMs > QR_EXPIRY_DURATION_MS) {
    const elapsedHours = (elapsedMs / (60 * 60 * 1000)).toFixed(1);
    const expiredAtFormatted = new Date(ticketIssuedMs + QR_EXPIRY_DURATION_MS).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const rejectedLog: VisitorAccessLog = {
      id: `scan-err-${Date.now()}`,
      destination_id: config.destination_id,
      ticket_reference: cleanRef,
      scan_type: scanType,
      gate_id: gateId,
      scanner_device_id: deviceId,
      scanned_at: new Date(nowMs).toISOString(),
      is_valid: false,
      rejection_reason: `QR code expired. Pass validity window is 3 hours (${elapsedHours}h elapsed, expired at ${expiredAtFormatted}).`,
    };
    state.scans.unshift(rejectedLog);

    return {
      success: false,
      message: `Turnstile Access Denied: QR Code expired. This entry pass was valid for 3 hours and expired at ${expiredAtFormatted}. Please regenerate a fresh QR pass from your reservation voucher.`,
      rejectionCode: "QR_EXPIRED",
      scanLog: rejectedLog,
    };
  }

  const insideSet = state.activeInsideTickets.get(config.destination_id) || new Set<string>();

  // DUPLICATE SCAN PREVENTION CHECK:
  if (scanType === "entry") {
    if (insideSet.has(cleanRef)) {
      const rejectedLog: VisitorAccessLog = {
        id: `scan-err-${Date.now()}`,
        destination_id: config.destination_id,
        ticket_reference: cleanRef,
        scan_type: "entry",
        gate_id: gateId,
        scanner_device_id: deviceId,
        scanned_at: new Date().toISOString(),
        is_valid: false,
        rejection_reason: "Ticket is already checked inside the monument. Duplicate entry prevented.",
      };
      state.scans.unshift(rejectedLog);

      return {
        success: false,
        message: `Duplicate Scan Prevented: Ticket "${cleanRef}" is already recorded as inside ${dest.name}.`,
        rejectionCode: "ALREADY_CHECKED_IN",
        scanLog: rejectedLog,
      };
    }
  } else if (scanType === "exit") {
    // If scanning exit, verify the ticket is currently recorded inside
    if (!insideSet.has(cleanRef)) {
      const rejectedLog: VisitorAccessLog = {
        id: `scan-err-${Date.now()}`,
        destination_id: config.destination_id,
        ticket_reference: cleanRef,
        scan_type: "exit",
        gate_id: gateId,
        scanner_device_id: deviceId,
        scanned_at: new Date().toISOString(),
        is_valid: false,
        rejection_reason: "Ticket is not currently inside the monument (already exited or never entered).",
      };
      state.scans.unshift(rejectedLog);

      return {
        success: false,
        message: `Exit Rejected: Ticket "${cleanRef}" is not recorded inside ${dest.name} (already exited or never checked in).`,
        rejectionCode: "NO_ACTIVE_ENTRY",
        scanLog: rejectedLog,
      };
    }
  }

  // VALID SCAN EXECUTION:
  if (scanType === "entry") {
    insideSet.add(cleanRef);
  } else {
    insideSet.delete(cleanRef);
  }
  state.activeInsideTickets.set(config.destination_id, insideSet);

  const validLog: VisitorAccessLog = {
    id: `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    destination_id: config.destination_id,
    ticket_reference: cleanRef,
    scan_type: scanType,
    gate_id: gateId,
    scanner_device_id: deviceId,
    scanned_at: new Date().toISOString(),
    is_valid: true,
  };
  state.scans.unshift(validLog);
  if (state.scans.length > 200) state.scans.pop();

  // Recalculate Live Snapshot:
  const currentSnap = state.snapshots.get(config.destination_id) || state.snapshots.get(dest.slug);
  const prevVisitors = currentSnap ? currentSnap.current_visitors : config.baseline_visitor_count;
  const newEntries = scanType === "entry" ? 1 : 0;
  const newExits = scanType === "exit" ? 1 : 0;

  const totalEntries = (currentSnap?.total_entries || 0) + newEntries;
  const totalExits = (currentSnap?.total_exits || 0) + newExits;
  const updatedVisitors = calculateCurrentVisitors(
    prevVisitors,
    newEntries,
    newExits
  );
  const updatedOccupancy = calculateOccupancyPercentage(updatedVisitors, config.max_approved_capacity);
  const updatedStatus = evaluateCrowdCategory(updatedOccupancy, config);
  const entryRate = Math.max(0.5, (currentSnap?.avg_entry_rate_per_min || 10) + (scanType === "entry" ? 0.3 : -0.1));
  const exitRate = Math.max(0.5, (currentSnap?.avg_exit_rate_per_min || 8) + (scanType === "exit" ? 0.3 : -0.1));
  const updatedTrend = calculateCrowdTrend(entryRate, exitRate);
  const queueLength = Math.max(0, (currentSnap?.queue_length || 50) + (scanType === "entry" ? 1 : -1));
  const waitTime = calculateEntranceWaitTime(queueLength, config.queue_service_rate_per_min);

  const updatedSnapshot: CrowdLiveSnapshot = {
    id: `snap-${dest.slug}`,
    destination_id: dest.id,
    destination_name: dest.name,
    destination_slug: dest.slug,
    recorded_at: new Date().toISOString(),
    previous_visitors: prevVisitors,
    total_entries: totalEntries,
    total_exits: totalExits,
    current_visitors: updatedVisitors,
    max_capacity: config.max_approved_capacity,
    occupancy_percentage: updatedOccupancy,
    crowd_status: updatedStatus,
    avg_entry_rate_per_min: Number(entryRate.toFixed(2)),
    avg_exit_rate_per_min: Number(exitRate.toFixed(2)),
    queue_length: queueLength,
    estimated_wait_time_minutes: waitTime,
    crowd_trend: updatedTrend,
    data_source: `Turnstile Gate Scan (${gateId})`,
    is_simulated: true, // Clearly stated
    last_telemetry_at: new Date().toISOString(),
    thresholds: {
      low: config.threshold_low,
      moderate: config.threshold_moderate,
      high: config.threshold_high,
    },
  };

  state.snapshots.set(dest.id, updatedSnapshot);
  state.snapshots.set(dest.slug, updatedSnapshot);

  // Record Audit Trail entry
  const auditRecord: CrowdAuditRecord = {
    id: `aud-${Date.now()}`,
    destination_id: dest.id,
    action_type: scanType === "entry" ? "scan_entry" : "scan_exit",
    actor_email: "turnstile-gate-service@heritageguard.gov.in",
    actor_role: "staff",
    details: {
      ticket_reference: cleanRef,
      gate_id: gateId,
      scanner_device_id: deviceId,
      new_current_visitors: updatedVisitors,
      new_occupancy_percentage: updatedOccupancy,
      crowd_status: updatedStatus,
    },
    created_at: new Date().toISOString(),
  };
  state.auditTrail.unshift(auditRecord);

  // Sync to Supabase if connection available
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("visitor_access_logs").insert({
        destination_id: dest.id,
        ticket_reference: cleanRef,
        scan_type: scanType,
        gate_id: gateId,
        scanner_device_id: deviceId,
        is_valid: true,
      });

      await supabase.from("crowd_live_snapshots").insert({
        destination_id: dest.id,
        previous_visitors: prevVisitors,
        total_entries: totalEntries,
        total_exits: totalExits,
        current_visitors: updatedVisitors,
        max_capacity: config.max_approved_capacity,
        occupancy_percentage: updatedOccupancy,
        crowd_status: updatedStatus,
        avg_entry_rate_per_min: updatedSnapshot.avg_entry_rate_per_min,
        avg_exit_rate_per_min: updatedSnapshot.avg_exit_rate_per_min,
        queue_length: queueLength,
        estimated_wait_time_minutes: waitTime,
        crowd_trend: updatedTrend,
        data_source: updatedSnapshot.data_source,
        is_simulated: true,
      });
    }
  } catch (e) {
    // Graceful offline fallback
  }

  return {
    success: true,
    message: `Turnstile Scan Validated: ${scanType === "entry" ? "Entry" : "Exit"} recorded for ticket ${cleanRef}. Occupancy now ${updatedOccupancy}% (${updatedVisitors} visitors).`,
    scanLog: validLog,
    updatedSnapshot,
  };
}

// ============================================================================
// ADMIN MANUAL CALIBRATION & CAPACITY OVERRIDES
// ============================================================================

export async function calibrateCrowdMetrics(
  destinationIdOrSlug: string,
  actorEmail: string,
  params: {
    visitorCountOverride?: number;
    maxCapacityOverride?: number;
    thresholds?: { low?: number; moderate?: number; high?: number };
    queueLengthOverride?: number;
    trendOverride?: CrowdTrend;
  }
): Promise<{ success: boolean; snapshot: CrowdLiveSnapshot; message: string }> {
  const config = getDestinationCrowdConfig(destinationIdOrSlug);
  const dest = INITIAL_DESTINATIONS.find(
    (d) => d.id === destinationIdOrSlug || d.slug === destinationIdOrSlug
  );
  if (!config || !dest) {
    throw new Error("Destination not found for calibration.");
  }

  // Update config if capacity or thresholds changed
  if (params.maxCapacityOverride && params.maxCapacityOverride > 0) {
    config.max_approved_capacity = params.maxCapacityOverride;
  }
  if (params.thresholds) {
    if (params.thresholds.low) config.threshold_low = params.thresholds.low;
    if (params.thresholds.moderate) config.threshold_moderate = params.thresholds.moderate;
    if (params.thresholds.high) config.threshold_high = params.thresholds.high;
  }
  state.configs.set(dest.id, config);
  state.configs.set(dest.slug, config);

  const currentSnap = state.snapshots.get(dest.id) || state.snapshots.get(dest.slug);
  const prevVisitors = currentSnap ? currentSnap.current_visitors : config.baseline_visitor_count;
  const newVisitors =
    params.visitorCountOverride !== undefined
      ? Math.max(0, params.visitorCountOverride)
      : currentSnap?.current_visitors || config.baseline_visitor_count;

  const newOccupancy = calculateOccupancyPercentage(newVisitors, config.max_approved_capacity);
  const newStatus = evaluateCrowdCategory(newOccupancy, config);
  const newQueue = params.queueLengthOverride !== undefined ? Math.max(0, params.queueLengthOverride) : currentSnap?.queue_length || 40;
  const newWait = calculateEntranceWaitTime(newQueue, config.queue_service_rate_per_min);
  const newTrend = params.trendOverride || currentSnap?.crowd_trend || "stable";

  const updatedSnapshot: CrowdLiveSnapshot = {
    id: `snap-${dest.slug}`,
    destination_id: dest.id,
    destination_name: dest.name,
    destination_slug: dest.slug,
    recorded_at: new Date().toISOString(),
    previous_visitors: prevVisitors,
    total_entries: currentSnap?.total_entries || 0,
    total_exits: currentSnap?.total_exits || 0,
    current_visitors: newVisitors,
    max_capacity: config.max_approved_capacity,
    occupancy_percentage: newOccupancy,
    crowd_status: newStatus,
    avg_entry_rate_per_min: currentSnap?.avg_entry_rate_per_min || 12.0,
    avg_exit_rate_per_min: currentSnap?.avg_exit_rate_per_min || 10.0,
    queue_length: newQueue,
    estimated_wait_time_minutes: newWait,
    crowd_trend: newTrend,
    data_source: "Admin Manual Calibration Stream (Demo Data)",
    is_simulated: true,
    last_telemetry_at: new Date().toISOString(),
    thresholds: {
      low: config.threshold_low,
      moderate: config.threshold_moderate,
      high: config.threshold_high,
    },
  };

  state.snapshots.set(dest.id, updatedSnapshot);
  state.snapshots.set(dest.slug, updatedSnapshot);

  // Add to Audit Trail
  state.auditTrail.unshift({
    id: `aud-${Date.now()}`,
    destination_id: dest.id,
    action_type: "manual_calibration",
    actor_email: actorEmail || "admin@heritageguard.gov.in",
    actor_role: "admin",
    details: {
      previous_visitors: prevVisitors,
      calibrated_visitors: newVisitors,
      calibrated_occupancy: newOccupancy,
      status: newStatus,
      capacity: config.max_approved_capacity,
    },
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    snapshot: updatedSnapshot,
    message: `Manual calibration applied for ${dest.name}: Count set to ${newVisitors} (${newOccupancy}% occupancy).`,
  };
}

// ============================================================================
// DATA ACCESS & TELEMETRY RETRIEVAL
// ============================================================================

export function getDestinationCrowdConfig(destinationIdOrSlug: string): DestinationCrowdConfig {
  const cfg = state.configs.get(destinationIdOrSlug);
  if (cfg) return cfg;
  return (
    DEFAULT_CROWD_CONFIGS[destinationIdOrSlug] || {
      destination_id: destinationIdOrSlug,
      max_approved_capacity: 5000,
      threshold_low: 30,
      threshold_moderate: 60,
      threshold_high: 85,
      queue_service_rate_per_min: 30.0,
      baseline_visitor_count: 2000,
      official_conservation_source: "Standard Archaeological Carrying Capacity Norms",
    }
  );
}

export async function getMonumentCrowdTelemetry(
  destinationIdOrSlug: string
): Promise<MonumentCrowdTelemetry | null> {
  const dest = INITIAL_DESTINATIONS.find(
    (d) => d.id === destinationIdOrSlug || d.slug === destinationIdOrSlug
  );
  if (!dest) return null;

  const config = getDestinationCrowdConfig(dest.id);
  let snapshot = state.snapshots.get(dest.id);

  // Attempt fetch from Supabase if available
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("crowd_live_snapshots")
        .select("*")
        .eq("destination_id", dest.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        snapshot = {
          id: data.id,
          destination_id: data.destination_id,
          destination_name: dest.name,
          destination_slug: dest.slug,
          recorded_at: data.recorded_at,
          previous_visitors: data.previous_visitors,
          total_entries: data.total_entries,
          total_exits: data.total_exits,
          current_visitors: data.current_visitors,
          max_capacity: data.max_capacity,
          occupancy_percentage: Number(data.occupancy_percentage),
          crowd_status: data.crowd_status,
          avg_entry_rate_per_min: Number(data.avg_entry_rate_per_min),
          avg_exit_rate_per_min: Number(data.avg_exit_rate_per_min),
          queue_length: data.queue_length,
          estimated_wait_time_minutes: data.estimated_wait_time_minutes,
          crowd_trend: data.crowd_trend,
          data_source: data.data_source,
          is_simulated: data.is_simulated,
          last_telemetry_at: data.last_telemetry_at || data.recorded_at,
          thresholds: {
            low: config.threshold_low,
            moderate: config.threshold_moderate,
            high: config.threshold_high,
          },
        };
      }
    }
  } catch (err) {
    // Use in-memory snapshot
  }

  if (!snapshot) {
    snapshot = state.snapshots.get(dest.slug)!;
  }

  // Calculate Short-Term Predictions (15m, 30m, 60m)
  const predictions = generateShortTermPredictions(
    snapshot.current_visitors,
    snapshot.max_capacity,
    snapshot.avg_entry_rate_per_min,
    snapshot.avg_exit_rate_per_min,
    config
  );

  // Generate realistic historical hourly variation curves (06:00 to 18:00)
  const hourlyTrends = generateHistoricalHourlyTelemetry(dest, config, snapshot.current_visitors);

  // Get recent access logs for this monument
  const recentScans = state.scans.filter((s) => s.destination_id === dest.id).slice(0, 8);

  return {
    destination: dest,
    config,
    snapshot,
    predictions,
    hourlyTrends,
    recentScans,
  };
}

export async function getAllMonumentsCrowdTelemetry(): Promise<MonumentCrowdTelemetry[]> {
  const list: MonumentCrowdTelemetry[] = [];
  for (const d of INITIAL_DESTINATIONS) {
    const telemetry = await getMonumentCrowdTelemetry(d.id);
    if (telemetry) list.push(telemetry);
  }
  return list;
}

export function getCrowdAuditRecords(destinationId?: string): CrowdAuditRecord[] {
  if (destinationId) {
    return state.auditTrail.filter((a) => a.destination_id === destinationId);
  }
  return state.auditTrail.slice(0, 30);
}

// Generate realistic diurnal curve (06:00 to 19:30) for interactive time variation charts
function generateHistoricalHourlyTelemetry(
  dest: Destination,
  config: DestinationCrowdConfig,
  currentVisitors: number
): {
  hour: string;
  expectedLevel: CrowdLevel;
  percentage: number;
  entries: number;
  exits: number;
}[] {
  const hoursMap = [
    { hour: "06:00 AM", factor: 0.25, entryFactor: 0.35, exitFactor: 0.05 },
    { hour: "07:30 AM", factor: 0.45, entryFactor: 0.60, exitFactor: 0.20 },
    { hour: "09:00 AM", factor: 0.75, entryFactor: 0.95, exitFactor: 0.40 },
    { hour: "10:30 AM", factor: 1.05, entryFactor: 1.20, exitFactor: 0.75 },
    { hour: "12:00 PM", factor: 1.25, entryFactor: 1.15, exitFactor: 0.95 },
    { hour: "01:30 PM", factor: 1.15, entryFactor: 0.90, exitFactor: 1.10 },
    { hour: "03:00 PM", factor: 1.00, entryFactor: 0.85, exitFactor: 0.95 },
    { hour: "04:30 PM", factor: 0.85, entryFactor: 0.70, exitFactor: 1.05 },
    { hour: "06:00 PM", factor: 0.50, entryFactor: 0.30, exitFactor: 0.90 },
    { hour: "07:30 PM", factor: 0.20, entryFactor: 0.10, exitFactor: 0.50 },
  ];

  const baseOccupancy = (currentVisitors / config.max_approved_capacity) * 100;

  return hoursMap.map(({ hour, factor, entryFactor, exitFactor }) => {
    const percentage = Number(Math.min(100, Math.max(5, baseOccupancy * factor)).toFixed(1));
    const expectedLevel = evaluateCrowdCategory(percentage, config);
    const hourlyRate = config.queue_service_rate_per_min * 60;
    const entries = Math.round(hourlyRate * entryFactor * (baseOccupancy / 100));
    const exits = Math.round(hourlyRate * exitFactor * (baseOccupancy / 100));

    return {
      hour,
      expectedLevel,
      percentage,
      entries,
      exits,
    };
  });
}
