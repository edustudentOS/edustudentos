import { motion } from "framer-motion";
import { useAdminStats } from "@/hooks/useAdmin";
import { StatCard } from "@/components/StatCard";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

const AdminAnalytics = () => {
  const { data: stats } = useAdminStats();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform usage and growth metrics</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} iconColor="text-info" delay={0.1} />
        <StatCard title="Total Uploads" value={stats?.totalUploads ?? 0} icon={FileText} iconColor="text-accent" delay={0.2} />
        <StatCard title="Pending" value={stats?.pendingApprovals ?? 0} icon={Clock} iconColor="text-warning" delay={0.3} />
        <StatCard title="Approved" value={stats?.approvedNotes ?? 0} icon={CheckCircle} iconColor="text-success" delay={0.4} />
      </div>

      <div className="bg-card rounded-lg border border-border/50 p-8 text-center">
        <p className="text-muted-foreground">
          Detailed analytics with charts, daily/monthly users, top colleges, conversion rates, and CSV export — coming soon.
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
