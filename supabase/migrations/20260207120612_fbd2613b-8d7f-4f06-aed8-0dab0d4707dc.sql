
-- Create enum types
CREATE TYPE public.upload_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.note_type AS ENUM ('notes', 'pyq', 'syllabus');

-- Profiles table (stores onboarding data + progress)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  college TEXT,
  branch TEXT,
  semester TEXT,
  career_goal TEXT,
  language TEXT DEFAULT 'English',
  onboarding_completed BOOLEAN DEFAULT false,
  overall_progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate as required for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Notes/PYQs uploads with moderation
CREATE TABLE public.notes_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type note_type NOT NULL DEFAULT 'notes',
  subject TEXT NOT NULL,
  semester TEXT NOT NULL,
  branch TEXT NOT NULL,
  college TEXT NOT NULL,
  file_url TEXT,
  status upload_status NOT NULL DEFAULT 'pending',
  downloads INTEGER DEFAULT 0,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roadmap progress tracking
CREATE TABLE public.roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  roadmap_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, roadmap_id, step_id)
);

-- Skill progress tracking  
CREATE TABLE public.skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  roadmap_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, roadmap_id, skill_name)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Timestamp update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_uploads_updated_at
  BEFORE UPDATE ON public.notes_uploads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== RLS POLICIES =====

-- Profiles: users see/edit own, admins see all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles: users see own, admins manage
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Notes uploads: anyone authenticated can upload (pending), see approved + own, admins manage all
CREATE POLICY "Users can view approved notes or own uploads"
  ON public.notes_uploads FOR SELECT
  USING (
    status = 'approved'
    OR auth.uid() = uploader_id
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Authenticated users can upload notes"
  ON public.notes_uploads FOR INSERT
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update own pending notes or admins can update any"
  ON public.notes_uploads FOR UPDATE
  USING (
    (auth.uid() = uploader_id AND status = 'pending')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can delete own pending notes or admins can delete any"
  ON public.notes_uploads FOR DELETE
  USING (
    (auth.uid() = uploader_id AND status = 'pending')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Roadmap progress: users manage own, admins read all
CREATE POLICY "Users can view own roadmap progress"
  ON public.roadmap_progress FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own roadmap progress"
  ON public.roadmap_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmap progress"
  ON public.roadmap_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmap progress"
  ON public.roadmap_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Skill progress: users manage own
CREATE POLICY "Users can view own skill progress"
  ON public.skill_progress FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own skill progress"
  ON public.skill_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill progress"
  ON public.skill_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Storage bucket for notes files
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes-files', 'notes-files', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload notes files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'notes-files' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view notes files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notes-files');

CREATE POLICY "Users can delete own files or admins can delete any"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'notes-files' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Indexes for performance
CREATE INDEX idx_notes_uploads_status ON public.notes_uploads(status);
CREATE INDEX idx_notes_uploads_uploader ON public.notes_uploads(uploader_id);
CREATE INDEX idx_notes_uploads_college_branch ON public.notes_uploads(college, branch, semester);
CREATE INDEX idx_roadmap_progress_user ON public.roadmap_progress(user_id, roadmap_id);
CREATE INDEX idx_skill_progress_user ON public.skill_progress(user_id, roadmap_id);
