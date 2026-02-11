import { motion } from "framer-motion";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code2,
  FileText,
  Trophy,
  Upload,
  Search,
  FileUser,
  Rocket,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const todayTasks = [
  { text: "Complete React Basics", time: "15 min", done: false },
  { text: "Review CSS Flexbox notes", time: "10 min", done: true },
  { text: "Practice 2 LeetCode Easy", time: "30 min", done: false },
];

const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Student";
  const careerGoal = profile?.career_goal || "Not set yet";
  const readiness = profile?.overall_progress ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Greeting Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-hero rounded-2xl p-6 md:p-8 text-accent-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium opacity-80"
            >
              Welcome back 👋
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-display font-extrabold mt-1"
            >
              Hi {displayName}!
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 flex items-center gap-2"
            >
              <span className="text-sm opacity-80">🎯 Career Goal:</span>
              <Badge className="bg-accent-foreground/15 text-accent-foreground border-0 font-medium">
                {careerGoal}
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex gap-3"
            >
              <Button variant="accent" size="sm" asChild>
                <Link to="/roadmaps">Explore Roadmaps</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-accent-foreground/80 hover:text-accent-foreground hover:bg-accent-foreground/10" asChild>
                <Link to="/learning">Continue Learning</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ProgressRing progress={readiness} size={130} label="Job Ready 🚀" />
          </motion.div>
        </div>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            📅 Today's Tasks
          </h2>
          <span className="text-xs text-muted-foreground">{todayTasks.filter(t => t.done).length}/{todayTasks.length} done</span>
        </div>
        <div className="space-y-2">
          {todayTasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                task.done
                  ? "bg-success/5 border-success/20"
                  : "bg-card border-border/50 shadow-card"
              }`}
            >
              {task.done ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
              )}
              <span className={`flex-1 text-sm font-medium ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {task.text}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {task.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-display font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: "Continue Learning", to: "/learning", color: "text-primary bg-primary/10" },
            { icon: FileText, label: "Browse Notes", to: "/notes", color: "text-accent bg-accent/10" },
            { icon: FileUser, label: "Build Resume", to: "/resume", color: "text-success bg-success/10" },
            { icon: Rocket, label: "Interview Prep", to: "/interview", color: "text-warning bg-warning/10" },
          ].map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all group"
              >
                <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { title: "Skills Learning", value: "3", sub: "of 12 planned", icon: BookOpen, color: "text-primary" },
          { title: "Projects", value: "1", sub: "2 in progress", icon: Code2, color: "text-accent" },
          { title: "Notes Saved", value: "15", sub: "across 4 subjects", icon: FileText, color: "text-info" },
          { title: "Achievements", value: "5", sub: "Keep going!", icon: Trophy, color: "text-warning" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.05 }}
            className="bg-card rounded-xl p-4 shadow-card border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground font-medium">{stat.title}</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
