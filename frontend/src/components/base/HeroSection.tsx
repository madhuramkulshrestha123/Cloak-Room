import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background transition-colors">
      <h1 className="text-5xl font-extrabold text-foreground mb-4">
        Instant Chat Links for Seamless Conversations
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        CloakRoom makes it effortless to create secure chat links and start
        conversations in seconds.
      </p>
      <Link href="/dashboard">
        <Button size="lg" className="animate-pulse">
          Start Chatting
        </Button>
      </Link>

      <div className="mt-12 w-full max-w-5xl flex justify-center">
        <img
          src="/images/conversation.svg"
          alt="Illustration"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
