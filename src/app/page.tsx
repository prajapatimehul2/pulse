import Link from "next/link";
import { ArrowRight, Droplets, Moon, Dumbbell, Pill, Flame } from "lucide-react";

const FEATURES = [
  { icon: Droplets, title: "Hydration", desc: "One-tap water logging in 250ml sips.", color: "text-habit-water" },
  { icon: Moon, title: "Sleep", desc: "Track hours and protect your rest streak.", color: "text-habit-sleep" },
  { icon: Dumbbell, title: "Workouts", desc: "Log sessions and keep the momentum.", color: "text-habit-workout" },
  { icon: Pill, title: "Medication", desc: "Never miss a dose with daily checks.", color: "text-habit-medication" },
];

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      {/* Nav */}
      <nav className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient font-bold">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="text-sm text-muted transition hover:text-foreground">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center py-20 text-center md:py-28">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
          <Flame className="h-3.5 w-3.5 text-accent-fuchsia" /> Build streaks that stick
        </span>
        <h1 className="max-w-3xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-bold leading-[1.1] tracking-tight text-transparent md:text-6xl">
          Your daily health, in one calm dashboard
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Log water, sleep, workouts, and medication in seconds. Watch your
          streaks grow and spot weekly trends at a glance.
        </p>
        <div className="mt-9 flex items-center gap-3">
          <Link href="/signup" className="btn-primary">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/signin" className="btn-ghost">
            I have an account
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="card animate-fade-up p-5">
            <f.icon className={`h-7 w-7 ${f.color}`} />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto border-t border-border py-6 text-center text-sm text-muted">
        Pulse — Health &amp; Habit Tracker
      </footer>
    </main>
  );
}
