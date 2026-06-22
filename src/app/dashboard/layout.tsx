import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-canvas/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent-gradient text-sm font-bold">
              P
            </div>
            <span className="font-semibold tracking-tight">Pulse</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:block">
              {session.user.name ?? session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
