-- ==============================================================================
-- VYRA SUPABASE SCHEMA MIGRATION: ORGANIZERS CAN MANAGE CLUBS & CLUB LEADERSHIP
-- 
-- Fixes: "new row violates row-level security policy for table clubs"
-- 
-- Cause:
-- The previous RLS policy "Admins can manage clubs" strictly required profiles.role = 'admin',
-- preventing authenticated users with role = 'organizer' from inserting/updating clubs.
-- Furthermore, club_members only allowed role = 'member' on INSERT, which blocked
-- organizers from assigning themselves as club lead ('lead').
--
-- Solution:
-- 1. Updates public.clubs policies so users with role IN ('organizer', 'admin') can
--    create, update, and manage clubs.
-- 2. Updates public.club_members policies so organizers/admins can add themselves
--    as club leaders without violating RLS.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CLUBS TABLE RLS POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Preserve public read access
DROP POLICY IF EXISTS "Anyone can view clubs" ON public.clubs;
DROP POLICY IF EXISTS "Authenticated users can view clubs" ON public.clubs;
CREATE POLICY "Anyone can view clubs" ON public.clubs
  FOR SELECT USING (true);

-- Allow authenticated organizers and admins to INSERT clubs
DROP POLICY IF EXISTS "Organizers and admins can create clubs" ON public.clubs;
CREATE POLICY "Organizers and admins can create clubs" ON public.clubs
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    )
  );

-- Allow authenticated organizers and admins to UPDATE clubs
DROP POLICY IF EXISTS "Organizers and admins can update clubs" ON public.clubs;
CREATE POLICY "Organizers and admins can update clubs" ON public.clubs
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    )
  );

-- Allow authenticated organizers and admins to DELETE clubs
DROP POLICY IF EXISTS "Organizers and admins can delete clubs" ON public.clubs;
CREATE POLICY "Organizers and admins can delete clubs" ON public.clubs
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    )
  );

-- Clean up older restrictive policies
DROP POLICY IF EXISTS "Admins can manage clubs" ON public.clubs;
DROP POLICY IF EXISTS "Organizers and admins can manage clubs" ON public.clubs;


-- ------------------------------------------------------------------------------
-- 2. CLUB MEMBERS TABLE RLS POLICIES (AVOIDS 2ND RLS ERROR)
-- ------------------------------------------------------------------------------
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

-- Preserve student self-join as 'member'
DROP POLICY IF EXISTS "Users can join as themselves" ON public.club_members;
CREATE POLICY "Users can join as themselves" ON public.club_members
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND role = 'member'
  );

-- Allow organizers and admins to assign leadership (lead/coordinator/admin) to themselves
DROP POLICY IF EXISTS "Organizers and leaders can add club leads and members" ON public.club_members;
CREATE POLICY "Organizers and leaders can add club leads and members" ON public.club_members
  FOR INSERT TO authenticated WITH CHECK (
    (auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    )) OR
    public.is_club_admin_or_lead(club_members.club_id)
  );

-- Allow organizers and leaders to update club member records
DROP POLICY IF EXISTS "Organizers and leaders can update club memberships" ON public.club_members;
CREATE POLICY "Organizers and leaders can update club memberships" ON public.club_members
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    ) OR
    public.is_club_admin_or_lead(club_members.club_id)
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    ) OR
    public.is_club_admin_or_lead(club_members.club_id)
  );

-- Allow organizers and leaders to remove club members
DROP POLICY IF EXISTS "Organizers and leaders can remove club members" ON public.club_members;
CREATE POLICY "Organizers and leaders can remove club members" ON public.club_members
  FOR DELETE TO authenticated USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('organizer', 'admin')
    ) OR
    public.is_club_admin_or_lead(club_members.club_id)
  );


-- ------------------------------------------------------------------------------
-- 3. PERMISSIONS GRANT
-- ------------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clubs TO authenticated;
GRANT SELECT ON public.clubs TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_members TO authenticated;
GRANT SELECT ON public.club_members TO anon;
