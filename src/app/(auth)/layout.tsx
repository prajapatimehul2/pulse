import Link from "next/link";
import { Flame, Droplets, Moon, Dumbbell } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (virlo-style gradient) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-accent-gradient p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,0,0,0)_0%,rgba(10,10,15,0.45)_100%)]" />
        <Link href="/" className="relative flex items-center gap-2 text-white">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 font-bold backdrop-blur">
            P
          </div>
          <span className="text-lg font-semibold">Pulse</span>
        </Link>
        <div className="relative">
          <Flame className="h-10 w-10 text-white/90" />
          <h2 className="mt-4 max-w-sm text-3xl font-bold leading-tight text-white">
            Small habits, logged daily, become streaks worth keeping.
          </h2>
          <div className="mt-8 flex gap-3 text-white/80">
            <Droplets className="h-6 w-6" />
            <Moon className="h-6 w-6" />
            <Dumbbell className="h-6 w-6" />
          </div>
        </div>
        <p className="relative text-sm text-white/60">
          © Pulse — Health &amp; Habit Tracker
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
      </div>
    </div>
  );
}
