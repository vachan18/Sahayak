export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          preferred_language: string;
          state: string | null;
          district: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          preferred_language?: string;
          state?: string | null;
          district?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          preferred_language?: string;
          state?: string | null;
          district?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      schemes: {
        Row: {
          id: string;
          scheme_code: string;
          name: string;
          description: string;
          department: string;
          category: string;
          state: string;
          official_url: string;
          eligibility_rules: Json;
          benefits: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scheme_code: string;
          name: string;
          description: string;
          department: string;
          category: string;
          state?: string;
          official_url: string;
          eligibility_rules?: Json;
          benefits?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scheme_code?: string;
          name?: string;
          description?: string;
          department?: string;
          category?: string;
          state?: string;
          official_url?: string;
          eligibility_rules?: Json;
          benefits?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          assessment_data: Json;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_data: Json;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_data?: Json;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      assessment_results: {
        Row: {
          id: string;
          assessment_id: string;
          scheme_id: string;
          eligibility_status: string;
          missing_information: Json;
          explanation: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          scheme_id: string;
          eligibility_status: string;
          missing_information?: Json;
          explanation?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          scheme_id?: string;
          eligibility_status?: string;
          missing_information?: Json;
          explanation?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey";
            columns: ["assessment_id"];
            isOneToOne: false;
            referencedRelation: "assessments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assessment_results_scheme_id_fkey";
            columns: ["scheme_id"];
            isOneToOne: false;
            referencedRelation: "schemes";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_schemes: {
        Row: {
          id: string;
          user_id: string;
          scheme_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scheme_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scheme_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_schemes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_schemes_scheme_id_fkey";
            columns: ["scheme_id"];
            isOneToOne: false;
            referencedRelation: "schemes";
            referencedColumns: ["id"];
          }
        ];
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          scheme_id: string;
          status: string;
          application_reference: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scheme_id: string;
          status?: string;
          application_reference?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scheme_id?: string;
          status?: string;
          application_reference?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_scheme_id_fkey";
            columns: ["scheme_id"];
            isOneToOne: false;
            referencedRelation: "schemes";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
