import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata.avatar_url;

  return (
    <header className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-2  lg:space-x-6">
          <a className="sm:mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Qué te gusta</span>
          </a>
          <Link href="/contactos">Contactos</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user !== null ? (
            <form action={signOut} className="flex items-center gap-2">
              <Link href="/contactos">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground">?</span>
                  </div>
                )}
              </Link>
              <Button>Salir</Button>
            </form>
          ) : (
            <Button asChild>
              <Link href="/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
