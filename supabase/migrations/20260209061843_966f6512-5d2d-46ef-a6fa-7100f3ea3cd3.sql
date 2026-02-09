
-- =============================================
-- 1. ROADMAPS TABLE (admin-created roadmaps)
-- =============================================
CREATE TABLE public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  duration TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published roadmaps"
  ON public.roadmaps FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roadmaps"
  ON public.roadmaps FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roadmaps"
  ON public.roadmaps FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roadmaps"
  ON public.roadmaps FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 2. ROADMAP_SKILLS TABLE
-- =============================================
CREATE TABLE public.roadmap_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  description TEXT,
  tools TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills of published roadmaps"
  ON public.roadmap_skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND (is_published = true OR has_role(auth.uid(), 'admin'))));

CREATE POLICY "Admins can insert roadmap skills"
  ON public.roadmap_skills FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roadmap skills"
  ON public.roadmap_skills FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roadmap skills"
  ON public.roadmap_skills FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- 3. ROADMAP_PROJECTS TABLE
-- =============================================
CREATE TABLE public.roadmap_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects of published roadmaps"
  ON public.roadmap_projects FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND (is_published = true OR has_role(auth.uid(), 'admin'))));

CREATE POLICY "Admins can insert roadmap projects"
  ON public.roadmap_projects FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roadmap projects"
  ON public.roadmap_projects FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roadmap projects"
  ON public.roadmap_projects FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- 4. LEARNING_COURSES TABLE
-- =============================================
CREATE TABLE public.learning_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON public.learning_courses FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert courses"
  ON public.learning_courses FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
  ON public.learning_courses FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
  ON public.learning_courses FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_learning_courses_updated_at
  BEFORE UPDATE ON public.learning_courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. LEARNING_LESSONS TABLE
-- =============================================
CREATE TABLE public.learning_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.learning_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  notes_url TEXT,
  assignment TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons of published courses"
  ON public.learning_lessons FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.learning_courses WHERE id = course_id AND (is_published = true OR has_role(auth.uid(), 'admin'))));

CREATE POLICY "Admins can insert lessons"
  ON public.learning_lessons FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lessons"
  ON public.learning_lessons FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons"
  ON public.learning_lessons FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- 6. PROJECT_TEMPLATES TABLE
-- =============================================
CREATE TABLE public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  category TEXT NOT NULL DEFAULT 'general',
  template_code_url TEXT,
  explanation TEXT,
  interview_qa JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects"
  ON public.project_templates FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert projects"
  ON public.project_templates FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.project_templates FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
  ON public.project_templates FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_project_templates_updated_at
  BEFORE UPDATE ON public.project_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 7. RESUME_TEMPLATES TABLE
-- =============================================
CREATE TABLE public.resume_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  format_type TEXT NOT NULL DEFAULT 'ats',
  file_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates"
  ON public.resume_templates FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert templates"
  ON public.resume_templates FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update templates"
  ON public.resume_templates FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete templates"
  ON public.resume_templates FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_resume_templates_updated_at
  BEFORE UPDATE ON public.resume_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 8. HR_QUESTIONS TABLE
-- =============================================
CREATE TABLE public.hr_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hr_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view HR questions"
  ON public.hr_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert HR questions"
  ON public.hr_questions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update HR questions"
  ON public.hr_questions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete HR questions"
  ON public.hr_questions FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_hr_questions_updated_at
  BEFORE UPDATE ON public.hr_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 9. NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'notification',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notifications"
  ON public.notifications FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notifications"
  ON public.notifications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete notifications"
  ON public.notifications FOR DELETE
  USING (has_role(auth.uid(), 'admin'));
