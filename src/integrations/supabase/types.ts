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
      columns_profiled: {
        Row: {
          column_index: number
          column_name: string
          confidence_level: string
          created_at: string
          distinct_count: number | null
          id: string
          import_run_id: string
          null_percentage: number | null
          pattern_analysis: Json | null
          sample_values: Json | null
          suggested_type: string
        }
        Insert: {
          column_index: number
          column_name: string
          confidence_level: string
          created_at?: string
          distinct_count?: number | null
          id?: string
          import_run_id: string
          null_percentage?: number | null
          pattern_analysis?: Json | null
          sample_values?: Json | null
          suggested_type: string
        }
        Update: {
          column_index?: number
          column_name?: string
          confidence_level?: string
          created_at?: string
          distinct_count?: number | null
          id?: string
          import_run_id?: string
          null_percentage?: number | null
          pattern_analysis?: Json | null
          sample_values?: Json | null
          suggested_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "columns_profiled_import_run_id_fkey"
            columns: ["import_run_id"]
            isOneToOne: false
            referencedRelation: "import_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      dataset_versions: {
        Row: {
          activated_at: string | null
          created_at: string
          created_by: string | null
          dataset_id: string
          file_size_bytes: number | null
          id: string
          is_active: boolean | null
          row_count: number | null
          schema_hash: string | null
          version_number: number
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          created_by?: string | null
          dataset_id: string
          file_size_bytes?: number | null
          id?: string
          is_active?: boolean | null
          row_count?: number | null
          schema_hash?: string | null
          version_number: number
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          created_by?: string | null
          dataset_id?: string
          file_size_bytes?: number | null
          id?: string
          is_active?: boolean | null
          row_count?: number | null
          schema_hash?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "dataset_versions_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          custom_category_label: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          custom_category_label?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          custom_category_label?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      dq_issues: {
        Row: {
          column_name: string
          created_at: string
          fix_suggestion: string | null
          id: string
          import_run_id: string
          issue_description: string
          row_number: number
          rule_type: string
          sample_value: string | null
          severity: string
        }
        Insert: {
          column_name: string
          created_at?: string
          fix_suggestion?: string | null
          id?: string
          import_run_id: string
          issue_description: string
          row_number: number
          rule_type: string
          sample_value?: string | null
          severity: string
        }
        Update: {
          column_name?: string
          created_at?: string
          fix_suggestion?: string | null
          id?: string
          import_run_id?: string
          issue_description?: string
          row_number?: number
          rule_type?: string
          sample_value?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "dq_issues_import_run_id_fkey"
            columns: ["import_run_id"]
            isOneToOne: false
            referencedRelation: "import_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      import_runs: {
        Row: {
          completed_at: string | null
          dataset_id: string
          delimiter: string | null
          encoding: string | null
          error_count: number | null
          error_message: string | null
          file_name: string
          file_path: string | null
          file_size_bytes: number | null
          header_row: number | null
          id: string
          import_mode: string
          inserted_rows: number | null
          new_version_id: string | null
          processed_rows: number | null
          skipped_rows: number | null
          started_at: string
          started_by: string | null
          status: string
          target_version_id: string | null
          total_rows: number | null
          updated_rows: number | null
          validation_passed: boolean | null
        }
        Insert: {
          completed_at?: string | null
          dataset_id: string
          delimiter?: string | null
          encoding?: string | null
          error_count?: number | null
          error_message?: string | null
          file_name: string
          file_path?: string | null
          file_size_bytes?: number | null
          header_row?: number | null
          id?: string
          import_mode: string
          inserted_rows?: number | null
          new_version_id?: string | null
          processed_rows?: number | null
          skipped_rows?: number | null
          started_at?: string
          started_by?: string | null
          status?: string
          target_version_id?: string | null
          total_rows?: number | null
          updated_rows?: number | null
          validation_passed?: boolean | null
        }
        Update: {
          completed_at?: string | null
          dataset_id?: string
          delimiter?: string | null
          encoding?: string | null
          error_count?: number | null
          error_message?: string | null
          file_name?: string
          file_path?: string | null
          file_size_bytes?: number | null
          header_row?: number | null
          id?: string
          import_mode?: string
          inserted_rows?: number | null
          new_version_id?: string | null
          processed_rows?: number | null
          skipped_rows?: number | null
          started_at?: string
          started_by?: string | null
          status?: string
          target_version_id?: string | null
          total_rows?: number | null
          updated_rows?: number | null
          validation_passed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "import_runs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_runs_new_version_id_fkey"
            columns: ["new_version_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_runs_target_version_id_fkey"
            columns: ["target_version_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      mappings: {
        Row: {
          confidence_score: number | null
          coverage_percentage: number | null
          created_at: string
          id: string
          import_run_id: string
          is_manual_override: boolean | null
          role: string
          source_column: string
          target_column: string | null
          target_dataset_id: string | null
          transforms: Json | null
        }
        Insert: {
          confidence_score?: number | null
          coverage_percentage?: number | null
          created_at?: string
          id?: string
          import_run_id: string
          is_manual_override?: boolean | null
          role: string
          source_column: string
          target_column?: string | null
          target_dataset_id?: string | null
          transforms?: Json | null
        }
        Update: {
          confidence_score?: number | null
          coverage_percentage?: number | null
          created_at?: string
          id?: string
          import_run_id?: string
          is_manual_override?: boolean | null
          role?: string
          source_column?: string
          target_column?: string | null
          target_dataset_id?: string | null
          transforms?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mappings_import_run_id_fkey"
            columns: ["import_run_id"]
            isOneToOne: false
            referencedRelation: "import_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappings_target_dataset_id_fkey"
            columns: ["target_dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      relations: {
        Row: {
          cardinality: string | null
          coverage_percentage: number | null
          created_at: string
          id: string
          is_active: boolean | null
          source_column: string
          source_dataset_id: string
          target_column: string
          target_dataset_id: string
        }
        Insert: {
          cardinality?: string | null
          coverage_percentage?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          source_column: string
          source_dataset_id: string
          target_column: string
          target_dataset_id: string
        }
        Update: {
          cardinality?: string | null
          coverage_percentage?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          source_column?: string
          source_dataset_id?: string
          target_column?: string
          target_dataset_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relations_source_dataset_id_fkey"
            columns: ["source_dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relations_target_dataset_id_fkey"
            columns: ["target_dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_rules: {
        Row: {
          column_name: string
          created_at: string
          created_by: string | null
          dataset_id: string
          id: string
          is_enabled: boolean | null
          rule_config: Json
          rule_type: string
          severity: string
        }
        Insert: {
          column_name: string
          created_at?: string
          created_by?: string | null
          dataset_id: string
          id?: string
          is_enabled?: boolean | null
          rule_config: Json
          rule_type: string
          severity?: string
        }
        Update: {
          column_name?: string
          created_at?: string
          created_by?: string | null
          dataset_id?: string
          id?: string
          is_enabled?: boolean | null
          rule_config?: Json
          rule_type?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_rules_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
