import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCourses() {
  return useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_courses")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useLessons(courseId: string | null) {
  return useQuery({
    queryKey: ["admin-lessons", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_lessons")
        .select("*")
        .eq("course_id", courseId!)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (data: { title: string; description: string; category: string; is_paid: boolean }) => {
      const { error } = await supabase.from("learning_courses").insert({
        ...data,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  });
}

export function useTogglePublishCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("learning_courses").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("learning_courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  });
}

export function useAddLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { course_id: string; title: string; video_url: string; notes_url: string; assignment: string; order_index: number }) => {
      const { error } = await supabase.from("learning_lessons").insert(data);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["admin-lessons", vars.course_id] }),
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, course_id }: { id: string; course_id: string }) => {
      const { error } = await supabase.from("learning_lessons").delete().eq("id", id);
      if (error) throw error;
      return course_id;
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ["admin-lessons", vars.course_id] }),
  });
}
