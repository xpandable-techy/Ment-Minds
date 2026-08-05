-- MENTMINDS (RC8946867) Complete Production Supabase Schema
-- Run this script in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PRE-REGISTERED EMAILS Table (Optional: Restrict Google Login to allowed emails)
CREATE TABLE IF NOT EXISTS public.registered_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'mentee' CHECK (role IN ('mentee', 'mentor', 'admin')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-register mentor and admin emails
INSERT INTO public.registered_emails (email, role, notes) VALUES
('yusufabbkkhalil@gmail.com', 'admin', 'Yusuf Khalil Abubakar - Super Admin & CTO'),
('yusufbnabibikrinn@gmail.com', 'admin', 'Yusuf Abubakar - Super Admin & Executive'),
('salmabizi@gmail.com', 'mentor', 'Salma Bizi - Public Speaking & Spoken Word Poet'),
('abdulmalik.punsmith@gmail.com', 'mentor', 'Abdulmalik Yahya (The Punsmith) - Public Speaking & Authorship'),
('idrisabba846@gmail.com', 'mentor', 'Abba Musa Idris - Public Speaking & Journalism'),
('sajudamahmud@gmail.com', 'mentor', 'Sajuda Mahmud - Public Speaking & Advocacy'),
('sumayyaabdullahi1010@gmail.com', 'mentor', 'Sumayya Abdullahi Hussaini - Advocacy & Good Governance'),
('saeedameer406@gmail.com', 'mentor', 'Ameer Saeed - Public Speaking & Youth Leadership'),
('shettimahadiza88@gmail.com', 'mentor', 'Dr. Hadiza Shettima - Sustainability & Dairy Science'),
('elshams9794@gmail.com', 'mentor', 'Shamsuddeen Jibril - Robotics, Aerospace & Mentminds Executive Founder')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- 3. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  phone_whatsapp TEXT,
  role TEXT NOT NULL CHECK (role IN ('mentee', 'mentor', 'admin')),
  status TEXT DEFAULT 'Fresh Mentee',
  bio TEXT,
  avatar_url TEXT,
  interests TEXT[] DEFAULT '{}',
  expertise TEXT[] DEFAULT '{}',
  courses_taught TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}'::jsonb,
  assigned_topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create MENTOR_REQUESTS Table
CREATE TABLE IF NOT EXISTS public.mentor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentee_name TEXT NOT NULL,
  mentee_avatar TEXT,
  mentee_email TEXT NOT NULL,
  mentee_whatsapp TEXT NOT NULL,
  mentee_interest TEXT NOT NULL,
  mentee_message TEXT,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  mentor_avatar TEXT,
  mentor_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_admin' CHECK (status IN ('awaiting_admin', 'sent_to_mentor', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create SESSIONS Table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  mentor_avatar TEXT,
  meet_url TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  audience TEXT DEFAULT 'all' CHECK (audience IN ('all', 'specific')),
  specific_mentee_ids UUID[] DEFAULT '{}',
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending_admin', 'approved', 'completed')),
  topic_assigned_by_admin BOOLEAN DEFAULT FALSE,
  flyer_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create FLYERS Table
CREATE TABLE IF NOT EXISTS public.flyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  image_url TEXT NOT NULL,
  meet_link TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create NEWSLETTERS Table
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create NEWS_ARTICLES Table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Announcement', 'Advocacy', 'Webinar', 'Impact Story')),
  date TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN CHECK HELPER FUNCTION
-- Row Level Security policies on "profiles" must NEVER query "profiles"
-- directly to check the caller's role (e.g. "EXISTS (SELECT 1 FROM
-- profiles WHERE id = auth.uid() AND role = 'admin')" written inline on a
-- profiles policy) — evaluating that policy requires re-running the same
-- policy on the very query it triggers, which Postgres detects as
-- infinite recursion and every request against profiles fails with a 500
-- ("infinite recursion detected in policy for relation 'profiles'").
-- Wrapping the check in a SECURITY DEFINER function avoids this: the
-- function runs with the privileges of its owner (the role that ran this
-- script, typically not subject to RLS), so the lookup inside it doesn't
-- re-trigger the calling policy.
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin');
$$;

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.registered_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Registered Emails Policies (Admin only read/write)
DROP POLICY IF EXISTS "Admins manage registered_emails" ON public.registered_emails;
CREATE POLICY "Admins manage registered_emails" 
  ON public.registered_emails FOR ALL USING (
    public.is_admin(auth.uid())
  );

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

-- Note: new profile rows are created by the handle_new_user() trigger below,
-- which runs as SECURITY DEFINER and bypasses RLS entirely — so this INSERT
-- policy only needs to cover the rare case of a client inserting directly.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" 
  ON public.profiles FOR ALL USING (
    public.is_admin(auth.uid())
  );

-- Mentor Requests Policies
DROP POLICY IF EXISTS "Mentees can view their own requests" ON public.mentor_requests;
CREATE POLICY "Mentees can view their own requests" 
  ON public.mentor_requests FOR SELECT USING (auth.uid() = mentee_id);

DROP POLICY IF EXISTS "Mentors can view requests sent to them" ON public.mentor_requests;
CREATE POLICY "Mentors can view requests sent to them" 
  ON public.mentor_requests FOR SELECT USING (auth.uid() = mentor_id AND status IN ('sent_to_mentor', 'approved'));

DROP POLICY IF EXISTS "Mentees can create requests" ON public.mentor_requests;
CREATE POLICY "Mentees can create requests" 
  ON public.mentor_requests FOR INSERT WITH CHECK (auth.uid() = mentee_id);

DROP POLICY IF EXISTS "Mentors can update requests sent to them" ON public.mentor_requests;
CREATE POLICY "Mentors can update requests sent to them" 
  ON public.mentor_requests FOR UPDATE USING (auth.uid() = mentor_id AND status = 'sent_to_mentor');

DROP POLICY IF EXISTS "Admins have full access to mentor requests" ON public.mentor_requests;
CREATE POLICY "Admins have full access to mentor requests" 
  ON public.mentor_requests FOR ALL USING (
    public.is_admin(auth.uid())
  );

-- Sessions Policies
DROP POLICY IF EXISTS "Sessions are viewable by authenticated users" ON public.sessions;
CREATE POLICY "Sessions are viewable by authenticated users" 
  ON public.sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Mentors can insert sessions" ON public.sessions;
CREATE POLICY "Mentors can insert sessions" 
  ON public.sessions FOR INSERT WITH CHECK (auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Mentors can update their own sessions" ON public.sessions;
CREATE POLICY "Mentors can update their own sessions" 
  ON public.sessions FOR UPDATE USING (auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Admins manage all sessions" ON public.sessions;
CREATE POLICY "Admins manage all sessions" 
  ON public.sessions FOR ALL USING (
    public.is_admin(auth.uid())
  );

-- Flyers & News Articles Public View
DROP POLICY IF EXISTS "Flyers viewable by everyone" ON public.flyers;
CREATE POLICY "Flyers viewable by everyone" ON public.flyers FOR SELECT USING (true);

DROP POLICY IF EXISTS "News viewable by everyone" ON public.news_articles;
CREATE POLICY "News viewable by everyone" ON public.news_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage flyers" ON public.flyers;
CREATE POLICY "Admins manage flyers" ON public.flyers FOR ALL USING (
  public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Admins manage news" ON public.news_articles;
CREATE POLICY "Admins manage news" ON public.news_articles FOR ALL USING (
  public.is_admin(auth.uid())
);

-- Newsletter Policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletters;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletters FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletters;
CREATE POLICY "Admins can view subscribers" ON public.newsletters FOR SELECT USING (
  public.is_admin(auth.uid())
);

-- AUTOMATIC NEW USER HANDLER (Trigger for Email & OAuth Signups)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  user_full_name TEXT;
BEGIN
  -- 1. First check if role was explicitly selected during signup form metadata
  assigned_role := NULLIF(new.raw_user_meta_data->>'role', '');
  
  -- 2. Fallback to registered_emails table if not provided in metadata
  IF assigned_role IS NULL THEN
    SELECT role INTO assigned_role 
    FROM public.registered_emails 
    WHERE LOWER(email) = LOWER(new.email) 
    LIMIT 1;
  END IF;
  
  -- 3. Default to mentee if neither metadata nor registered_emails specify
  IF assigned_role IS NULL THEN
    assigned_role := 'mentee';
  END IF;

  user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  INSERT INTO public.profiles (
    id, email, full_name, role, status, avatar_url,
    date_of_birth, phone_whatsapp, interests, bio, social_links, created_at
  )
  VALUES (
    new.id,
    new.email,
    user_full_name,
    assigned_role,
    CASE WHEN assigned_role = 'mentor' THEN 'Active Mentor' ELSE 'Fresh Mentee' END,
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', 'https://ui-avatars.com/api/?name=' || REPLACE(user_full_name, ' ', '+') || '&background=0B6291&color=fff'),
    NULLIF(new.raw_user_meta_data->>'date_of_birth', '')::DATE,
    new.raw_user_meta_data->>'phone_whatsapp',
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'interests')),
      '{}'
    ),
    new.raw_user_meta_data->>'bio',
    COALESCE(new.raw_user_meta_data->'social_links', '{}'::jsonb),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 9. STORAGE BUCKET for profile photos ("passports")
-- Creates a public-read bucket where each person's files live under a
-- folder named after their own user id (avatars/<uid>/<filename>), which is
-- what the upload policy below checks against.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
  );
