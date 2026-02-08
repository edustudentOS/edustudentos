import { motion } from "framer-motion";
import { Shield, Users, Activity, Key } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Admin roles, security, and platform configuration</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: Shield,
            title: "Admin Roles & Security",
            desc: "Super Admin, Content Manager, Moderator roles, 2FA, IP block — coming soon.",
            color: "text-info",
          },
          {
            icon: Users,
            title: "Role Management",
            desc: "Assign and manage admin roles for team members.",
            color: "text-accent",
          },
          {
            icon: Activity,
            title: "Activity Log",
            desc: "View login history and audit trail of admin actions.",
            color: "text-success",
          },
          {
            icon: Key,
            title: "API & Integrations",
            desc: "Manage API keys and third-party integrations.",
            color: "text-warning",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-lg border border-border/50 p-5 shadow-card"
          >
            <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
            <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;
