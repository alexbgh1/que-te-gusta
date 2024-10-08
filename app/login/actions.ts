"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { getURL } from "@/utils/helpers";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function oAuthSignIn(provider: Provider) {
  if (!provider) {
    return redirect("/login?message=No se proporcionó un proveedor de inicio de sesión");
  }

  const supabase = createClient();
  const redirectUrl = getURL("/auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    redirect("/login?message=Error al iniciar sesión con el proveedor");
  }

  return redirect(data.url);
}
