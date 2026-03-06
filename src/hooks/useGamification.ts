import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";

export interface GamificationProfile {
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export interface BadgeDefinition {
  id: string;
  badge_key: string;
  title: string;
  description: string | null;
  icon: string;
  xp_reward: number;
  condition_type: string;
  condition_value: number | null;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge_definitions: BadgeDefinition;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  college: string | null;
  branch: string | null;
  xp: number;
  level: number;
  current_streak: number;
  badge_count: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  target_route: string | null;
  xp_reward: number;
  is_completed: boolean;
  completed_at: string | null;
}

// XP needed for next level: level^2 * 50
export function xpForLevel(level: number) {
  return (level - 1) * (level - 1) * 50;
}

export function xpForNextLevel(level: number) {
  return level * level * 50;
}

export function useGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const streakUpdated = useRef(false);

  // Gamification profile
  const { data: gamProfile } = useQuery({
    queryKey: ["gamification-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gamification_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as GamificationProfile | null) ?? { xp: 0, level: 1, current_streak: 0, longest_streak: 0, last_active_date: null };
    },
    enabled: !!user,
  });

  // Update streak on login (once per session)
  useEffect(() => {
    if (!user || streakUpdated.current) return;
    streakUpdated.current = true;
    supabase.rpc("update_streak", { _user_id: user.id }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["gamification-profile", user.id] });
    });
  }, [user, queryClient]);

  // User badges
  const { data: userBadges } = useQuery({
    queryKey: ["user-badges", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("*, badge_definitions(*)")
        .eq("user_id", user!.id)
        .order("earned_at", { ascending: false });
      if (error) throw error;
      return data as unknown as UserBadge[];
    },
    enabled: !!user,
  });

  // All badge definitions
  const { data: allBadges } = useQuery({
    queryKey: ["badge-definitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badge_definitions")
        .select("*")
        .order("condition_value");
      if (error) throw error;
      return data as BadgeDefinition[];
    },
    enabled: !!user,
  });

  // Daily tasks
  const { data: dailyTasks } = useQuery({
    queryKey: ["daily-tasks", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", user!.id)
        .eq("task_date", today)
        .order("created_at");
      if (error) throw error;
      return data as DailyTask[];
    },
    enabled: !!user,
  });

  // Leaderboard
  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .limit(20);
      if (error) throw error;
      return data as LeaderboardEntry[];
    },
    enabled: !!user,
  });

  // Complete daily task mutation
  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const task = dailyTasks?.find(t => t.id === taskId);
      if (!task) return;

      // Mark task complete
      const { error } = await supabase
        .from("daily_tasks")
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq("id", taskId);
      if (error) throw error;

      // Award XP
      await supabase.rpc("award_xp", { _user_id: user!.id, _amount: task.xp_reward });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["gamification-profile", user?.id] });
    },
  });

  // Generate daily tasks (called if none exist for today)
  const generateDailyTasks = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];

      // Check if tasks already exist
      const { data: existing } = await supabase
        .from("daily_tasks")
        .select("id")
        .eq("user_id", user.id)
        .eq("task_date", today)
        .limit(1);

      if (existing && existing.length > 0) return;

      // Get user profile for personalization
      const { data: profile } = await supabase
        .from("profiles")
        .select("career_goal")
        .eq("user_id", user.id)
        .single();

      const careerGoal = profile?.career_goal || "Web Developer";

      // Generate personalized tasks based on career goal
      const taskTemplates = [
        { title: "Complete a learning lesson", description: `Stay on track with your ${careerGoal} journey`, task_type: "learning", target_route: "/learning", xp_reward: 15 },
        { title: "Review your roadmap progress", description: "Check what skills to focus on next", task_type: "roadmap", target_route: "/roadmaps", xp_reward: 10 },
        { title: "Browse study notes", description: "Find helpful resources from peers", task_type: "notes", target_route: "/notes", xp_reward: 10 },
        { title: "Practice interview questions", description: "Prepare for your future interviews", task_type: "interview", target_route: "/interview", xp_reward: 15 },
        { title: "Update your resume", description: "Keep your resume ready for opportunities", task_type: "resume", target_route: "/resume", xp_reward: 20 },
      ];

      // Pick 3 random tasks
      const shuffled = taskTemplates.sort(() => 0.5 - Math.random()).slice(0, 3);

      const tasks = shuffled.map(t => ({
        user_id: user.id,
        task_date: today,
        ...t,
      }));

      const { error } = await supabase.from("daily_tasks").insert(tasks);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks", user?.id] });
    },
  });

  // Auto-generate tasks if none exist
  useEffect(() => {
    if (user && dailyTasks !== undefined && dailyTasks.length === 0) {
      generateDailyTasks.mutate();
    }
  }, [user, dailyTasks]);

  return {
    gamProfile: gamProfile ?? { xp: 0, level: 1, current_streak: 0, longest_streak: 0, last_active_date: null },
    userBadges: userBadges ?? [],
    allBadges: allBadges ?? [],
    dailyTasks: dailyTasks ?? [],
    leaderboard: leaderboard ?? [],
    completeTask,
    xpProgress: gamProfile ? ((gamProfile.xp - xpForLevel(gamProfile.level)) / (xpForNextLevel(gamProfile.level) - xpForLevel(gamProfile.level))) * 100 : 0,
  };
}
