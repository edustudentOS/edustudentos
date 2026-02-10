import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export async function getSignedUrl(fileUrl: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("get-signed-url", {
    body: { filePath: fileUrl },
  });
  if (error || !data?.signedUrl) throw new Error("Failed to get download URL");
  return data.signedUrl;
}

export type NoteUpload = Tables<"notes_uploads">;
export type NoteInsert = TablesInsert<"notes_uploads">;

export function useApprovedNotes(filters?: {
  type?: string;
  semester?: string;
}) {
  return useQuery({
    queryKey: ["notes", filters],
    queryFn: async () => {
      let query = supabase
        .from("notes_uploads")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (filters?.type && filters.type !== "all") {
        query = query.eq("type", filters.type as "notes" | "pyq" | "syllabus");
      }
      if (filters?.semester && filters.semester !== "all") {
        query = query.eq("semester", filters.semester);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as NoteUpload[];
    },
  });
}

export function useUploadNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      metadata,
    }: {
      file: File;
      metadata: Omit<NoteInsert, "uploader_id" | "file_url">;
    }) => {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("You must be logged in to upload notes.");

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("notes-files")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("notes-files")
        .getPublicUrl(filePath);

      // Insert record
      const { data, error: insertError } = await supabase
        .from("notes_uploads")
        .insert({
          ...metadata,
          uploader_id: user.id,
          file_url: urlData.publicUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5,
  });
}
