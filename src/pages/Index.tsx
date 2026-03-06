import { motion } from "framer-motion";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code2,
  FileText,
  Trophy,
  FileUser,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGamification } from "@/hooks/useGamification";
import { useRecommendations } from "@/hooks/useRecommendations";
import { XpBar } from "@/components/gamification/XpBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { DailyTasksWidget } from "@/components/gamification/DailyTasksWidget";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { LeaderboardWidget } from "@/components/gamification/LeaderboardWidget";
import { RecommendationsWidget } from "@/components/gamification/RecommendationsWidget";

const Dashboard = () => {
  const { user } = useAuth();
  const { gamProfile, userBadges, allBadges, dailyTasks, leaderboard, completeTask, xpProgress } = useGamification();
  const { data: recommendations } = useRecommendations();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: skillStats } = useQuery({
    queryKey: ["skill-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_progress")
        .select("id, progress, completed_at")
        .eq("user_id", user!.id);
      if (error) throw error;
      return { total: data?.length ?? 0, completed: data?.filter(s => s.completed_at !== null).length ?? 0 };
    },
    enabled: !!user,
  });

  const { data: roadmapStats } = useQuery({
    queryKey: ["roadmap-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_progress")
        .select("id, completed")
        .eq("user_id", user!.id);
      if (error) throw error;
      const total = data?.length ?? 0;
      const completed = data?.filter(r => r.completed).length ?? 0;
      return { total, completed, inProgress: total - completed };
    },
    enabled: !!user,
  });

  const { data: notesStats } = useQuery({
    queryKey: ["notes-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes_uploads")
        .select("id, status, subject")
        .eq("uploader_id", user!.id);
      if (error) throw error;
      return { total: data?.length ?? 0, approved: data?.filter(n => n.status === "approved").length ?? 0, subjects: new Set(data?.map(n => n.subject)).size };
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Student";
  const careerGoal = profile?.career_goal || "Not set yet";
  const readiness = profile?.overall_progress ?? 0;
  const skillsLearning = skillStats?.total ?? 0;
  const skillsCompleted = skillStats?.completed ?? 0;
  const projectsCompleted = roadmapStats?.completed ?? 0;
  const projectsInProgress = roadmapStats?.inProgress ?? 0;
  const notesSaved = notesStats?.total ?? 0;
  const notesSubjects = notesStats?.subjects ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero with XP & Streak */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-hero rounded-2xl p-6 md:p-8 text-accent-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium opacity-80">Welcome back 👋</span>
              <StreakBadge streak={gamProfile.current_streak} />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl md:text-3xl font-display font-extrabold mt-1">
              Hi {displayName}!
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-2 flex items-center gap-2">
              <span className="text-sm opacity-80">🎯 Career Goal:</span>
              <Badge className="bg-accent-foreground/15 text-accent-foreground border-0 font-medium">{careerGoal}</Badge>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-3">
              <XpBar xp={gamProfile.xp} level={gamProfile.level} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4 flex gap-3">
              <Button variant="accent" size="sm" asChild>
                <Link to="/roadmaps">Explore Roadmaps</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-accent-foreground/80 hover:text-accent-foreground hover:bg-accent-foreground/10" asChild>
                <Link to="/learning">Continue Learning</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <ProgressRing progress={readiness} size={130} label="Job Ready 🚀" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-display font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: "Continue Learning", to: "/learning", color: "text-primary bg-primary/10" },
            { icon: FileText, label: "Browse Notes", to: "/notes", color: "text-accent bg-accent/10" },
            { icon: FileUser, label: "Build Resume", to: "/resume", color: "text-success bg-success/10" },
            { icon: Rocket, label: "Interview Prep", to: "/interview", color: "text-warning bg-warning/10" },
          ].map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.05 }}>
              <Link to={action.to} className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all group">
                <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Tasks + Recommendations (2 columns on desktop) */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <DailyTasksWidget tasks={dailyTasks} completeTask={completeTask} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <RecommendationsWidget recommendations={recommendations ?? []} />
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: "Skills Learning", value: String(skillsLearning), sub: `${skillsCompleted} completed`, icon: BookOpen, color: "text-primary" },
          { title: "Roadmap Steps", value: String(projectsCompleted), sub: `${projectsInProgress} in progress`, icon: Code2, color: "text-accent" },
          { title: "Notes Uploaded", value: String(notesSaved), sub: `across ${notesSubjects} subject${notesSubjects !== 1 ? "s" : ""}`, icon: FileText, color: "text-info" },
          { title: "Achievements", value: String(userBadges.length), sub: `of ${allBadges.length} badges`, icon: Trophy, color: "text-warning" },
        ].map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.05 }} className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground font-medium">{stat.title}</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Badges + Leaderboard */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
            <h3 className="font-display font-bold text-foreground text-sm mb-3">🏅 Badges</h3>
            <BadgeGrid allBadges={allBadges} earnedBadges={userBadges} compact />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <LeaderboardWidget entries={leaderboard} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
