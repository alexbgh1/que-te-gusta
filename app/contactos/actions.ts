"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ContactListProps, Preference } from "@/types/custom";

/**
 *
 * Contactos
 *
 */

// [GET] Obtener contactos
export async function getContacts() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Consultar contactos asociados al usuario actual
  const resContactsAndPreferences = await supabase
    .from("usercontacts")
    .select(
      `
  id,
  name,
  preferences (
    id,
    keyword,
    preferencecategory (
      category
    )
  )
`
    )
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  const contacts: ContactListProps[] | null = resContactsAndPreferences.data;
  const contactsError = resContactsAndPreferences.error;

  return { contacts, contactsError };
}

// [POST] Agregar contacto
export async function addContact(name: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("El usuario no está autenticado");
  }

  const { data, error } = await supabase.from("usercontacts").insert({ name, user_id: user.id }).select();

  if (error) {
    console.log(error);
    throw new Error("Error al agregar el contacto");
  }

  revalidatePath("/contactos");
  return data[0];
}

// [DELETE] Eliminar contacto
export async function deleteContact(contactId: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("El usuario no está autenticado");
  }

  const { error } = await supabase.from("usercontacts").delete().match({ id: contactId });

  if (error) {
    console.log(error);
    throw new Error("Error al eliminar el contacto");
  }

  revalidatePath("/contactos");
}

// [PUT] Actualizar contacto
export async function updateContact(contactId: number, name: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("El usuario no está autenticado");
  }

  const { error } = await supabase.from("usercontacts").update({ name }).match({ id: contactId });

  if (error) {
    console.log(error);
    throw new Error("Error al actualizar el contacto");
  }

  revalidatePath("/contactos");
}

/**
 *
 * Preferencias del Contacto
 *
 */

// [POST] Agregar preferencia
export async function addPreference(contactId: number, category: number, keyword: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("El usuario no está autenticado");
  }
  const { data, error } = await supabase
    .from("preferences")
    .insert({ contact_id: contactId, category_id: category, keyword })
    .select();

  if (error) {
    console.log(error);
    throw new Error("Error al agregar la preferencia");
  }

  revalidatePath("/contactos");
  return data[0];
}

// [DELETE] Eliminar preferencia
export async function deletePreference(preferenceId: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("El usuario no está autenticado");
  }

  const { error } = await supabase.from("preferences").delete().match({ id: preferenceId });

  if (error) {
    throw new Error("Error al eliminar la preferencia");
  }

  revalidatePath("/contactos");
}

// [PUT] Actualizar preferencia
export async function updatePreference(preference: Preference) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("El usuario no está autenticado");
  }

  const { error } = await supabase
    .from("preferences")
    .update({ keyword: preference.keyword, category_id: preference.category_id })
    .match({ id: preference.id });

  if (error) {
    throw new Error("Error actualizando la preferencia");
  }

  revalidatePath("/contactos");
}
