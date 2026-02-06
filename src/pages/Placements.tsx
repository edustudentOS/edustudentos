import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  MapPin,
  BookOpen,
  Shield,
} from "lucide-react";

const onCampusSteps = [
  "Register on your college's placement portal",
  "Update your resume and get it reviewed",
  "Practice aptitude tests (Quant, Verbal, Logical)",
  "Prepare technical topics based on your branch",
  "Practice HR questions with mock interviews",
  "Keep formal clothes ready",
  "Research companies visiting your campus",
];

const offCampusStrategies = [
  "Apply on LinkedIn, Naukri, Indeed regularly",
  "Build a strong GitHub profile with projects",
  "Network with alumni on LinkedIn",
  "Attend hackathons and coding contests",
  "Apply to startup incubators and accelerators",
  "Follow company career pages directly",
  "Contribute to open-source projects",
];

const platforms = [
  { name: "LinkedIn", url: "linkedin.com", type: "Jobs + Network" },
  { name: "Internshala", url: "internshala.com", type: "Internships" },
  { name: "Naukri", url: "naukri.com", type: "Jobs" },
  { name: "AngelList", url: "angel.co", type: "Startup Jobs" },
  { name: "LeetCode", url: "leetcode.com", type: "Practice" },
  { name: "HackerRank", url: "hackerrank.com", type: "Practice + Jobs" },
  { name: "GeeksforGeeks", url: "geeksforgeeks.org", type: "Learning + Jobs" },
  { name: "Unstop", url: "unstop.com", type: "Competitions" },
];

const scamAlerts = [
  "Never pay money for a job or internship",
  "Verify company email domains (not Gmail/Yahoo)",
  "Research company on LinkedIn before applying",
  "Be cautious of 'work from home' with upfront fees",
  "Don't share personal documents before verification",
];

const Placements = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Placement & Internship Guide
        </h1>
        <p className="text-muted-foreground mt-1">
          Practical guidance for on-campus, off-campus placements and internship hunting
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* On-Campus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-5 shadow-card border border-border/50"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-primary" /> On-Campus Process
          </h2>
          <div className="space-y-3">
            {onCampusSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Off-Campus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-5 shadow-card border border-border/50"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-accent" /> Off-Campus Strategy
          </h2>
          <div className="space-y-3">
            {offCampusStrategies.map((strategy, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{strategy}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-5 shadow-card border border-border/50"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-info" /> Recommended Platforms
          </h2>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{platform.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{platform.url}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{platform.type}</Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scam Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl p-5 shadow-card border border-destructive/20"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-destructive" /> Scam Alerts ⚠️
          </h2>
          <div className="space-y-3">
            {scamAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{alert}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
            <p className="text-xs text-muted-foreground">
              <strong className="text-destructive">Remember:</strong> Legitimate companies never ask for money during the hiring process.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Placements;
