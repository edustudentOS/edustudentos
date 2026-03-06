
-- Fix: Drop the security definer view and recreate as security invoker
DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard
WITH (security_invoker = true)
AS
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

-- Fix: Set search_path on xp_to_level function
CREATE OR REPLACE FUNCTION public.xp_to_level(xp integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT GREATEST(1, FLOOR(SQRT(xp::numeric / 50))::integer + 1)
$$;
