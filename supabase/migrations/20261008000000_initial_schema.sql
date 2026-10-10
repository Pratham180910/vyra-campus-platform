-- ==============================================================================
-- VYRA SUPABASE SCHEMA MIGRATION: INITIAL SCHEMA
-- Phase 1: Foundational Tables, Constraints, Indexes, RLS, and Auth Trigger
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('draft', 'published', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_status AS ENUM ('confirmed', 'waitlisted', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('registered', 'checked_in', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked directly to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  avatar_style TEXT DEFAULT 'neon-violet',
  department TEXT,
  academic_year TEXT,
  section TEXT,
  campus TEXT DEFAULT 'SRMIST Kattankulathur',
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  discovery_preferences JSONB DEFAULT '{"eventTypes": [], "discoveryMode": "ALL"}'::jsonb,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organizer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CLUBS TABLE
CREATE TABLE IF NOT EXISTS public.clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT,
  description TEXT,
  category TEXT NOT NULL,
  department TEXT,
  cover_image TEXT,
  logo TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CLUB MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'lead', 'coordinator', 'admin')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_club_member UNIQUE (club_id, user_id)
);

-- 6. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  venue TEXT NOT NULL,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  club_id TEXT REFERENCES public.clubs(id) ON DELETE SET NULL,
  capacity INTEGER,
  registration_deadline TIMESTAMPTZ,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT,
  academic_year TEXT,
  note TEXT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  CONSTRAINT unique_event_registration UNIQUE (event_id, user_id)
);

-- 8. SAVED EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_saved_event UNIQUE (event_id, user_id)
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  event_id TEXT REFERENCES public.events(id) ON DELETE SET NULL,
  club_id TEXT REFERENCES public.clubs(id) ON DELETE SET NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'checked_in', 'no_show')),
  checked_in_at TIMESTAMPTZ,
  CONSTRAINT unique_event_user_attendance UNIQUE (event_id, user_id)
);

-- ==============================================================================
-- 11. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_events_user_id ON public.saved_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club_id ON public.club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user_id ON public.club_members(user_id);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- CLUBS POLICIES
DROP POLICY IF EXISTS "Authenticated users can view clubs" ON public.clubs;
CREATE POLICY "Authenticated users can view clubs" ON public.clubs
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage clubs" ON public.clubs;
CREATE POLICY "Admins can manage clubs" ON public.clubs
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- CLUB MEMBERS POLICIES
DROP POLICY IF EXISTS "Authenticated users can view club members" ON public.club_members;
CREATE POLICY "Authenticated users can view club members" ON public.club_members
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can join as themselves" ON public.club_members;
CREATE POLICY "Users can join as themselves" ON public.club_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave their own membership" ON public.club_members;
CREATE POLICY "Users can leave their own membership" ON public.club_members
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- EVENTS POLICIES
DROP POLICY IF EXISTS "Authenticated users can view published events" ON public.events;
CREATE POLICY "Authenticated users can view published events" ON public.events
  FOR SELECT TO authenticated USING (
    status = 'published' OR organizer_id = auth.uid()
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
    organizer_id = auth.uid()
  ) WITH CHECK (
    organizer_id = auth.uid()
  );

DROP POLICY IF EXISTS "Organizers can delete their own events" ON public.events;
CREATE POLICY "Organizers can delete their own events" ON public.events
  FOR DELETE TO authenticated USING (
    organizer_id = auth.uid()
  );

-- REGISTRATIONS POLICIES
DROP POLICY IF EXISTS "Users and organizers can view relevant registrations" ON public.registrations;
CREATE POLICY "Users and organizers can view relevant registrations" ON public.registrations
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid()
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

-- SAVED EVENTS POLICIES
DROP POLICY IF EXISTS "Users can view their own saved events" ON public.saved_events;
CREATE POLICY "Users can view their own saved events" ON public.saved_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can save events for themselves" ON public.saved_events;
CREATE POLICY "Users can save events for themselves" ON public.saved_events
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can remove their own saved events" ON public.saved_events;
CREATE POLICY "Users can remove their own saved events" ON public.saved_events
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ATTENDANCE POLICIES
DROP POLICY IF EXISTS "Organizers can manage attendance for their events" ON public.attendance;
CREATE POLICY "Organizers can manage attendance for their events" ON public.attendance
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = attendance.event_id AND events.organizer_id = auth.uid()
    )
  );

-- ==============================================================================
-- 13. AUTOMATIC PROFILE PROVISIONING TRIGGER ON AUTH.USERS INSERT
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'fullName',
      split_part(new.email, '@', 1)
    ),
    'neon-violet',
    'student',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
