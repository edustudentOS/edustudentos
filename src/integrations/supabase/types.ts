export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      hr_questions: {
        Row: {
          answer: string | null
          category: string
          created_at: string
          created_by: string
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer?: string | null
          category?: string
          created_at?: string
          created_by: string
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string | null
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_courses: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_paid: boolean
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_paid?: boolean
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_lessons: {
        Row: {
          assignment: string | null
          course_id: string
          created_at: string
          id: string
          notes_url: string | null
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          assignment?: string | null
          course_id: string
          created_at?: string
          id?: string
          notes_url?: string | null
          order_index?: number
          title: string
          video_url?: string | null
        }
        Update: {
          assignment?: string | null
          course_id?: string
          created_at?: string
          id?: string
          notes_url?: string | null
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_uploads: {
        Row: {
          branch: string
          college: string
          created_at: string
          downloads: number | null
          file_url: string | null
          id: string
          rejection_reason: string | null
          semester: string
          status: Database["public"]["Enums"]["upload_status"]
          subject: string
          title: string
          type: Database["public"]["Enums"]["note_type"]
          updated_at: string
          uploader_id: string
        }
        Insert: {
          branch: string
          college: string
          created_at?: string
          downloads?: number | null
          file_url?: string | null
          id?: string
          rejection_reason?: string | null
          semester: string
          status?: Database["public"]["Enums"]["upload_status"]
          subject: string
          title: string
          type?: Database["public"]["Enums"]["note_type"]
          updated_at?: string
          uploader_id: string
        }
        Update: {
          branch?: string
          college?: string
          created_at?: string
          downloads?: number | null
          file_url?: string | null
          id?: string
          rejection_reason?: string | null
          semester?: string
          status?: Database["public"]["Enums"]["upload_status"]
          subject?: string
          title?: string
          type?: Database["public"]["Enums"]["note_type"]
          updated_at?: string
          uploader_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string | null
          career_goal: string | null
          college: string | null
          created_at: string
          display_name: string | null
          id: string
          is_banned: boolean
          language: string | null
          onboarding_completed: boolean | null
          overall_progress: number | null
          quality_score: number
          semester: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          branch?: string | null
          career_goal?: string | null
          college?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_banned?: boolean
          language?: string | null
          onboarding_completed?: boolean | null
          overall_progress?: number | null
          quality_score?: number
          semester?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          branch?: string | null
          career_goal?: string | null
          college?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_banned?: boolean
          language?: string | null
          onboarding_completed?: boolean | null
          overall_progress?: number | null
          quality_score?: number
          semester?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          difficulty: string
          explanation: string | null
          id: string
          interview_qa: Json | null
          is_published: boolean
          template_code_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by: string
          description?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          interview_qa?: Json | null
          is_published?: boolean
          template_code_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          interview_qa?: Json | null
          is_published?: boolean
          template_code_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resume_templates: {
        Row: {
          created_at: string
          created_by: string
          file_url: string | null
          format_type: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          file_url?: string | null
          format_type?: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          file_url?: string | null
          format_type?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      roadmap_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          roadmap_id: string
          step_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          roadmap_id: string
          step_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          roadmap_id?: string
          step_id?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_projects: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          id: string
          order_index: number
          roadmap_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          order_index?: number
          roadmap_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          order_index?: number
          roadmap_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_projects_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_skills: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_index: number
          roadmap_id: string
          skill_name: string
          tools: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          roadmap_id: string
          skill_name: string
          tools?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          roadmap_id?: string
          skill_name?: string
          tools?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_skills_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          duration: string | null
          id: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by: string
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          progress: number | null
          roadmap_id: string
          skill_name: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          roadmap_id: string
          skill_name: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          roadmap_id?: string
          skill_name?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_upload: { Args: { _upload_id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reject_upload: {
        Args: { _reason: string; _upload_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      note_type: "notes" | "pyq" | "syllabus"
      upload_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      note_type: ["notes", "pyq", "syllabus"],
      upload_status: ["pending", "approved", "rejected"],
    },
  },
} as const
