import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profilesRes, uploadsRes, pendingRes, approvedRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("notes_uploads").select("id", { count: "exact", head: true }),
        supabase.from("notes_uploads").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("notes_uploads").select("id", { count: "exact", head: true }).eq("status", "approved"),
      ]);

      return {
        totalUsers: profilesRes.count ?? 0,
        totalUploads: uploadsRes.count ?? 0,
        pendingApprovals: pendingRes.count ?? 0,
        approvedNotes: approvedRes.count ?? 0,
      };
    },
  });
}

export function useAdminUsers(search?: string) {
  return useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (search && search.trim()) {
        // Escape LIKE special characters to prevent wildcard injection
        const escapedSearch = search
          .replace(/\\/g, '\\\\')
          .replace(/%/g, '\\%')
          .replace(/_/g, '\\_')
          .trim()
          .slice(0, 100); // Limit length
        query = query.or(
          `display_name.ilike.%${escapedSearch}%,college.ilike.%${escapedSearch}%,branch.ilike.%${escapedSearch}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, ban }: { userId: string; ban: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: ban })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function usePendingUploads() {
  return useQuery({
    queryKey: ["admin-pending-uploads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes_uploads")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllUploads(statusFilter?: string) {
  return useQuery({
    queryKey: ["admin-all-uploads", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("notes_uploads")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as "pending" | "approved" | "rejected");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useApproveUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uploadId: string) => {
      const { error } = await supabase.rpc('approve_upload', {
        _upload_id: uploadId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useRejectUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uploadId, reason }: { uploadId: string; reason: string }) => {
      const { error } = await supabase.rpc('reject_upload', {
        _upload_id: uploadId,
        _reason: reason,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uploadId: string) => {
      const { error } = await supabase
        .from("notes_uploads")
        .delete()
        .eq("id", uploadId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
