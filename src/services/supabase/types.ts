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
      hike_enrollments: {
        Row: {
          enrolled_at: string
          hike_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          enrolled_at?: string
          hike_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          enrolled_at?: string
          hike_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hike_enrollments_hike_id_fkey"
            columns: ["hike_id"]
            isOneToOne: false
            referencedRelation: "hikes"
            referencedColumns: ["id"]
          },
        ]
      }
      hike_images: {
        Row: {
          created_at: string
          display_order: number
          hike_id: string
          id: string
          image_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          hike_id: string
          id?: string
          image_url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          hike_id?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "hike_images_hike_id_fkey"
            columns: ["hike_id"]
            isOneToOne: false
            referencedRelation: "hikes"
            referencedColumns: ["id"]
          },
        ]
      }
      hikes: {
        Row: {
          created_at: string
          date: string
          description: string | null
          difficulty: string
          distance: number
          duration: string
          elevation: number
          end_date: string | null
          id: string
          image_url: string | null
          location_lat: number
          location_lng: number
          location_name: string
          max_participants: number
          name: string
          organizer_id: string | null
          organizer_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          difficulty: string
          distance: number
          duration: string
          elevation: number
          end_date?: string | null
          id?: string
          image_url?: string | null
          location_lat: number
          location_lng: number
          location_name: string
          max_participants?: number
          name: string
          organizer_id?: string | null
          organizer_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          difficulty?: string
          distance?: number
          duration?: string
          elevation?: number
          end_date?: string | null
          id?: string
          image_url?: string | null
          location_lat?: number
          location_lng?: number
          location_name?: string
          max_participants?: number
          name?: string
          organizer_id?: string | null
          organizer_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waypoints: {
        Row: {
          created_at: string
          day_number: number | null
          hike_id: string
          id: string
          latitude: number
          longitude: number
          name: string
          type: Database["public"]["Enums"]["waypoint_type"]
        }
        Insert: {
          created_at?: string
          day_number?: number | null
          hike_id: string
          id?: string
          latitude: number
          longitude: number
          name: string
          type: Database["public"]["Enums"]["waypoint_type"]
        }
        Update: {
          created_at?: string
          day_number?: number | null
          hike_id?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          type?: Database["public"]["Enums"]["waypoint_type"]
        }
        Relationships: [
          {
            foreignKeyName: "waypoints_hike_id_fkey"
            columns: ["hike_id"]
            isOneToOne: false
            referencedRelation: "hikes"
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
      check_email_exists: {
        Args: {
          email_check: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      waypoint_type: "start" | "end" | "overnight_stop"
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
      waypoint_type: ["start", "end", "overnight_stop"],
    },
  },
} as const
