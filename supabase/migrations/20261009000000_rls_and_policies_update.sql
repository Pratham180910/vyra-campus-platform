-- ==============================================================================
-- VYRA SUPABASE SCHEMA MIGRATION: RLS, POLICIES & SECURITY HARDENING (AUDITED V3)
-- Phase 2: Complete RLS Hardening, Role Protection, Notification Safeguards,
-- Club Membership Privacy, Non-Recursive Policies, and Least-Privilege Grants.
--
-- Note: Idempotent and non-destructive. Preserves all tables and existing data.
-- ==============================================================================

-- ==============================================================================
-- 1. SECURITY-DEFINER HELPER FUNCTIONS (SAFE SEARCH PATH & MINIMAL PRIVILEGES)
-- ==============================================================================

-- 1.1 Hardened Role Escalation Protection Trigger Function
-- Prevents ordinary profile updates from changing the role column.
-- Does NOT trust OLD.role or a queried profiles table row.
-- Only permits role updates originating from:
--   - Supabase service_role (backend administrative operations)
--   - Cryptographically verified JWT app_metadata claim where role = 'admin'
--   - Direct database administrator sessions (psql/migrations with no JWT context)
CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  jwt_role TEXT;
  app_metadata_role TEXT;
BEGIN
  -- Detect if role is being modified or set to NULL
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Forbid assigning NULL to role
    IF NEW.role IS NULL THEN
      RAISE EXCEPTION 'Profile role cannot be NULL';
    END IF;

    -- Extract JWT context variables safely
    jwt_role := NULLIF(current_setting('request.jwt.claim.role', true), '');

    -- Allow Supabase backend / service_role administrative calls
    IF jwt_role = 'service_role' THEN
      RETURN NEW;
    END IF;

    -- Allow direct database management sessions (e.g. psql / migration scripts where no JWT context exists)
    IF jwt_role IS NULL AND auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;

    -- Allow authenticated administrators whose JWT app_metadata explicitly bears role = 'admin'
    -- Note: app_metadata is cryptographically verified by Supabase Auth and can only be set via service_role
    BEGIN
      app_metadata_role := NULLIF(auth.jwt() -> 'app_metadata' ->> 'role', '');
    EXCEPTION WHEN OTHERS THEN
      app_metadata_role := NULL;
    END;

    IF app_metadata_role = 'admin' THEN
      RETURN NEW;
    END IF;

    -- Block all other profile role changes (prevent ordinary client self-promotion)
    RAISE EXCEPTION 'Unauthorized: Profile role cannot be modified through client profile editing.';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_profile_role_update() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_role_update();


-- 1.2 Concurrency-Safe Partial Unique Indexes for Notifications
-- Guarantees transaction-level serialization against duplicate notification rows under race conditions.
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_user_event_registered
  ON public.notifications (user_id, event_id, type)
  WHERE event_id IS NOT NULL AND type = 'EVENT_REGISTERED';

-- Deduplicate strictly the initial welcome notification, preserving the ability to receive subsequent SYSTEM notices
DROP INDEX IF EXISTS idx_notifications_user_system_welcome;
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_user_welcome
  ON public.notifications (user_id)
  WHERE type = 'SYSTEM' AND title = 'Welcome to VYRA';


-- 1.3 Trusted Registration Notification Generator (Concurrency-Safe & Idempotent)
-- Automatically creates a confirmation notification upon successful registration.
-- Eliminates the need for arbitrary client-side notification inserts.
CREATE OR REPLACE FUNCTION public.handle_registration_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_event_title TEXT;
BEGIN
  -- Prevent duplicate notification for the same registration record
  IF EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = NEW.user_id
      AND event_id = NEW.event_id
      AND type = 'EVENT_REGISTERED'
  ) THEN
    RETURN NEW;
  END IF;

  SELECT title INTO v_event_title FROM public.events WHERE id = NEW.event_id;
  IF v_event_title IS NULL THEN
    v_event_title := NEW.event_id;
  END IF;

  BEGIN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      event_id,
      read,
      created_at
    ) VALUES (
      NEW.user_id,
      'EVENT_REGISTERED',
      'Event Pass Reserved',
      'Your registration for "' || v_event_title || '" has been confirmed. Pass ready in My VYRA.',
      NEW.event_id,
      false,
      timezone('utc'::text, now())
    );
  EXCEPTION WHEN unique_violation THEN
    -- Concurrently inserted or already exists; safe no-op
    RETURN NEW;
  END;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_registration_notification() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_registration_notification ON public.registrations;
CREATE TRIGGER trg_registration_notification
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_registration_notification();


-- 1.4 Trusted New User Provisioning (Profile + Welcome Notification)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_style,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'fullName',
      split_part(NEW.email, '@', 1)
    ),
    'neon-violet',
    'student',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO NOTHING;

  -- Ensure welcome notification is not duplicated under concurrent execution
  IF NOT EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = NEW.id AND type = 'SYSTEM' AND title = 'Welcome to VYRA'
  ) THEN
    BEGIN
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        read,
        created_at
      ) VALUES (
        NEW.id,
        'SYSTEM',
        'Welcome to VYRA',
        'Your campus discovery command center is configured and ready to explore.',
        false,
        timezone('utc'::text, now())
      );
    EXCEPTION WHEN unique_violation THEN
      -- Concurrently inserted; safe no-op
      NULL;
    END;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 1.5 Safe Helper to Verify Club Leadership / Admin Without Policy Recursion
-- Prevents infinite recursion when evaluating club_members SELECT policies.
-- Evaluates strictly for the authenticated caller (auth.uid()); rejects arbitrary client-supplied user IDs.
DROP FUNCTION IF EXISTS public.is_club_admin_or_lead(TEXT, UUID);
CREATE OR REPLACE FUNCTION public.is_club_admin_or_lead(check_club_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT (auth.uid() IS NOT NULL) AND (
    EXISTS (
      SELECT 1 FROM public.club_members
      WHERE club_id = check_club_id
        AND user_id = auth.uid()
        AND role IN ('lead', 'coordinator', 'admin')
    ) OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_club_admin_or_lead(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_club_admin_or_lead(TEXT) TO authenticated;


-- 1.6 Safe Aggregation Helper for Club Member Counts
-- Allows public visitors and authenticated students to view accurate member counts
-- without exposing personal student membership records.
CREATE OR REPLACE FUNCTION public.get_club_member_count(target_club_id TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT count(*)::integer FROM public.club_members WHERE club_id = target_club_id;
$$;

REVOKE EXECUTE ON FUNCTION public.get_club_member_count(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_club_member_count(TEXT) TO anon, authenticated;


-- ==============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES HARMONIZATION
-- Drop all previous and overlapping policy names before applying hardened definitions.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 2.1 PROFILES POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view basic profiles" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- ------------------------------------------------------------------------------
-- 2.2 EVENTS POLICIES
-- Public discovery for published events; draft events restricted to owner/admin.
-- ------------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view published events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view published events" ON public.events;
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Organizers can view own events" ON public.events;
CREATE POLICY "Organizers can view own events" ON public.events
  FOR SELECT TO authenticated USING (
    organizer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Organizers can create events as themselves" ON public.events;
CREATE POLICY "Organizers can create events as themselves" ON public.events
  FOR INSERT TO authenticated WITH CHECK (
    organizer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('organizer', 'admin')
    )
  );

DROP POLICY IF EXISTS "Organizers can update their own events" ON public.events;
CREATE POLICY "Organizers can update their own events" ON public.events
  FOR UPDATE TO authenticated USING (
    organizer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    organizer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Organizers can delete their own events" ON public.events;
CREATE POLICY "Organizers can delete their own events" ON public.events
  FOR DELETE TO authenticated USING (
    organizer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );


-- ------------------------------------------------------------------------------
-- 2.3 CLUBS POLICIES
-- Public discovery for campus clubs; administrative operations restricted to admins.
-- ------------------------------------------------------------------------------
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view clubs" ON public.clubs;
DROP POLICY IF EXISTS "Anyone can view clubs" ON public.clubs;
CREATE POLICY "Anyone can view clubs" ON public.clubs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage clubs" ON public.clubs;
CREATE POLICY "Admins can manage clubs" ON public.clubs
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ------------------------------------------------------------------------------
-- 2.4 CLUB MEMBERS POLICIES (PRIVACY HARDENED & NON-RECURSIVE)
-- Membership rows are NOT publicly enumerated.
-- Students view their own memberships; club leaders/admins view their club roster.
-- ------------------------------------------------------------------------------
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view club members" ON public.club_members;
DROP POLICY IF EXISTS "Authenticated users can view club members" ON public.club_members;
DROP POLICY IF EXISTS "Users can view own club memberships" ON public.club_members;
CREATE POLICY "Users can view own club memberships" ON public.club_members
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Club leaders and admins can view club members" ON public.club_members;
CREATE POLICY "Club leaders and admins can view club members" ON public.club_members
  FOR SELECT TO authenticated USING (
    public.is_club_admin_or_lead(club_members.club_id)
  );

DROP POLICY IF EXISTS "Users can join as themselves" ON public.club_members;
CREATE POLICY "Users can join as themselves" ON public.club_members
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND role = 'member'
  );

DROP POLICY IF EXISTS "Users can leave their own membership" ON public.club_members;
CREATE POLICY "Users can leave their own membership" ON public.club_members
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- ------------------------------------------------------------------------------
-- 2.5 REGISTRATIONS POLICIES
-- Students view their registrations; event organizers view attendee rosters for their events.
-- ------------------------------------------------------------------------------
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and organizers can view relevant registrations" ON public.registrations;
CREATE POLICY "Users and organizers can view relevant registrations" ON public.registrations
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can create their own registration" ON public.registrations;
CREATE POLICY "Users can create their own registration" ON public.registrations
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can cancel their own registration" ON public.registrations;
CREATE POLICY "Users can cancel their own registration" ON public.registrations
  FOR UPDATE TO authenticated USING (
    user_id = auth.uid()
  ) WITH CHECK (
    user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Organizers can update registrations for their events" ON public.registrations;
CREATE POLICY "Organizers can update registrations for their events" ON public.registrations
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid()
    )
  );


-- ------------------------------------------------------------------------------
-- 2.6 SAVED EVENTS POLICIES
-- Students manage strictly their own saved events.
-- ------------------------------------------------------------------------------
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own saved events" ON public.saved_events;
CREATE POLICY "Users can view their own saved events" ON public.saved_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can save events for themselves" ON public.saved_events;
CREATE POLICY "Users can save events for themselves" ON public.saved_events
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can remove their own saved events" ON public.saved_events;
CREATE POLICY "Users can remove their own saved events" ON public.saved_events
  FOR DELETE TO authenticated USING (user_id = auth.uid());


-- ------------------------------------------------------------------------------
-- 2.7 NOTIFICATIONS POLICIES (ARBITRARY INSERT PREVENTED)
-- Direct client INSERT is prohibited. Creation is strictly governed by trusted triggers.
-- Users can read, update (mark as read), and delete (dismiss) their own notifications.
-- ------------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());


-- ------------------------------------------------------------------------------
-- 2.8 ATTENDANCE POLICIES
-- Attendees view their attendance; event organizers and admins manage check-ins.
-- ------------------------------------------------------------------------------
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own attendance" ON public.attendance;
CREATE POLICY "Users can view their own attendance" ON public.attendance
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Organizers can manage attendance for their events" ON public.attendance;
CREATE POLICY "Organizers can manage attendance for their events" ON public.attendance
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = attendance.event_id AND events.organizer_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = attendance.event_id AND events.organizer_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ==============================================================================
-- 3. LEAST-PRIVILEGE POSTGRESQL TABLE GRANTS
-- Strictly restricts permissions to verified frontend needs.
-- Revokes any previously granted excessive permissions.
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Revoke any excessive permissions
REVOKE ALL ON public.club_members FROM anon;
REVOKE INSERT ON public.notifications FROM anon, authenticated;
REVOKE DELETE ON public.profiles FROM authenticated;
REVOKE DELETE ON public.registrations FROM authenticated;
REVOKE UPDATE ON public.saved_events FROM authenticated;

-- Anonymous (Public Discovery): SELECT only on published events and clubs
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.clubs TO anon;

-- Authenticated Users: Explicit least-privilege operations
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clubs TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.club_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.registrations TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_events TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;

-- Sequences usage if any are created
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
