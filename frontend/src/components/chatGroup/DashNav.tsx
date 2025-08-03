"use client";
import React from "react";
import ProfileMenu from "../auth/ProfileMenu";
import Link from "next/link";
import { Button } from "../ui/button";

export default function DashNav({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  return (
    <nav className="py-2 px-6 flex justify-between items-center bg-background text-foreground shadow-sm">
      <h1 className="text-xl md:text-2xl font-extrabold">Cloak-Room</h1>
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
        <ProfileMenu name={name} image={image} />
      </div>
    </nav>
  );
}
