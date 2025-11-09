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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          course_name: string
          id: string
          issued_at: string | null
          user_id: string | null
        }
        Insert: {
          certificate_number: string
          course_id: string
          course_name: string
          id?: string
          issued_at?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_number?: string
          course_id?: string
          course_name?: string
          id?: string
          issued_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_modules: number[] | null
          course_id: string
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completed_modules?: number[] | null
          course_id: string
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completed_modules?: number[] | null
          course_id?: string
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_id: string
          created_at: string | null
          description: string
          difficulty: string
          duration: string
          id: string
          modules: Json
          skills: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description: string
          difficulty: string
          duration: string
          id?: string
          modules?: Json
          skills?: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          duration?: string
          id?: string
          modules?: Json
          skills?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          availability: string
          cover_letter: string
          created_at: string
          id: string
          job_id: string
          job_title: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          availability: string
          cover_letter: string
          created_at?: string
          id?: string
          job_id: string
          job_title: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          availability?: string
          cover_letter?: string
          created_at?: string
          id?: string
          job_id?: string
          job_title?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_jobs: {
        Row: {
          admin_notes: string | null
          benefit_points: number | null
          created_at: string | null
          description: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          media_type: string | null
          media_url: string | null
          payment_amount: number | null
          payment_sent: boolean | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
          work_type: string
        }
        Insert: {
          admin_notes?: string | null
          benefit_points?: number | null
          created_at?: string | null
          description: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          media_type?: string | null
          media_url?: string | null
          payment_amount?: number | null
          payment_sent?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
          work_type: string
        }
        Update: {
          admin_notes?: string | null
          benefit_points?: number | null
          created_at?: string | null
          description?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          media_type?: string | null
          media_url?: string | null
          payment_amount?: number | null
          payment_sent?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "micro_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_jobs_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          issued_at: string | null
          module_id: number
          module_name: string
          user_id: string | null
        }
        Insert: {
          certificate_number: string
          course_id: string
          id?: string
          issued_at?: string | null
          module_id: number
          module_name: string
          user_id?: string | null
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          issued_at?: string | null
          module_id?: number
          module_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_test_attempts: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          module_id: number
          passed: boolean
          percentage: number
          score: number
          total_questions: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          module_id: number
          passed: boolean
          percentage: number
          score: number
          total_questions: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          module_id?: number
          passed?: boolean
          percentage?: number
          score?: number
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_test_questions: {
        Row: {
          correct_answer: number
          course_id: string
          created_at: string | null
          id: string
          module_id: number
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          course_id: string
          created_at?: string | null
          id?: string
          module_id: number
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          course_id?: string
          created_at?: string | null
          id?: string
          module_id?: number
          options?: Json
          question?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          points: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          points?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          points?: number
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          passed: boolean
          percentage: number
          score: number
          total_questions: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          passed: boolean
          percentage: number
          score: number
          total_questions: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          passed?: boolean
          percentage?: number
          score?: number
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          correct_answer: number
          course_id: string
          created_at: string | null
          id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          course_id: string
          created_at?: string | null
          id?: string
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          course_id?: string
          created_at?: string | null
          id?: string
          options?: Json
          question?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          course_id: string
          earned_at: string | null
          id: string
          skill_name: string
          user_id: string | null
        }
        Insert: {
          course_id: string
          earned_at?: string | null
          id?: string
          skill_name: string
          user_id?: string | null
        }
        Update: {
          course_id?: string
          earned_at?: string | null
          id?: string
          skill_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          admin_notes: string | null
          amount_pkr: number
          created_at: string | null
          id: string
          payment_details: Json | null
          payment_method: string | null
          points_withdrawn: number
          processed_at: string | null
          processed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount_pkr: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          points_withdrawn: number
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount_pkr?: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          points_withdrawn?: number
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_user_points: {
        Args: { p_points: number; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
