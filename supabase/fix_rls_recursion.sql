-- ==============================================================================
-- FIX RLS INFINITE RECURSION IN SUPABASE
-- Run this in Supabase SQL Editor to instantly fix the 42P17 error
-- ==============================================================================

-- 1. Create a SECURITY DEFINER function to check admin role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix profiles SELECT policy
DROP POLICY IF EXISTS "Public profiles are readable by owner and admins" ON public.profiles;
CREATE POLICY "Public profiles are readable by owner and admins"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

-- 3. Fix destinations policy (separating read from admin write)
DROP POLICY IF EXISTS "Destinations can be modified by admins only" ON public.destinations;
CREATE POLICY "Destinations insert by admin" ON public.destinations FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Destinations update by admin" ON public.destinations FOR UPDATE USING (public.is_admin());
CREATE POLICY "Destinations delete by admin" ON public.destinations FOR DELETE USING (public.is_admin());

-- 4. Fix destination images policy
DROP POLICY IF EXISTS "Destination images managed by admin" ON public.destination_images;
CREATE POLICY "Destination images insert by admin" ON public.destination_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Destination images update by admin" ON public.destination_images FOR UPDATE USING (public.is_admin());
CREATE POLICY "Destination images delete by admin" ON public.destination_images FOR DELETE USING (public.is_admin());

-- 5. Fix ticket categories policy
DROP POLICY IF EXISTS "Ticket categories managed by admin" ON public.ticket_categories;
CREATE POLICY "Ticket categories insert by admin" ON public.ticket_categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Ticket categories update by admin" ON public.ticket_categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Ticket categories delete by admin" ON public.ticket_categories FOR DELETE USING (public.is_admin());

-- 6. Fix time slots policy
DROP POLICY IF EXISTS "Time slots managed by admin" ON public.visiting_time_slots;
CREATE POLICY "Time slots insert by admin" ON public.visiting_time_slots FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Time slots update by admin" ON public.visiting_time_slots FOR UPDATE USING (public.is_admin());
CREATE POLICY "Time slots delete by admin" ON public.visiting_time_slots FOR DELETE USING (public.is_admin());

-- 7. Fix bookings & crowd reports admin policies
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Crowd reports can be created by admin or system" ON public.crowd_reports;
CREATE POLICY "Crowd reports insert by admin" ON public.crowd_reports FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow admin to read crowd audit trail" ON public.crowd_audit_trail;
CREATE POLICY "Allow admin to read crowd audit trail" ON public.crowd_audit_trail FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admin to update crowd configs" ON public.destination_crowd_configs;
CREATE POLICY "Allow admin to update crowd configs" ON public.destination_crowd_configs FOR UPDATE USING (public.is_admin());
