import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="p-6 bg-gray-900 text-white">
      <div className="flex justify-between">
        <div>
          <div>© 2025 Cloak-Room. All rights reserved.</div>
          <div className="space-x-4 mt-2">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Your Valuable Feedback"
            className="bg-gray-800 border-none"
          />
          <Button asChild>
  <a href="https://github.com/ojaswi2c9t" target="_blank" rel="noopener noreferrer">
    View Ojaswi Gahoi's GitHub
  </a>
</Button>
<br></br>
<Button asChild>
  <a href="https://github.com/madhuramkulshrestha123" target="_blank" rel="noopener noreferrer">
    View Madhuram Kulshrestha's GitHub
  </a>
</Button>
        </div>
      </div>
    </footer>
  );
}
