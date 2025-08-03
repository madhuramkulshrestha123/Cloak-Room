import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SessionProvider from "@/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/Providers"; // 👈 Import Theme Provider

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "QuickChat",
  description: "Quick Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider>
          <Providers> {/* 👈 Wrap children in ThemeProvider */}
            {children}
            <Toaster richColors duration={5000} />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
