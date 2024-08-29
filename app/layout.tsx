import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Lato } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import RootProviders from "@/provider/root-provider";

import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Hofwams",
  description: "Created by hofwams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <SessionProvider>
          <RootProviders>{children}</RootProviders>
          <Toaster richColors position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
