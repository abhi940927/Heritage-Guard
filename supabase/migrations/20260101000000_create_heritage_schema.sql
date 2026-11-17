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

-- Profiles: Anyone authenticated can view their own; Admins can view and edit all
CREATE POLICY "Public profiles are readable by owner and admins"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Destinations & Sub-tables: Public read-only; Admin insert/update/delete
CREATE POLICY "Destinations are viewable by everyone"
    ON public.destinations FOR SELECT USING (true);

CREATE POLICY "Destinations can be modified by admins only"
    ON public.destinations FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Destination images are viewable by everyone"
    ON public.destination_images FOR SELECT USING (true);

CREATE POLICY "Destination images managed by admin"
    ON public.destination_images FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Ticket categories viewable by everyone"
    ON public.ticket_categories FOR SELECT USING (true);

CREATE POLICY "Ticket categories managed by admin"
    ON public.ticket_categories FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Time slots viewable by everyone"
    ON public.visiting_time_slots FOR SELECT USING (true);

CREATE POLICY "Time slots managed by admin"
    ON public.visiting_time_slots FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Bookings & Visitors: Users can view their own bookings; Admins view all; Any user (authenticated or guest with valid session) can create
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Anyone can create a booking"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can update bookings"
    ON public.bookings FOR UPDATE
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can view their booking visitors"
    ON public.booking_visitors FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.booking_visitors.booking_id
            AND (public.bookings.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
        )
    );

CREATE POLICY "Anyone can insert booking visitors"
    ON public.booking_visitors FOR INSERT
    WITH CHECK (true);

-- Crowd Reports: Viewable by everyone; Managed by admins
CREATE POLICY "Crowd reports are viewable by everyone"
    ON public.crowd_reports FOR SELECT USING (true);

CREATE POLICY "Crowd reports can be created by admin or system"
    ON public.crowd_reports FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Saved Destinations: Users manage their own
CREATE POLICY "Users view own saved destinations"
    ON public.saved_destinations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users insert own saved destinations"
    ON public.saved_destinations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own saved destinations"
    ON public.saved_destinations FOR DELETE
    USING (auth.uid() = user_id);

-- Contact Messages: Anyone can insert; Admins can view/update
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
    ON public.contact_messages FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
