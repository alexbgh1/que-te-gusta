"use server";

import { createClient } from "@/utils/supabase/server";

import { Category } from "@/types/custom";
/*
 *  Categorías
 */

// [GET] Obtener categorías
export async function getCategories() {
  const supabase = createClient();

  const resCategories = await supabase.from("preferencecategory").select(`id, category`);
  const categories: Category[] | null = resCategories.data;
  const categoriesError = resCategories.error;

  return { categories, categoriesError };
}
