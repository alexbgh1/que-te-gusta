import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "./supabase";

export type Contact = Database["public"]["Tables"]["usercontacts"]["Row"];
export type Preference = Database["public"]["Tables"]["preferences"]["Row"];
export type Category = Database["public"]["Tables"]["preferencecategory"]["Row"];

export interface ContactListProps {
  id: number;
  name: string;
  preferences: PreferenceProps[];
}
[];

export interface PreferenceProps {
  id: number;
  keyword: string;
  preferencecategory: {
    category: string;
  };
}

export interface PlainContactListProps {
  id: number;
  name: string;
  preferences: PlainPreference[];
}

export interface PlainPreference {
  id: number;
  keyword: string;
  category: string;
}
