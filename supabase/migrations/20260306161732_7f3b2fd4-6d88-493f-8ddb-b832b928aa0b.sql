
-- Gamification profiles: XP, levels, streaks
CREATE TABLE public.gamification_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_active_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification profile" ON public.gamification_profiles
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own gamification profile" ON public.gamification_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification profile" ON public.gamification_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Badge definitions
CREATE TABLE public.badge_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'trophy',
  xp_reward integer NOT NULL DEFAULT 0,
  condition_type text NOT NULL DEFAULT 'manual',
  condition_value integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view badges" ON public.badge_definitions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage badge definitions" ON public.badge_definitions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- User earned badges
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily tasks (personalized)
CREATE TABLE public.daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  description text,
  task_type text NOT NULL DEFAULT 'learning',
  target_route text,
  xp_reward integer NOT NULL DEFAULT 10,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_date, title)
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily tasks" ON public.daily_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily tasks" ON public.daily_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tasks" ON public.daily_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Seed badge definitions
INSERT INTO public.badge_definitions (badge_key, title, description, icon, xp_reward, condition_type, condition_value) VALUES
  ('first_login', 'Welcome!', 'Logged in for the first time', 'sparkles', 10, 'login_count', 1),
  ('streak_3', 'On Fire', '3-day login streak', 'flame', 25, 'streak', 3),
  ('streak_7', 'Week Warrior', '7-day login streak', 'zap', 50, 'streak', 7),
  ('streak_30', 'Monthly Master', '30-day login streak', 'crown', 200, 'streak', 30),
  ('first_upload', 'Contributor', 'Uploaded your first notes', 'upload', 20, 'uploads', 1),
  ('uploads_5', 'Prolific Sharer', 'Uploaded 5 notes', 'files', 50, 'uploads', 5),
  ('lessons_5', 'Quick Learner', 'Completed 5 lessons', 'book-open', 30, 'lessons', 5),
  ('lessons_25', 'Knowledge Seeker', 'Completed 25 lessons', 'graduation-cap', 100, 'lessons', 25),
  ('skills_3', 'Skill Builder', 'Completed 3 skills', 'wrench', 50, 'skills', 3),
  ('resume_built', 'Career Ready', 'Built your first resume', 'file-user', 40, 'resume', 1),
  ('level_5', 'Rising Star', 'Reached Level 5', 'star', 100, 'level', 5),
  ('level_10', 'Pro Student', 'Reached Level 10', 'trophy', 250, 'level', 10);

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION public.xp_to_level(xp integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT GREATEST(1, FLOOR(SQRT(xp::numeric / 50))::integer + 1)
$$;

-- Function to award XP and update level
CREATE OR REPLACE FUNCTION public.award_xp(_user_id uuid, _amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _new_xp integer;
BEGIN
  INSERT INTO gamification_profiles (user_id, xp, level)
  VALUES (_user_id, _amount, xp_to_level(_amount))
  ON CONFLICT (user_id)
  DO UPDATE SET
    xp = gamification_profiles.xp + _amount,
    level = xp_to_level(gamification_profiles.xp + _amount),
    updated_at = now();

  SELECT xp INTO _new_xp FROM gamification_profiles WHERE user_id = _user_id;
END;
$$;

-- Function to update streak on login
CREATE OR REPLACE FUNCTION public.update_streak(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _last_date date;
  _current_streak integer;
  _longest_streak integer;
BEGIN
  SELECT last_active_date, current_streak, longest_streak
  INTO _last_date, _current_streak, _longest_streak
  FROM gamification_profiles WHERE user_id = _user_id;

  IF _last_date IS NULL THEN
    INSERT INTO gamification_profiles (user_id, current_streak, longest_streak, last_active_date)
    VALUES (_user_id, 1, 1, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = 1, longest_streak = GREATEST(gamification_profiles.longest_streak, 1),
      last_active_date = CURRENT_DATE, updated_at = now();
  ELSIF _last_date = CURRENT_DATE THEN
    -- Already logged in today, do nothing
    NULL;
  ELSIF _last_date = CURRENT_DATE - 1 THEN
    _current_streak := _current_streak + 1;
    UPDATE gamification_profiles SET
      current_streak = _current_streak,
      longest_streak = GREATEST(_longest_streak, _current_streak),
      last_active_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = _user_id;
  ELSE
    UPDATE gamification_profiles SET
      current_streak = 1,
      last_active_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = _user_id;
  END IF;
END;
$$;

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  gp.user_id,
  p.display_name,
  p.college,
  p.branch,
  gp.xp,
  gp.level,
  gp.current_streak,
  (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = gp.user_id) as badge_count
FROM gamification_profiles gp
JOIN profiles p ON p.user_id = gp.user_id
WHERE p.is_banned = false
ORDER BY gp.xp DESC;

-- RLS on leaderboard view not needed as it's read from gamification_profiles
-- But we need a policy allowing authenticated users to read
-- Views inherit table policies, so gamification_profiles SELECT needs to allow leaderboard reads
-- Let's add a policy for viewing all gamification profiles for leaderboard
CREATE POLICY "Authenticated can view leaderboard data" ON public.gamification_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Drop the more restrictive policy since the leaderboard one covers it
DROP POLICY IF EXISTS "Users can view own gamification profile" ON public.gamification_profiles;
