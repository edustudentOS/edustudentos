import { motion } from "framer-motion";
import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { RoadmapCard } from "@/components/RoadmapCard";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code2,
  FileText,
  Trophy,
  Upload,
  Search,
  FileUser,
  Globe,
  Database,
  Smartphone,
  Shield,
  Cloud,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickRoadmaps = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Master HTML, CSS, JavaScript, React and build production-ready web apps",
    icon: Globe,
    skillCount: 12,
    duration: "5-6 months",
    color: "#3b82f6",
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Learn Python, statistics, ML basics and data visualization",
    icon: Database,
    skillCount: 10,
    duration: "6-8 months",
    color: "#10b981",
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Build mobile apps with Flutter or React Native from scratch",
    icon: Smartphone,
    skillCount: 8,
    duration: "4-5 months",
    color: "#8b5cf6",
  },
];

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="gradient-hero rounded-xl p-6 md:p-8 text-accent-foreground"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-display font-bold mt-2"
            >
              Your Career Journey
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 opacity-80 text-sm md:text-base max-w-md"
            >
              From confused student → job-ready graduate. Track your progress, learn skills, and land your dream job.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex gap-3"
            >
              <Button variant="accent" size="sm" asChild>
                <Link to="/roadmaps">Explore Roadmaps</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-accent-foreground/90 hover:text-accent-foreground hover:bg-accent-foreground/10" asChild>
                <Link to="/notes">Browse Notes</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ProgressRing progress={27} size={140} label="Job Ready 🚀" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Skills Learning" value="3" subtitle="of 12 planned" icon={BookOpen} delay={0.1} />
        <StatCard title="Projects" value="1" subtitle="2 in progress" icon={Code2} delay={0.2} />
        <StatCard title="Notes Saved" value="15" subtitle="across 4 subjects" icon={FileText} delay={0.3} />
        <StatCard title="Achievements" value="5" subtitle="Keep going!" icon={Trophy} iconColor="text-warning" delay={0.4} />
      </div>

      {/* Roadmaps Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">Career Roadmaps</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Pick your path and start building</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/roadmaps">View all →</Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {quickRoadmaps.map((roadmap, i) => (
            <RoadmapCard key={roadmap.id} {...roadmap} delay={0.1 * (i + 1)} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-display font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Upload, label: "Upload Notes", to: "/notes", color: "text-info" },
            { icon: Search, label: "Browse PYQs", to: "/notes", color: "text-accent" },
            { icon: FileUser, label: "Build Resume", to: "/resume", color: "text-success" },
            { icon: Rocket, label: "Mock Interview", to: "/resume", color: "text-warning" },
          ].map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border/50 shadow-card hover:shadow-card-hover hover:border-accent/30 transition-all group"
              >
                <div className={`p-2.5 rounded-lg bg-muted ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
