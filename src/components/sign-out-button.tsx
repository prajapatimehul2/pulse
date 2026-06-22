"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}
