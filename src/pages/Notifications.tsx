import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Megaphone, AlertTriangle, Info, BellOff } from "lucide-react";
import { format } from "date-fns";

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  notification: { icon: Bell, color: "text-primary bg-primary/10" },
  announcement: { icon: Megaphone, color: "text-accent bg-accent/10" },
  alert: { icon: AlertTriangle, color: "text-warning bg-warning/10" },
  info: { icon: Info, color: "text-info bg-info/10" },
};

const Notifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated with the latest announcements</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BellOff className="h-14 w-14 text-muted-foreground/20 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-foreground">No notifications</h3>
          <p className="text-muted-foreground text-sm mt-1">You're all caught up!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.notification;
            const TypeIcon = config.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (i + 1) }}
                className="bg-card rounded-xl p-4 shadow-card border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${config.color} shrink-0`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-foreground text-sm">{notif.title}</h3>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {format(new Date(notif.created_at), "MMM d")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
