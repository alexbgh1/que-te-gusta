import { GeistSans } from "geist/font/sans";
import "./globals.css";

import Header from "@/components/header";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Qué te gusta?",
  description: "Una aplicación para guardar los gustos de tus amigos y familiares",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <body className="sticky top-0 bg-background text-foreground">
        <Header />
        <main className="flex flex-col items-center">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
