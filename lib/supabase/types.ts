// Database type definitions for the Supabase generic client.
// Format matches supabase CLI codegen output so query-builder inference works.
// Keep in sync with supabase/migrations/.

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          status: string;
          next: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status: string;
          next?: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: string;
          next?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          title: string;
          detail: string;
          time_label: string;
          type: string;
          project_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          detail?: string;
          time_label?: string;
          type?: string;
          project_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          detail?: string;
          time_label?: string;
          type?: string;
          project_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          title: string;
          preview: string;
          project_id: string;
          updated_label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          preview: string;
          project_id: string;
          updated_label?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          preview?: string;
          project_id?: string;
          updated_label?: string;
          created_at?: string;
        };
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
