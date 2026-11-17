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
CREATE POLICY "Allow public read access to destination crowd configs"
    ON public.destination_crowd_configs FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to crowd snapshots"
    ON public.crowd_live_snapshots FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to crowd predictions"
    ON public.crowd_predictions FOR SELECT
    USING (true);

-- Turnstile scan logs: Public/Turnstiles can insert, Staff and Admins can view
CREATE POLICY "Allow authenticated or gate devices to insert access logs"
    ON public.visitor_access_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow staff and admin to read access logs"
    ON public.visitor_access_logs FOR SELECT
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'staff')
        )
    );

-- Audit Trail: Only Admins can view and write
CREATE POLICY "Allow admin to read crowd audit trail"
    ON public.crowd_audit_trail FOR SELECT
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Allow admin or system to insert crowd audit trail"
    ON public.crowd_audit_trail FOR INSERT
    WITH CHECK (true);

-- Configs update: Only Admins
CREATE POLICY "Allow admin to update crowd configs"
    ON public.destination_crowd_configs FOR UPDATE
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
