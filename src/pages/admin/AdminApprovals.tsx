import { useState } from "react";
import { motion } from "framer-motion";
import { usePendingUploads, useApproveUpload, useRejectUpload, useDeleteUpload } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Trash2, Eye, Loader2, FileText, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminApprovals = () => {
  const { data: uploads, isLoading } = usePendingUploads();
  const approveMutation = useApproveUpload();
  const rejectMutation = useRejectUpload();
  const deleteMutation = useDeleteUpload();
  const { toast } = useToast();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast({ title: "Approved!", description: "File has been approved and is now visible to users." });
    } catch {
      toast({ title: "Error", description: "Failed to approve file", variant: "destructive" });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ uploadId: rejectId, reason: rejectReason });
      toast({ title: "Rejected", description: "File has been rejected. Quality score updated." });
      setRejectDialogOpen(false);
      setRejectReason("");
      setRejectId(null);
    } catch {
      toast({ title: "Error", description: "Failed to reject file", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Deleted", description: "File has been permanently deleted." });
    } catch {
      toast({ title: "Error", description: "Failed to delete file", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground">Upload Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review, approve, or reject student-submitted files
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : uploads?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Inbox className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground">All caught up!</h3>
          <p className="text-muted-foreground mt-1">No files pending review</p>
        </motion.div>
      ) : (
        <div className="bg-card rounded-lg border border-border/50 shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads?.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent shrink-0" />
                      <span className="font-medium text-foreground truncate max-w-[200px]">
                        {upload.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{upload.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{upload.college}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {upload.type === "pyq" ? "PYQ" : upload.type.charAt(0).toUpperCase() + upload.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{upload.semester}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(upload.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      {upload.file_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <a href={upload.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-success hover:text-success hover:bg-success/10"
                        onClick={() => handleApprove(upload.id)}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setRejectId(upload.id);
                          setRejectDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(upload.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Reject Upload</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection. This will be visible to the uploader and affects their quality score (-2).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              placeholder="e.g. Low quality scan, wrong subject..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
