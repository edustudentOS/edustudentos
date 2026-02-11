import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, CheckCircle2, Clock, XCircle, Eye, Inbox } from "lucide-react";
import { format } from "date-fns";
import UploadNoteDialog from "@/components/UploadNoteDialog";

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { icon: CheckCircle2, label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { icon: XCircle, label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const Uploads = () => {
  const { user } = useAuth();

  const { data: uploads, isLoading } = useQuery({
    queryKey: ["my-uploads", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notes_uploads")
        .select("*")
        .eq("uploader_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">My Uploads</h1>
          <p className="text-muted-foreground mt-1">Track your uploaded notes and their approval status</p>
        </div>
        <UploadNoteDialog />
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !uploads || uploads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Inbox className="h-14 w-14 text-muted-foreground/20 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-foreground">No uploads yet</h3>
          <p className="text-muted-foreground text-sm mt-1">Upload your first note to help fellow students!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {uploads.map((upload, i) => {
            const status = statusConfig[upload.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (i + 1) }}
                className="bg-card rounded-xl p-4 shadow-card border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-foreground text-sm truncate">{upload.title}</h3>
                      <Badge variant="outline" className={`shrink-0 text-[10px] ${status.className}`}>
                        <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span>{upload.subject}</span>
                      <span>•</span>
                      <span>{upload.semester}</span>
                      <span>•</span>
                      <span>{format(new Date(upload.created_at), "MMM d, yyyy")}</span>
                      {upload.downloads !== null && upload.downloads > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Eye className="h-2.5 w-2.5" /> {upload.downloads}
                          </span>
                        </>
                      )}
                    </div>
                    {upload.status === "rejected" && upload.rejection_reason && (
                      <div className="mt-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                        <p className="text-xs text-destructive">
                          <strong>Reason:</strong> {upload.rejection_reason}
                        </p>
                      </div>
                    )}
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

export default Uploads;
