
-- =============================================
-- FIX 1: Atomic approve/reject RPC functions
-- =============================================

CREATE OR REPLACE FUNCTION public.approve_upload(_upload_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uploader_id UUID;
BEGIN
  -- Only admins can call this
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Atomically update status and get uploader
  UPDATE notes_uploads
  SET status = 'approved'
  WHERE id = _upload_id AND status = 'pending'
  RETURNING uploader_id INTO _uploader_id;

  IF _uploader_id IS NULL THEN
    RAISE EXCEPTION 'Upload not found or already processed';
  END IF;

  -- Atomic quality score increment
  UPDATE profiles
  SET quality_score = COALESCE(quality_score, 0) + 1
  WHERE user_id = _uploader_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_upload(_upload_id UUID, _reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uploader_id UUID;
  _new_score INTEGER;
BEGIN
  -- Only admins can call this
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Atomically update status and get uploader
  UPDATE notes_uploads
  SET status = 'rejected', rejection_reason = _reason
  WHERE id = _upload_id AND status = 'pending'
  RETURNING uploader_id INTO _uploader_id;

  IF _uploader_id IS NULL THEN
    RAISE EXCEPTION 'Upload not found or already processed';
  END IF;

  -- Atomic quality score decrement + conditional ban
  UPDATE profiles
  SET
    quality_score = COALESCE(quality_score, 0) - 2,
    is_banned = CASE
      WHEN COALESCE(quality_score, 0) - 2 <= -5 THEN true
      ELSE is_banned
    END
  WHERE user_id = _uploader_id
  RETURNING quality_score INTO _new_score;
END;
$$;

-- =============================================
-- FIX 2: Add auth.uid() IS NOT NULL to SELECT policies
-- =============================================

-- hr_questions: intentionally public for all authenticated users
DROP POLICY IF EXISTS "Anyone can view HR questions" ON public.hr_questions;
CREATE POLICY "Authenticated users can view HR questions"
  ON public.hr_questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- notifications
DROP POLICY IF EXISTS "Anyone can view active notifications" ON public.notifications;
CREATE POLICY "Authenticated users can view active notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_active = true OR has_role(auth.uid(), 'admin')));

-- roadmaps
DROP POLICY IF EXISTS "Anyone can view published roadmaps" ON public.roadmaps;
CREATE POLICY "Authenticated users can view published roadmaps"
  ON public.roadmaps FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_published = true OR has_role(auth.uid(), 'admin')));

-- learning_courses
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.learning_courses;
CREATE POLICY "Authenticated users can view published courses"
  ON public.learning_courses FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_published = true OR has_role(auth.uid(), 'admin')));

-- learning_lessons
DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON public.learning_lessons;
CREATE POLICY "Authenticated users can view lessons of published courses"
  ON public.learning_lessons FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM learning_courses
    WHERE learning_courses.id = learning_lessons.course_id
    AND (learning_courses.is_published = true OR has_role(auth.uid(), 'admin'))
  ));

-- project_templates
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.project_templates;
CREATE POLICY "Authenticated users can view published projects"
  ON public.project_templates FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_published = true OR has_role(auth.uid(), 'admin')));

-- resume_templates
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.resume_templates;
CREATE POLICY "Authenticated users can view active templates"
  ON public.resume_templates FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_active = true OR has_role(auth.uid(), 'admin')));

-- notes_uploads
DROP POLICY IF EXISTS "Users can view approved notes or own uploads" ON public.notes_uploads;
CREATE POLICY "Users can view approved notes or own uploads"
  ON public.notes_uploads FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      status = 'approved'
      OR auth.uid() = uploader_id
      OR has_role(auth.uid(), 'admin')
    )
  );

-- roadmap_projects
DROP POLICY IF EXISTS "Anyone can view projects of published roadmaps" ON public.roadmap_projects;
CREATE POLICY "Authenticated users can view projects of published roadmaps"
  ON public.roadmap_projects FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM roadmaps
    WHERE roadmaps.id = roadmap_projects.roadmap_id
    AND (roadmaps.is_published = true OR has_role(auth.uid(), 'admin'))
  ));

-- roadmap_skills
DROP POLICY IF EXISTS "Anyone can view skills of published roadmaps" ON public.roadmap_skills;
CREATE POLICY "Authenticated users can view skills of published roadmaps"
  ON public.roadmap_skills FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM roadmaps
    WHERE roadmaps.id = roadmap_skills.roadmap_id
    AND (roadmaps.is_published = true OR has_role(auth.uid(), 'admin'))
  ));
