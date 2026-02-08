import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminUsers, useBanUser } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Ban, CheckCircle, Loader2, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useAdminUsers(search);
  const banMutation = useBanUser();
  const { toast } = useToast();

  const handleBan = async (userId: string, currentBan: boolean) => {
    try {
      await banMutation.mutateAsync({ userId, ban: !currentBan });
      toast({
        title: currentBan ? "User unbanned" : "User banned",
        description: currentBan
          ? "User can now access the platform"
          : "User has been banned from the platform",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Search and manage all registered users</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, college, or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border/50 shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">
                        {user.display_name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.college || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.branch || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.semester || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (user.quality_score ?? 0) >= 3
                          ? "default"
                          : (user.quality_score ?? 0) < 0
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {user.quality_score ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="outline" className="text-success border-success/30">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={user.is_banned ? "outline" : "destructive"}
                      onClick={() => handleBan(user.user_id, user.is_banned ?? false)}
                      disabled={banMutation.isPending}
                      className="gap-1.5"
                    >
                      {banMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : user.is_banned ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> Unban
                        </>
                      ) : (
                        <>
                          <Ban className="h-3 w-3" /> Ban
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
