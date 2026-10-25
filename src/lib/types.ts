/** Tipos de dominio usados por la interfaz. */

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
}

export interface Category extends CategorySummary {
  description: string;
}

export interface CategoryWithCount extends Category {
  destinationCount: number;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageLicense: string;
  imageSourceUrl: string;
  highlights: string[];
  featured: boolean;
  category: CategorySummary | null;
}

/**
 * Tipos de la base de datos con el formato que espera supabase-js.
 * Equivalen a lo que generaría `supabase gen types typescript`.
 */
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      destinations: {
        Row: {
          id: number;
          name: string;
          slug: string;
          summary: string;
          description: string;
          location: string;
          image_url: string;
          image_alt: string;
          image_credit: string;
          image_license: string;
          image_source_url: string;
          highlights: string[];
          category_id: number;
          featured: boolean;
          published: boolean;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [
          {
            foreignKeyName: "destinations_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
