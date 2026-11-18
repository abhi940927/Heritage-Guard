-- ==============================================================================
-- Heritage Site Crowd Management System: Complete Master Database Setup
-- 0. CLEANUP PREVIOUS CONFLICTING TABLES (Fixes 42804 UUID vs TEXT mismatch)
-- ==============================================================================
DROP TABLE IF EXISTS public.crowd_audit_trail CASCADE;
DROP TABLE IF EXISTS public.crowd_predictions CASCADE;
DROP TABLE IF EXISTS public.crowd_live_snapshots CASCADE;
DROP TABLE IF EXISTS public.visitor_access_logs CASCADE;
DROP TABLE IF EXISTS public.destination_crowd_configs CASCADE;
DROP TABLE IF EXISTS public.booking_visitors CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.ticket_categories CASCADE;
DROP TABLE IF EXISTS public.visiting_time_slots CASCADE;
DROP TABLE IF EXISTS public.destination_images CASCADE;
DROP TABLE IF EXISTS public.saved_destinations CASCADE;
DROP TABLE IF EXISTS public.crowd_reports CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==============================================================================
-- Heritage Site Crowd Management System
-- Schema Migration: 20260101000000_create_heritage_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('visitor', 'admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Monument', 'Fort', 'Mausoleum', 'Cave Temple', 'Palace', 'Memorial', 'Archaeological Site')),
    short_description TEXT NOT NULL,
    historical_background TEXT NOT NULL,
    cultural_importance TEXT NOT NULL,
    architecture_details TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    opening_time TIME NOT NULL DEFAULT '06:00:00',
    closing_time TIME NOT NULL DEFAULT '18:30:00',
    closed_days TEXT[] DEFAULT '{}',
    visitor_guidelines TEXT[] DEFAULT '{}',
    facilities TEXT[] DEFAULT '{}',
    recommended_visit_duration TEXT NOT NULL DEFAULT '2 - 3 hours',
    best_visiting_hours TEXT NOT NULL DEFAULT 'Early Morning (06:00 - 08:30) or Late Afternoon (16:00 - 18:00)',
    base_ticket_price NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    current_crowd_level TEXT NOT NULL DEFAULT 'Moderate' CHECK (current_crowd_level IN ('Low', 'Moderate', 'High', 'Very High')),
    current_crowd_percentage INT NOT NULL DEFAULT 45 CHECK (current_crowd_percentage BETWEEN 0 AND 100),
    crowd_trend TEXT NOT NULL DEFAULT 'stable' CHECK (crowd_trend IN ('rising', 'stable', 'falling')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. DESTINATION IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.destination_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TICKET CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.ticket_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. VISITING TIME SLOTS TABLE
CREATE TABLE IF NOT EXISTS public.visiting_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    label TEXT NOT NULL,
    max_capacity INT NOT NULL DEFAULT 2500,
    expected_crowd_level TEXT NOT NULL DEFAULT 'Moderate' CHECK (expected_crowd_level IN ('Low', 'Moderate', 'High', 'Very High')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE RESTRICT,
    time_slot_id UUID REFERENCES public.visiting_time_slots(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    slot_label TEXT NOT NULL,
    total_visitors INT NOT NULL CHECK (total_visitors > 0),
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    visitor_lead_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. BOOKING VISITORS TABLE
CREATE TABLE IF NOT EXISTS public.booking_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 120),
    category_name TEXT NOT NULL,
    id_proof_type TEXT,
    id_proof_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CROWD REPORTS TABLE (Audit and Historical Trend Analytics)
CREATE TABLE IF NOT EXISTS public.crowd_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    crowd_level TEXT NOT NULL CHECK (crowd_level IN ('Low', 'Moderate', 'High', 'Very High')),
    crowd_percentage INT NOT NULL CHECK (crowd_percentage BETWEEN 0 AND 100),
    wait_time_minutes INT NOT NULL DEFAULT 10,
    entry_rate_per_hour INT NOT NULL DEFAULT 650,
    data_source TEXT NOT NULL DEFAULT 'simulated_forecast',
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. SAVED DESTINATIONS (Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, destination_id)
);

-- 10. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_state ON public.destinations(state);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON public.destinations(is_featured);
CREATE INDEX IF NOT EXISTS idx_destinations_crowd ON public.destinations(current_crowd_level);

CREATE INDEX IF NOT EXISTS idx_destination_images_dest_id ON public.destination_images(destination_id);
CREATE INDEX IF NOT EXISTS idx_ticket_categories_dest_id ON public.ticket_categories(destination_id);
CREATE INDEX IF NOT EXISTS idx_visiting_time_slots_dest_id ON public.visiting_time_slots(destination_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dest_date ON public.bookings(destination_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_booking_visitors_booking_id ON public.booking_visitors(booking_id);

CREATE INDEX IF NOT EXISTS idx_crowd_reports_dest_time ON public.crowd_reports(destination_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_destinations_user_id ON public.saved_destinations(user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, phone_number, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Heritage Explorer'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(new.raw_user_meta_data->>'phone_number', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'visitor')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visiting_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Security Definer function to check admin role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles: Anyone authenticated can view their own; Admins can view all
DROP POLICY IF EXISTS "Public profiles are readable by owner and admins" ON public.profiles;
CREATE POLICY "Public profiles are readable by owner and admins" ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Destinations & Sub-tables: Public read-only; Admin insert/update/delete
DROP POLICY IF EXISTS "Destinations are viewable by everyone" ON public.destinations;
CREATE POLICY "Destinations are viewable by everyone" ON public.destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Destinations can be modified by admins only" ON public.destinations;
DROP POLICY IF EXISTS "Destinations insert by admin" ON public.destinations;
DROP POLICY IF EXISTS "Destinations update by admin" ON public.destinations;
DROP POLICY IF EXISTS "Destinations delete by admin" ON public.destinations;
CREATE POLICY "Destinations insert by admin" ON public.destinations FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Destinations update by admin" ON public.destinations FOR UPDATE USING (public.is_admin());
CREATE POLICY "Destinations delete by admin" ON public.destinations FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Destination images are viewable by everyone" ON public.destination_images;
CREATE POLICY "Destination images are viewable by everyone" ON public.destination_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Destination images managed by admin" ON public.destination_images;
CREATE POLICY "Destination images insert by admin" ON public.destination_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Destination images update by admin" ON public.destination_images FOR UPDATE USING (public.is_admin());
CREATE POLICY "Destination images delete by admin" ON public.destination_images FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Ticket categories viewable by everyone" ON public.ticket_categories;
CREATE POLICY "Ticket categories viewable by everyone" ON public.ticket_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Ticket categories managed by admin" ON public.ticket_categories;
CREATE POLICY "Ticket categories insert by admin" ON public.ticket_categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Ticket categories update by admin" ON public.ticket_categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Ticket categories delete by admin" ON public.ticket_categories FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Time slots viewable by everyone" ON public.visiting_time_slots;
CREATE POLICY "Time slots viewable by everyone" ON public.visiting_time_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Time slots managed by admin" ON public.visiting_time_slots;
CREATE POLICY "Time slots insert by admin" ON public.visiting_time_slots FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Time slots update by admin" ON public.visiting_time_slots FOR UPDATE USING (public.is_admin());
CREATE POLICY "Time slots delete by admin" ON public.visiting_time_slots FOR DELETE USING (public.is_admin());

-- Bookings & Visitors: Users can view their own bookings; Admins view all; Any user can create
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their booking visitors" ON public.booking_visitors;
CREATE POLICY "Users can view their booking visitors" ON public.booking_visitors FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.booking_visitors.booking_id
            AND (public.bookings.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
        )
    );

DROP POLICY IF EXISTS "Anyone can insert booking visitors" ON public.booking_visitors;
CREATE POLICY "Anyone can insert booking visitors" ON public.booking_visitors FOR INSERT
    WITH CHECK (true);

-- Crowd Reports: Viewable by everyone; Managed by admins
DROP POLICY IF EXISTS "Crowd reports are viewable by everyone" ON public.crowd_reports;
CREATE POLICY "Crowd reports are viewable by everyone" ON public.crowd_reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Crowd reports can be created by admin or system" ON public.crowd_reports;
CREATE POLICY "Crowd reports can be created by admin or system" ON public.crowd_reports FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Saved Destinations: Users manage their own
DROP POLICY IF EXISTS "Users view own saved destinations" ON public.saved_destinations;
CREATE POLICY "Users view own saved destinations" ON public.saved_destinations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own saved destinations" ON public.saved_destinations;
CREATE POLICY "Users insert own saved destinations" ON public.saved_destinations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own saved destinations" ON public.saved_destinations;
CREATE POLICY "Users delete own saved destinations" ON public.saved_destinations FOR DELETE
    USING (auth.uid() = user_id);

-- Contact Messages: Anyone can insert; Admins can view/update
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
-- ==============================================================================
-- Heritage Site Crowd Management System
-- Schema Migration: 20260102000000_smart_crowd_monitoring.sql
-- Smart Crowd Monitoring, Short-Term Prediction Engine & Access Turnstile Telemetry
-- ==============================================================================

-- 1. DESTINATION CROWD CONFIGS
-- Stores approved maximum capacity, configurable category thresholds, and queue processing rates per destination.
CREATE TABLE IF NOT EXISTS public.destination_crowd_configs (
    destination_id UUID PRIMARY KEY REFERENCES public.destinations(id) ON DELETE CASCADE,
    max_approved_capacity INT NOT NULL CHECK (max_approved_capacity > 0),
    threshold_low INT NOT NULL DEFAULT 30 CHECK (threshold_low > 0 AND threshold_low < threshold_moderate),
    threshold_moderate INT NOT NULL DEFAULT 60 CHECK (threshold_moderate > threshold_low AND threshold_moderate < threshold_high),
    threshold_high INT NOT NULL DEFAULT 85 CHECK (threshold_high > threshold_moderate AND threshold_high < 100),
    queue_service_rate_per_min NUMERIC(6, 2) NOT NULL DEFAULT 35.00 CHECK (queue_service_rate_per_min > 0),
    baseline_visitor_count INT NOT NULL DEFAULT 0 CHECK (baseline_visitor_count >= 0),
    official_conservation_source TEXT NOT NULL DEFAULT 'Archaeological Survey of India (ASI) Monument Carrying Capacity Norms',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. VISITOR ACCESS LOGS / TURNSTILE SCANS
-- Records individual digital QR ticket scan events at monument security gates.
CREATE TABLE IF NOT EXISTS public.visitor_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    ticket_reference TEXT NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    scan_type TEXT NOT NULL CHECK (scan_type IN ('entry', 'exit')),
    gate_id TEXT NOT NULL DEFAULT 'GATE-MAIN',
    scanner_device_id TEXT NOT NULL DEFAULT 'TURNSTILE-AUTO-01',
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_valid BOOLEAN NOT NULL DEFAULT true,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_visitor_access_logs_dest_time 
    ON public.visitor_access_logs(destination_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_access_logs_ticket 
    ON public.visitor_access_logs(ticket_reference, scan_type);

-- 3. CROWD LIVE SNAPSHOTS
-- Real-time telemetry snapshot aggregating current visitors, entries, exits, rates, and occupancy.
CREATE TABLE IF NOT EXISTS public.crowd_live_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    previous_visitors INT NOT NULL DEFAULT 0,
    total_entries INT NOT NULL DEFAULT 0,
    total_exits INT NOT NULL DEFAULT 0,
    current_visitors INT NOT NULL DEFAULT 0 CHECK (current_visitors >= 0),
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    occupancy_percentage NUMERIC(5, 2) NOT NULL CHECK (occupancy_percentage >= 0),
    crowd_status TEXT NOT NULL CHECK (crowd_status IN ('Low', 'Moderate', 'High', 'Very High')),
    avg_entry_rate_per_min NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    avg_exit_rate_per_min NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    queue_length INT NOT NULL DEFAULT 0 CHECK (queue_length >= 0),
    estimated_wait_time_minutes INT NOT NULL DEFAULT 0 CHECK (estimated_wait_time_minutes >= 0),
    crowd_trend TEXT NOT NULL CHECK (crowd_trend IN ('rising', 'stable', 'falling')),
    data_source TEXT NOT NULL DEFAULT 'Optical Turnstile & IoT Sensor Stream (Demo Data)',
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    last_telemetry_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_crowd_live_snapshots_dest_time 
    ON public.crowd_live_snapshots(destination_id, recorded_at DESC);

-- 4. SHORT-TERM CROWD PREDICTIONS (15, 30, and 60 minutes horizons)
CREATE TABLE IF NOT EXISTS public.crowd_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    horizon_minutes INT NOT NULL CHECK (horizon_minutes IN (15, 30, 60)),
    predicted_entries INT NOT NULL DEFAULT 0,
    predicted_exits INT NOT NULL DEFAULT 0,
    expected_visitors INT NOT NULL CHECK (expected_visitors >= 0),
    predicted_occupancy_percentage NUMERIC(5, 2) NOT NULL CHECK (predicted_occupancy_percentage >= 0),
    expected_crowd_category TEXT NOT NULL CHECK (expected_crowd_category IN ('Low', 'Moderate', 'High', 'Very High')),
    predicted_crowd_trend TEXT NOT NULL CHECK (predicted_crowd_trend IN ('rising', 'stable', 'falling')),
    is_simulated BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_crowd_predictions_dest_time 
    ON public.crowd_predictions(destination_id, generated_at DESC);

-- 5. CROWD AUDIT TRAIL
-- Immutable log of manual administrative overrides, calibration actions, and capacity adjustments.
CREATE TABLE IF NOT EXISTS public.crowd_audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('manual_calibration', 'scan_entry', 'scan_exit', 'capacity_override', 'threshold_update', 'sensor_sync')),
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL DEFAULT 'admin',
    details JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_crowd_audit_trail_dest 
    ON public.crowd_audit_trail(destination_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.destination_crowd_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_live_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_audit_trail ENABLE ROW LEVEL SECURITY;

-- Public can view crowd configs, telemetry snapshots, and predictions
DROP POLICY IF EXISTS "Allow public read access to destination crowd configs" ON public.destination_crowd_configs;
CREATE POLICY "Allow public read access to destination crowd configs" ON public.destination_crowd_configs FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public read access to crowd snapshots" ON public.crowd_live_snapshots;
CREATE POLICY "Allow public read access to crowd snapshots" ON public.crowd_live_snapshots FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public read access to crowd predictions" ON public.crowd_predictions;
CREATE POLICY "Allow public read access to crowd predictions" ON public.crowd_predictions FOR SELECT
    USING (true);

-- Turnstile scan logs: Public/Turnstiles can insert, Staff and Admins can view
DROP POLICY IF EXISTS "Allow authenticated or gate devices to insert access logs" ON public.visitor_access_logs;
CREATE POLICY "Allow authenticated or gate devices to insert access logs" ON public.visitor_access_logs FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow staff and admin to read access logs" ON public.visitor_access_logs;
CREATE POLICY "Allow staff and admin to read access logs" ON public.visitor_access_logs FOR SELECT
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'staff')
        )
    );

-- Audit Trail: Only Admins can view and write
DROP POLICY IF EXISTS "Allow admin to read crowd audit trail" ON public.crowd_audit_trail;
CREATE POLICY "Allow admin to read crowd audit trail" ON public.crowd_audit_trail FOR SELECT
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Allow admin or system to insert crowd audit trail" ON public.crowd_audit_trail;
CREATE POLICY "Allow admin or system to insert crowd audit trail" ON public.crowd_audit_trail FOR INSERT
    WITH CHECK (true);

-- Configs update: Only Admins
DROP POLICY IF EXISTS "Allow admin to update crowd configs" ON public.destination_crowd_configs;
CREATE POLICY "Allow admin to update crowd configs" ON public.destination_crowd_configs FOR UPDATE
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
-- ==============================================================================
-- ADD DATE OF BIRTH (DOB) TO USER PROFILES & UPDATE AUTH TRIGGER
-- Heritage Site Crowd Management System
-- ==============================================================================

-- 1. Add dob column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dob DATE;

-- 2. Update handle_new_user trigger function to capture dob & metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, phone_number, dob, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Heritage Explorer'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(new.raw_user_meta_data->>'phone_number', ''),
        CASE 
            WHEN new.raw_user_meta_data->>'dob' IS NOT NULL AND new.raw_user_meta_data->>'dob' != '' 
            THEN (new.raw_user_meta_data->>'dob')::DATE 
            ELSE NULL 
        END,
        COALESCE(new.raw_user_meta_data->>'role', 'visitor')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = CASE WHEN EXCLUDED.phone_number != '' THEN EXCLUDED.phone_number ELSE public.profiles.phone_number END,
        dob = CASE WHEN EXCLUDED.dob IS NOT NULL THEN EXCLUDED.dob ELSE public.profiles.dob END,
        updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- ==============================================================================
-- Heritage Site Crowd Management System
-- Seed Data: supabase/seed.sql
-- ==============================================================================

-- 1. TAJ MAHAL
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'taj-mahal',
    'Taj Mahal',
    'Dharmapuri, Forest Colony, Babarpur, Agra',
    'Uttar Pradesh',
    'Mausoleum',
    'An ivory-white marble mausoleum on the south bank of the Yamuna river, widely regarded as the jewel of Mughal architecture.',
    'Commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. Constructed over twenty years by an estimated 20,000 artisans led by Ustad Ahmad Lahori, the monument stands as an immortal testament to grief, devotion, and imperial artistry.',
    'Recognized as a UNESCO World Heritage Site in 1983 and one of the New 7 Wonders of the World, the Taj Mahal is a universal symbol of eternal love and Mughal cultural zenith, welcoming millions of national and international visitors each year.',
    'Pinnacle of Mughal architectural synthesis blending Persian, Islamic, and Indian motifs. Constructed entirely from pristine Makrana white marble, featuring a massive bulbous dome, four detached minarets tilted slightly outward to protect the central dome in case of collapse, pietra dura floral inlays with semi-precious stones, and meticulous symmetrical Charbagh gardens.',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
    '06:00:00',
    '18:30:00',
    ARRAY['Friday'],
    ARRAY['Strict security frisking at Eastern and Western Gates', 'Shoe covers or barefoot mandatory on main mausoleum plinth', 'Drone photography and tripods strictly prohibited', 'No food items or plastic bottles permitted past security checkpoint', 'Quiet zone enforced inside the cenotaph chamber'],
    ARRAY['Wheelchair access ramps', 'Audio guide counters in 8 languages', 'Official ASI licensed guides', 'Cloakroom and locker facility', 'Clean drinking water kiosks', 'EV battery golf carts from parking'],
    '2.5 - 3 hours',
    'Sunrise (06:00 - 08:30) or Golden Hour (16:30 - 18:30)',
    50.00,
    'High',
    78,
    'rising',
    true
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 2. RED FORT (LAL QILA)
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a2222222-2222-2222-2222-222222222222',
    'red-fort',
    'Red Fort (Lal Qila)',
    'Netaji Subhash Marg, Chandni Chowk, New Delhi',
    'Delhi',
    'Fort',
    'The historic fortified palace of red sandstone that served as the primary residence of Mughal emperors for nearly two centuries.',
    'Constructed by Emperor Shah Jahan between 1638 and 1648 when he decided to relocate his capital from Agra to Shahjahanabad (Delhi). It witnessed the decline of the Mughal dynasty, the 1857 war of independence, the INA trials, and the dawn of independent India when Prime Minister Nehru hoisted the national tricolor from the Lahori Gate.',
    'A designated UNESCO World Heritage Site, the Red Fort is the symbolic epicenter of India’s sovereignty and the ceremonial venue where the Prime Minister addresses the nation every Independence Day on August 15th.',
    'Enclosed by massive octagonal red sandstone ramparts spanning 2.4 kilometers. Highlights include the Lahori Gate, Chhatta Chowk bazaar, Diwan-i-Aam (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience crafted in white marble), Moti Masjid, and the Nahr-i-Bihisht (Stream of Paradise) channels.',
    'https://images.unsplash.com/photo-1708394011246-8f3691b66c75?auto=format&fit=crop&w=1600&q=85',
    '09:30:00',
    '17:30:00',
    ARRAY['Monday'],
    ARRAY['Baggage scanner at Lahori Gate entrance', 'Preserve digital entry QR code on smartphone', 'Keep off fragile lawns and ancient water conduits', 'Commercial filming requires written ASI clearance'],
    ARRAY['Sound & Light show amphitheater', 'Archaeological museum', 'Swatantrata Sangram Museum', 'First Aid center', 'Golf carts for senior citizens'],
    '2 - 2.5 hours',
    'Morning (09:30 - 11:30) or Late Afternoon (15:00 - 17:00)',
    35.00,
    'Moderate',
    52,
    'stable',
    true
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 3. QUTUB MINAR
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a3333333-3333-3333-3333-333333333333',
    'qutub-minar',
    'Qutub Minar Complex',
    'Seth Sarai, Mehrauli, New Delhi',
    'Delhi',
    'Monument',
    'A 72.5-meter tapering victory tower and minaret constructed of red sandstone and marble, anchoring Delhi’s oldest Islamic enclave.',
    'Foundation laid by Qutb-ud-din Aibak in 1199 CE to celebrate Muslim dominance in Delhi; expanded by Shams-ud-din Iltutmish and restored by Firoz Shah Tughlaq after lightning damage in 1368. The complex integrates pre-existing Tomar and Chauhan architectural elements.',
    'A UNESCO World Heritage Site featuring ancient epigraphy, Quranic inscriptions, and the enigmatic 4th-century Gupta-period Iron Pillar of Chandragupta II which has resisted corrosion for over 1,600 years.',
    'Fluted five-story minaret with projecting balconies supported by intricate stalactite-like corbels. The lower three storeys feature alternating angular and rounded flutings in red and buff sandstone, while the upper two are faced with white marble and sandstone.',
    '/images/destinations/qutub-minar.jpg',
    '07:00:00',
    '19:00:00',
    ARRAY[]::TEXT[],
    ARRAY['Night illumination viewing permitted until 21:00 on select evenings', 'Do not lean over protective barriers around ancient pillars', 'Stay on designated pedestrian paved avenues'],
    ARRAY['Illuminated evening park walkway', 'Souvenir emporium', 'Tactile braille markers for visually impaired', 'Luggage storage counter'],
    '1.5 - 2 hours',
    'Late Afternoon / Sunset (16:00 - 18:30)',
    35.00,
    'Low',
    28,
    'falling',
    true
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 4. HAWA MAHAL
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a4444444-4444-4444-4444-444444444444',
    'hawa-mahal',
    'Hawa Mahal (Palace of Winds)',
    'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur',
    'Rajasthan',
    'Palace',
    'An extraordinary five-story pyramidal palace with 953 ornately carved honeycomb casements, built in pink and red sandstone.',
    'Built in 1799 by Maharaja Sawai Pratap Singh, grandson of Jaipur founder Maharaja Sawai Jai Singh II. Designed by architect Lal Chand Ustad in the form of Lord Krishna’s crown, for whom the Maharaja harbored deep spiritual devotion.',
    'A cornerstone of the UNESCO World Heritage City of Jaipur. It was specifically conceived to permit royal women of the zenana to observe vibrant street processions and day-to-day bazaar life while adhering to purdah customs.',
    'Unique Rajput architecture blended with Mughal aesthetics. The five-tier facade features 953 jharokhas with miniature latticed windows that create a natural Venturi air-conditioning effect, cooling the chambers even during scorching Rajasthani summers.',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
    '09:00:00',
    '17:00:00',
    ARRAY[]::TEXT[],
    ARRAY['Ramps and narrow corridors connect upper floors; proceed cautiously', 'Composite ticket available including Amber Fort, Jantar Mantar and Albert Hall'],
    ARRAY['Historical museum displaying miniature paintings and armor', 'Heritage rooftop photography viewpoints across the road', 'Drinking water dispenser'],
    '1 - 1.5 hours',
    'Early Morning (09:00 - 10:30) for eastern sunlight hitting facade',
    50.00,
    'High',
    82,
    'rising',
    true
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 5. AMER FORT (AMBER PALACE)
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a5555555-5555-5555-5555-555555555555',
    'amer-fort',
    'Amer Fort & Palace',
    'Devisinghpura, Amer, Jaipur',
    'Rajasthan',
    'Fort',
    'A magnificent hilltop fortress overlooking Maota Lake, famous for its grand courtyards and the dazzling Sheesh Mahal mirror palace.',
    'Originally founded by Raja Man Singh I in 1592 CE on the ruins of an earlier Meena settlement, and later expanded by Mirza Raja Jai Singh and Sawai Jai Singh II before moving the capital down to Jaipur in 1727.',
    'Part of the UNESCO World Heritage serial listing "Hill Forts of Rajasthan", Amber Fort exemplifies the strategic martial alliances and cross-cultural artistic flowering between the Kachwaha Rajputs and the Mughal Court.',
    'Constructed from yellow and pink sandstone with white marble accents. Divided into four courtyards: Jaleb Chowk, Diwan-e-Aam, the Ganesh Pol gateway leading to royal apartments, and the world-famous Sheesh Mahal inlaid with thousands of concave convex Belgian mirrors.',
    '/images/destinations/amer-fort.jpg',
    '08:00:00',
    '17:30:00',
    ARRAY[]::TEXT[],
    ARRAY['Comfortable walking footwear recommended due to steep inclines and cobblestone ramps', 'Night tourism available between 18:30 and 21:15', 'Audio guides highly recommended to navigate four vast courtyards'],
    ARRAY['Jeep transfer service from foot of hill', 'Royal Cafeteria & 1135 AD fine dining', 'Sound & Light spectacle in English & Hindi', 'Restroom amenities at all major courtyards'],
    '3 - 4 hours',
    'Morning (08:30 - 11:00) or Sunset / Evening Light Show (17:00 - 20:00)',
    100.00,
    'Moderate',
    64,
    'stable',
    true
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 6. INDIA GATE
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a6666666-6666-6666-6666-666666666666',
    'india-gate',
    'India Gate & Kartavya Path',
    'Kartavya Path, India Gate, New Delhi',
    'Delhi',
    'Memorial',
    'A solemn 42-meter triumphal arch war memorial honoring 84,000 soldiers of the British Indian Army who made the supreme sacrifice.',
    'Designed by Sir Edwin Lutyens, the foundation stone was laid on February 10, 1921, by the Duke of Connaught; inaugurated a decade later on February 12, 1931, by Viceroy Lord Irwin. In 1972, following the Indo-Pakistani War of 1971, the Amar Jawan Jyoti eternal flame was consecrated beneath its arch.',
    'India Gate is the civic heart of New Delhi, an enduring civic memorial commemorating sacrifice, valor, and nationhood, now beautifully integrated into the revamped Central Vista and National War Memorial precinct.',
    'Crafted from red and pale Bharatpur sandstone, styled after the Arc de Triomphe in Paris. Inscribed on its walls are the names of over 13,300 servicemen who died during the First World War and Third Anglo-Afghan War.',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85',
    '00:00:00',
    '23:59:59',
    ARRAY[]::TEXT[],
    ARRAY['Open 24 hours daily with security patrolling', 'Pedestrian-friendly Kartavya Path avenues with zero motor vehicle access', 'Littering or damaging public landscaping attracts municipal penalties'],
    ARRAY['Underground parking bays', 'Children playground zones', 'Canal water feature walkways', 'Snack kiosks and shaded gazebos'],
    '1 - 1.5 hours',
    'Twilight and Evening (18:00 - 21:30) when architectural illumination is active',
    0.00,
    'Very High',
    91,
    'rising',
    true
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 7. AJANTA CAVES
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a7777777-7777-7777-7777-777777777777',
    'ajanta-caves',
    'Ajanta Rock-Cut Caves',
    'Ajanta Caves Rd, Aurangabad District, Chhatrapati Sambhaji Nagar',
    'Maharashtra',
    'Cave Temple',
    'A horseshoe-shaped gorge containing 30 rock-cut Buddhist cave monuments preserving ancient masterworks of Indian fresco painting and sculpture.',
    'Dating from the 2nd century BCE to about 480 CE, developed in two distinct phases: the early Satavahana period and the later golden age under the Vakataka dynasty Emperor Harishena. Rediscovered accidentally in 1819 by British officer John Smith during a tiger hunting expedition.',
    'UNESCO World Heritage Site recognized as the finest surviving examples of ancient Indian art and Buddhist iconography, exerting a profound influence on religious murals across Tibet, China, and Southeast Asia.',
    'Carved into the sheer curved basalt rock cliff along the Waghora River. Comprises chaitya-grihas (prayer sanctuaries) and viharas (monastic dormitories). Celebrated worldwide for exquisite dry fresco paintings depicting Jataka tales, Bodhisattvas Padmapani and Vajrapani.',
    '/images/destinations/ajanta-caves.jpg',
    '09:00:00',
    '17:30:00',
    ARRAY['Monday'],
    ARRAY['Flash photography is strictly prohibited inside cave chambers to preserve natural mineral pigments', 'Eco-friendly shuttle bus from T-Junction mandatory', 'Shoe removal required before entering certain sanctums'],
    ARRAY['Ajanta Visitor Interpretation Centre', 'Government canteen and craft market', 'Sedan chair (Doli) services for mobility-impaired visitors', 'Battery-operated green transit buses'],
    '3.5 - 4.5 hours',
    'Early Morning (09:00 - 11:30) to beat canyon heat and midday queues',
    40.00,
    'Low',
    24,
    'falling',
    false
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 8. ELLORA CAVES
INSERT INTO public.destinations (
    id, slug, name, location, state, category, short_description,
    historical_background, cultural_importance, architecture_details,
    cover_image_url, opening_time, closing_time, closed_days,
    visitor_guidelines, facilities, recommended_visit_duration,
    best_visiting_hours, base_ticket_price, current_crowd_level,
    current_crowd_percentage, crowd_trend, is_featured
) VALUES (
    'a8888888-8888-8888-8888-888888888888',
    'ellora-caves',
    'Ellora Caves & Kailash Temple',
    'Ellora Cave Rd, Chhatrapati Sambhaji Nagar',
    'Maharashtra',
    'Cave Temple',
    'An astounding complex of 34 multi-religious cave temples featuring the world’s largest monolithic rock-cut monument, Cave 16 (Kailasa).',
    'Hewn from the Charanandri hills between the 6th and 10th centuries CE under Rashtrakuta and Yadava patronages. Cave 16 (Kailash Temple) was commissioned by King Krishna I in the 8th century, carved entirely top-down from a single volcanic basalt mass.',
    'UNESCO World Heritage Site demonstrating the harmonious coexistence and syncretic dialogue of Hinduism, Buddhism, and Jainism in medieval India, with 17 Hindu, 12 Buddhist, and 5 Jain sanctuaries side-by-side.',
    'Over 200,000 tonnes of rock were chiseled away using only hammers and chisels. The Kailash temple spans twice the area of the Parthenon in Athens and 1.5 times its height, adorned with mammoth carved elephants, Ramayana friezes, and towering multi-tiered gopurams.',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
    '06:00:00',
    '18:00:00',
    ARRAY['Tuesday'],
    ARRAY['Carry plenty of drinking water and sunscreen during summer months', 'Electric golf carts available to travel between Cave 1 to Cave 34', 'Do not deface or climb ancient carved sculptures'],
    ARRAY['MTDC tourist cafeteria', 'Golf carts between cave clusters', 'Bookshop and archaeological documentation cell', 'Clean washroom facilities at Cave 16 courtyard'],
    '3.5 - 5 hours',
    'Early Morning (06:30 - 09:30) or Late Afternoon (15:00 - 17:30)',
    40.00,
    'Moderate',
    48,
    'stable',
    false
) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- ==============================================================================
-- TICKET CATEGORIES SEED DATA
-- ==============================================================================
-- Taj Mahal Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a1111111-1111-1111-1111-111111111111', 'Indian Citizen', 50.00, 'INR', 'Standard entry for citizens of the Republic of India (Government ID required)'),
('a1111111-1111-1111-1111-111111111111', 'SAARC & BIMSTEC Citizen', 540.00, 'INR', 'Entry for passport holders of Bangladesh, Nepal, Bhutan, Sri Lanka, Maldives, etc.'),
('a1111111-1111-1111-1111-111111111111', 'Foreign Tourist', 1100.00, 'INR', 'Includes shoe covers, water bottle and priority entry queue line'),
('a1111111-1111-1111-1111-111111111111', 'Main Mausoleum Add-on', 200.00, 'INR', 'Optional step-up pass to enter upper dome chamber and cenotaph area'),
('a1111111-1111-1111-1111-111111111111', 'Child (Below 15 Years)', 0.00, 'INR', 'Free general entry with age verification proof at gate');

-- Red Fort Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a2222222-2222-2222-2222-222222222222', 'Indian Citizen', 35.00, 'INR', 'Standard general monument access'),
('a2222222-2222-2222-2222-222222222222', 'Foreign Tourist', 550.00, 'INR', 'International visitor admission including museum quarters'),
('a2222222-2222-2222-2222-222222222222', 'Child (Below 15 Years)', 0.00, 'INR', 'Free admission for minors accompanied by an adult');

-- Qutub Minar Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a3333333-3333-3333-3333-333333333333', 'Indian Citizen', 35.00, 'INR', 'Daytime admission to archaeological park and minar area'),
('a3333333-3333-3333-3333-333333333333', 'Foreign Tourist', 550.00, 'INR', 'Full complex admission with fast-track digital turnstile entry');

-- Hawa Mahal Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a4444444-4444-4444-4444-444444444444', 'Indian Citizen', 50.00, 'INR', 'Individual adult admission'),
('a4444444-4444-4444-4444-444444444444', 'Indian Student', 20.00, 'INR', 'Valid institutional student photo ID card required'),
('a4444444-4444-4444-4444-444444444444', 'Foreign Tourist', 200.00, 'INR', 'International visitor single monument entry');

-- Amer Fort Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a5555555-5555-5555-5555-555555555555', 'Indian Citizen', 100.00, 'INR', 'Complete fort and palace palace museum admission'),
('a5555555-5555-5555-5555-555555555555', 'Foreign Tourist', 500.00, 'INR', 'International visitor full access ticket'),
('a5555555-5555-5555-5555-555555555555', 'Night Tourism Pass', 100.00, 'INR', 'Evening illuminated entry (18:30 - 21:15)');

-- Ajanta Caves Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a7777777-7777-7777-7777-777777777777', 'Indian Citizen', 40.00, 'INR', 'Standard entry to Caves 1 to 30'),
('a7777777-7777-7777-7777-777777777777', 'Foreign Tourist', 600.00, 'INR', 'International entry to all accessible cave sanctuaries');

-- Ellora Caves Ticket Tiers
INSERT INTO public.ticket_categories (destination_id, category_name, price, currency, description) VALUES
('a8888888-8888-8888-8888-888888888888', 'Indian Citizen', 40.00, 'INR', 'Full access to Buddhist, Hindu, and Jain cave complexes'),
('a8888888-8888-8888-8888-888888888888', 'Foreign Tourist', 600.00, 'INR', 'International admission to Caves 1-34 including Kailasa');

-- ==============================================================================
-- VISITING TIME SLOTS SEED DATA
-- ==============================================================================
INSERT INTO public.visiting_time_slots (destination_id, start_time, end_time, label, max_capacity, expected_crowd_level) VALUES
-- Taj Mahal slots
('a1111111-1111-1111-1111-111111111111', '06:00:00', '08:30:00', 'Sunrise Slot (06:00 - 08:30)', 3000, 'Moderate'),
('a1111111-1111-1111-1111-111111111111', '09:00:00', '12:00:00', 'Morning Peak (09:00 - 12:00)', 5000, 'Very High'),
('a1111111-1111-1111-1111-111111111111', '12:30:00', '15:30:00', 'Afternoon Slot (12:30 - 15:30)', 4500, 'High'),
('a1111111-1111-1111-1111-111111111111', '16:00:00', '18:30:00', 'Sunset Golden Hour (16:00 - 18:30)', 4000, 'Moderate'),

-- Red Fort slots
('a2222222-2222-2222-2222-222222222222', '09:30:00', '12:00:00', 'Morning Batch (09:30 - 12:00)', 3500, 'Moderate'),
('a2222222-2222-2222-2222-222222222222', '12:30:00', '15:00:00', 'Midday Batch (12:30 - 15:00)', 4000, 'High'),
('a2222222-2222-2222-2222-222222222222', '15:30:00', '17:30:00', 'Evening Batch (15:30 - 17:30)', 3000, 'Moderate'),

-- Amer Fort slots
('a5555555-5555-5555-5555-555555555555', '08:00:00', '11:00:00', 'Early Morning Expedition (08:00 - 11:00)', 2500, 'Low'),
('a5555555-5555-5555-5555-555555555555', '11:30:00', '14:30:00', 'Midday Peak (11:30 - 14:30)', 3800, 'High'),
('a5555555-5555-5555-5555-555555555555', '15:00:00', '17:30:00', 'Late Afternoon Sunset (15:00 - 17:30)', 3000, 'Moderate'),

-- Qutub Minar slots
('a3333333-3333-3333-3333-333333333333', '07:00:00', '11:00:00', 'Morning Serenity (07:00 - 11:00)', 2000, 'Low'),
('a3333333-3333-3333-3333-333333333333', '11:30:00', '15:30:00', 'Afternoon Heritage Walk (11:30 - 15:30)', 3000, 'Moderate'),
('a3333333-3333-3333-3333-333333333333', '16:00:00', '19:00:00', 'Sunset & Illumination (16:00 - 19:00)', 3200, 'Moderate');

-- ==============================================================================
-- CROWD REPORTS SAMPLE LOGS
-- ==============================================================================
INSERT INTO public.crowd_reports (destination_id, recorded_at, crowd_level, crowd_percentage, wait_time_minutes, entry_rate_per_hour, data_source, is_simulated) VALUES
('a1111111-1111-1111-1111-111111111111', now() - interval '6 hours', 'Low', 25, 5, 420, 'simulated_forecast', true),
('a1111111-1111-1111-1111-111111111111', now() - interval '4 hours', 'Moderate', 55, 15, 890, 'simulated_forecast', true),
('a1111111-1111-1111-1111-111111111111', now() - interval '2 hours', 'High', 78, 25, 1250, 'simulated_forecast', true),
('a1111111-1111-1111-1111-111111111111', now(), 'High', 78, 25, 1280, 'simulated_forecast', true),

('a2222222-2222-2222-2222-222222222222', now() - interval '3 hours', 'Moderate', 45, 12, 650, 'simulated_forecast', true),
('a2222222-2222-2222-2222-222222222222', now(), 'Moderate', 52, 14, 720, 'simulated_forecast', true),

('a6666666-6666-6666-6666-666666666666', now() - interval '2 hours', 'High', 85, 0, 2100, 'simulated_forecast', true),
('a6666666-6666-6666-6666-666666666666', now(), 'Very High', 91, 0, 2400, 'simulated_forecast', true);
