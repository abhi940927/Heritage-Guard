export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Very High';
export type CrowdTrend = 'rising' | 'stable' | 'falling';
export type UserRole = 'visitor' | 'admin' | 'staff';
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
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
