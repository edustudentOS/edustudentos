import { motion } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { useAdminStats } from "@/hooks/useAdmin";
import { Users, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of StudentOS platform
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          iconColor="text-info"
          delay={0.1}
        />
        <StatCard
          title="Total Uploads"
          value={stats?.totalUploads ?? 0}
          icon={FileText}
          iconColor="text-accent"
          delay={0.2}
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals ?? 0}
          subtitle={stats?.pendingApprovals ? "Action needed" : "All clear"}
          icon={Clock}
          iconColor="text-warning"
          delay={0.3}
        />
        <StatCard
          title="Approved Notes"
          value={stats?.approvedNotes ?? 0}
          icon={CheckCircle}
          iconColor="text-success"
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      {stats?.pendingApprovals ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-warning/10 border border-warning/30 rounded-lg p-5 flex items-center gap-4"
        >
          <AlertTriangle className="h-6 w-6 text-warning shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-foreground">
              {stats.pendingApprovals} file{stats.pendingApprovals > 1 ? "s" : ""} pending review
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Review and approve/reject student submissions
            </p>
          </div>
          <Button variant="accent" size="sm" asChild>
            <Link to="/admin/approvals">Review Now</Link>
          </Button>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link
          to="/admin/users"
          className="bg-card rounded-lg p-5 border border-border/50 shadow-card hover:shadow-card-hover transition-all group"
        >
          <Users className="h-6 w-6 text-info mb-3" />
          <h3 className="font-display font-semibold text-foreground">Manage Users</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Search, view profiles, ban/unban users
          </p>
        </Link>
        <Link
          to="/admin/approvals"
          className="bg-card rounded-lg p-5 border border-border/50 shadow-card hover:shadow-card-hover transition-all group"
        >
          <FileText className="h-6 w-6 text-accent mb-3" />
          <h3 className="font-display font-semibold text-foreground">Upload Approvals</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Approve, reject, or delete submitted files
          </p>
        </Link>
        <Link
          to="/admin/notes"
          className="bg-card rounded-lg p-5 border border-border/50 shadow-card hover:shadow-card-hover transition-all group"
        >
          <CheckCircle className="h-6 w-6 text-success mb-3" />
          <h3 className="font-display font-semibold text-foreground">Notes Manager</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all approved, pending, and rejected notes
          </p>
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
