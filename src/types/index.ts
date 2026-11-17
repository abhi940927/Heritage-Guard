export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Very High';
export type CrowdTrend = 'rising' | 'stable' | 'falling';
export type UserRole = 'visitor' | 'admin' | 'staff';
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  dob?: string;
  avatar_url?: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  category: string;
  short_description: string;
  historical_background: string;
  cultural_importance: string;
  architecture_details: string;
  cover_image_url: string;
  opening_time: string;
  closing_time: string;
  closed_days: string[];
  visitor_guidelines: string[];
  facilities: string[];
  recommended_visit_duration: string;
  best_visiting_hours: string;
  base_ticket_price: number;
  current_crowd_level: CrowdLevel;
  current_crowd_percentage: number;
  crowd_trend: CrowdTrend;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DestinationImage {
  id: string;
  destination_id: string;
  image_url: string;
  caption?: string;
  is_primary: boolean;
  display_order: number;
}

export interface TicketCategory {
  id: string;
  destination_id: string;
  category_name: string;
  price: number;
  currency: string;
  description?: string;
}

export interface VisitingTimeSlot {
  id: string;
  destination_id: string;
  start_time: string;
  end_time: string;
  label: string;
  max_capacity: number;
  expected_crowd_level: CrowdLevel;
}

export interface Booking {
  id: string;
  booking_reference: string;
  user_id?: string | null;
  destination_id: string;
  destination_name?: string;
  destination_slug?: string;
  time_slot_id?: string | null;
  visit_date: string;
  slot_label: string;
  total_visitors: number;
  total_amount: number;
  status: BookingStatus;
  contact_email: string;
  contact_phone: string;
  visitor_lead_name: string;
  created_at: string;
  updated_at?: string;
  visitors?: BookingVisitor[];
  destination?: Destination;
}

export interface BookingVisitor {
  id?: string;
  booking_id?: string;
  full_name: string;
  age: number;
  category_name: string;
  id_proof_type?: string;
  id_proof_number?: string;
}

export interface CrowdReport {
  id: string;
  destination_id: string;
  destination_name?: string;
  recorded_at: string;
  crowd_level: CrowdLevel;
  crowd_percentage: number;
  wait_time_minutes: number;
  entry_rate_per_hour: number;
  data_source: string;
  is_simulated: boolean;
}

export interface SavedDestination {
  id: string;
  user_id: string;
  destination_id: string;
  destination?: Destination;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

// ============================================================================
// SMART CROWD MONITORING & PREDICTION ENGINE TYPES
// ============================================================================

export interface DestinationCrowdConfig {
  destination_id: string;
  max_approved_capacity: number;
  threshold_low: number; // e.g. 30 (0 - 30% Low)
  threshold_moderate: number; // e.g. 60 (31 - 60% Moderate)
  threshold_high: number; // e.g. 85 (61 - 85% High, >85% Very High)
  queue_service_rate_per_min: number; // visitors processed per minute by turnstiles
  baseline_visitor_count: number;
  official_conservation_source: string;
  updated_at?: string;
}

export type ScanType = 'entry' | 'exit';

export interface VisitorAccessLog {
  id: string;
  destination_id: string;
  ticket_reference: string;
  booking_id?: string | null;
  scan_type: ScanType;
  gate_id: string;
  scanner_device_id: string;
  scanned_at: string;
  is_valid: boolean;
  rejection_reason?: string | null;
  created_at?: string;
}

export interface CrowdLiveSnapshot {
  id: string;
  destination_id: string;
  destination_name?: string;
  destination_slug?: string;
  recorded_at: string;
  previous_visitors: number;
  total_entries: number;
  total_exits: number;
  current_visitors: number;
  max_capacity: number;
  occupancy_percentage: number;
  crowd_status: CrowdLevel;
  avg_entry_rate_per_min: number;
  avg_exit_rate_per_min: number;
  queue_length: number;
  estimated_wait_time_minutes: number;
  crowd_trend: CrowdTrend;
  data_source: string;
  is_simulated: boolean;
  last_telemetry_at: string;
  thresholds?: {
    low: number;
    moderate: number;
    high: number;
  };
}

export interface CrowdPrediction {
  id?: string;
  destination_id: string;
  generated_at: string;
  horizon_minutes: 15 | 30 | 60;
  predicted_entries: number;
  predicted_exits: number;
  expected_visitors: number;
  predicted_occupancy_percentage: number;
  expected_crowd_category: CrowdLevel;
  predicted_crowd_trend: CrowdTrend;
  is_simulated: boolean;
}

export interface CrowdAuditRecord {
  id: string;
  destination_id: string;
  action_type: 'manual_calibration' | 'scan_entry' | 'scan_exit' | 'capacity_override' | 'threshold_update' | 'sensor_sync';
  actor_email: string;
  actor_role: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface MonumentCrowdTelemetry {
  destination: Destination;
  config: DestinationCrowdConfig;
  snapshot: CrowdLiveSnapshot;
  predictions: {
    m15: CrowdPrediction;
    m30: CrowdPrediction;
    m60: CrowdPrediction;
  };
  hourlyTrends: {
    hour: string;
    expectedLevel: CrowdLevel;
    percentage: number;
    entries: number;
    exits: number;
  }[];
  recentScans?: VisitorAccessLog[];
}

