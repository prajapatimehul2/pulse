import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { HabitType } from "@prisma/client";
import {
  HABITS,
  HABIT_TYPES,
  totalsByDay,
  computeStreak,
  lastNDays,
  dayKey,
} from "@/lib/habits";
import { HabitCard } from "@/components/habit-card";
import { TrendChart, type TrendPoint } from "@/components/trend-chart";
import { Flame } from "lucide-react";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Server Component: fetch once, compute per-habit summaries + weekly series.
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");
  const userId = session.user.id;

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [logs, goals] = await Promise.all([
    prisma.habitLog.findMany({
      where: { userId, loggedAt: { gte: since } },
    }),
    prisma.goal.findMany({ where: { userId } }),
  ]);

  const targetFor = (type: HabitType) =>
    goals.find((g) => g.type === type)?.target ?? HABITS[type].defaultTarget;

  const todayKey = dayKey(new Date());
  const weekKeys = lastNDays(7);

  const summaries = HABIT_TYPES.map((type) => {
    const typeLogs = logs.filter((l) => l.type === type);
    const totals = totalsByDay(typeLogs);
    const target = targetFor(type);
    return {
      type,
      target,
      todayTotal: totals.get(todayKey) ?? 0,
      streak: computeStreak(totals, target),
      series: weekKeys.map<TrendPoint>((key) => ({
        day: WEEKDAY[new Date(`${key}T00:00:00`).getDay()],
        value: Math.round((totals.get(key) ?? 0) * 10) / 10,
      })),
    };
  });

  const bestStreak = Math.max(0, ...summaries.map((s) => s.streak));
  const goalsMetToday = summaries.filter((s) => s.todayTotal >= s.target).length;

  return (
    <div className="space-y-8">
      {/* Header / hero stats */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Hi {session.user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted">
          {goalsMetToday}/{HABIT_TYPES.length} goals met today
          {bestStreak > 0 && (
            <>
              {" · "}
              <span className="inline-flex items-center gap-1 text-foreground">
                <Flame className="h-4 w-4 text-accent-fuchsia" />
                {bestStreak}-day best streak
              </span>
            </>
          )}
        </p>
      </div>

      {/* Today — quick log cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaries.map((s) => (
          <HabitCard
            key={s.type}
            type={s.type}
            todayTotal={s.todayTotal}
            target={s.target}
            streak={s.streak}
          />
        ))}
      </section>

      {/* Weekly trends */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Weekly trends</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {summaries.map((s) => {
            const meta = HABITS[s.type];
            return (
              <div key={s.type} className="card p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <meta.icon className={`h-4 w-4 ${meta.color}`} />
                    <span className="font-medium">{meta.label}</span>
                  </div>
                  <span className="text-xs text-muted">last 7 days</span>
                </div>
                <TrendChart
                  data={s.series}
                  color={meta.accentHex}
                  target={s.target}
                  unit={meta.unit}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
