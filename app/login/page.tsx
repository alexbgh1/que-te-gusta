import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OAuthButtons } from "./oauth-signin";

export default async function Login({ searchParams }: { searchParams: { message: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/contactos");
  }

  return (
    <section className="h-[calc(100vh-57px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Incio de sesión</CardTitle>
          <CardDescription>Ingresa a tu cuenta con algún proveedor</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <OAuthButtons />
        </CardContent>
      </Card>
    </section>
  );
}
