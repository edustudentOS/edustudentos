import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useRoadmaps() {
  return useQuery({
    queryKey: ["admin-roadmaps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useRoadmapSkills(roadmapId: string | null) {
  return useQuery({
    queryKey: ["admin-roadmap-skills", roadmapId],
    enabled: !!roadmapId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_skills")
        .select("*")
        .eq("roadmap_id", roadmapId!)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useRoadmapProjects(roadmapId: string | null) {
  return useQuery({
    queryKey: ["admin-roadmap-projects", roadmapId],
    enabled: !!roadmapId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_projects")
        .select("*")
        .eq("roadmap_id", roadmapId!)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { title: string; description: string; category: string; duration: string }) => {
      const { error } = await supabase.from("roadmaps").insert({
        ...data,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-roadmaps"] }),
  });
}

export function useTogglePublishRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("roadmaps").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-roadmaps"] }),
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("roadmaps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-roadmaps"] }),
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { roadmap_id: string; skill_name: string; description: string; tools: string; order_index: number }) => {
      const { error } = await supabase.from("roadmap_skills").insert(data);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["admin-roadmap-skills", vars.roadmap_id] }),
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, roadmap_id }: { id: string; roadmap_id: string }) => {
      const { error } = await supabase.from("roadmap_skills").delete().eq("id", id);
      if (error) throw error;
      return roadmap_id;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["admin-roadmap-skills", vars.roadmap_id] }),
  });
}

export function useAddProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { roadmap_id: string; title: string; description: string; difficulty: string; order_index: number }) => {
      const { error } = await supabase.from("roadmap_projects").insert(data);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["admin-roadmap-projects", vars.roadmap_id] }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, roadmap_id }: { id: string; roadmap_id: string }) => {
      const { error } = await supabase.from("roadmap_projects").delete().eq("id", id);
      if (error) throw error;
      return roadmap_id;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["admin-roadmap-projects", vars.roadmap_id] }),
  });
}
