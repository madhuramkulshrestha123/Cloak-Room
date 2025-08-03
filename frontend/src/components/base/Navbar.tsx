"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "../ui/button";
import LoginModal from "../auth/LoginModal";

export default function Navbar({ user }: { user: CustomUser | null }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ only true on client after hydration
  }, []);

  return (
    <nav className="p-6 flex justify-between items-center bg-background shadow-sm">
      <h1 className="text-xl md:text-2xl font-extrabold">Cloak-Room</h1>
      <div className="flex items-center space-x-2 md:space-x-6 text-foreground">
        <Link href="/">Home</Link>
        <Link href="#features">Features</Link>
        <Link href="#guide">Guide</Link>

        {/* Only render theme toggle after hydration to avoid mismatch */}
        {mounted && (
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        )}

        {!user ? (
          <LoginModal />
        ) : (
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
