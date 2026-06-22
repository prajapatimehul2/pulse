import { HabitType } from "@prisma/client";
import { Droplets, Moon, Dumbbell, Pill, type LucideIcon } from "lucide-react";

export type HabitMeta = {
  type: HabitType;
  label: string;
  unit: string;
  /** Default daily target if the user has no custom goal. */
  defaultTarget: number;
  /** Amount added by the one-tap quick-log button. */
  quickAdd: number;
  icon: LucideIcon;
  /** Tailwind text color token. */
  color: string;
  accentHex: string;
};

export const HABITS: Record<HabitType, HabitMeta> = {
  WATER: {
    type: HabitType.WATER,
    label: "Water",
    unit: "ml",
    defaultTarget: 2000,
    quickAdd: 250,
    icon: Droplets,
    color: "text-habit-water",
    accentHex: "#22d3ee",
  },
  SLEEP: {
    type: HabitType.SLEEP,
    label: "Sleep",
    unit: "h",
    defaultTarget: 8,
    quickAdd: 1,
    icon: Moon,
    color: "text-habit-sleep",
    accentHex: "#8b5cf6",
  },
  WORKOUT: {
    type: HabitType.WORKOUT,
    label: "Workout",
    unit: "session",
    defaultTarget: 1,
    quickAdd: 1,
    icon: Dumbbell,
    color: "text-habit-workout",
    accentHex: "#f59e0b",
  },
  MEDICATION: {
    type: HabitType.MEDICATION,
    label: "Medication",
    unit: "dose",
    defaultTarget: 1,
    quickAdd: 1,
    icon: Pill,
    color: "text-habit-medication",
    accentHex: "#34d399",
  },
};

export const HABIT_TYPES = Object.keys(HABITS) as HabitType[];

/** Local YYYY-MM-DD key for grouping logs by calendar day. */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Streak = number of consecutive days (counting back from today) where the
 * summed value for a habit met or exceeded its target. Today is allowed to be
 * incomplete: if today is not yet met, the streak counts back from yesterday.
 */
export function computeStreak(
  dailyTotals: Map<string, number>,
  target: number,
  today = new Date(),
): number {
  let streak = 0;
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  // Allow an unfinished "today" not to break an existing streak.
  const todayKey = dayKey(cursor);
  const todayMet = (dailyTotals.get(todayKey) ?? 0) >= target;
  if (!todayMet) cursor.setDate(cursor.getDate() - 1);

  while (true) {
    const key = dayKey(cursor);
    if ((dailyTotals.get(key) ?? 0) >= target) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** Sum log values per calendar day. */
export function totalsByDay(
  logs: { value: number; loggedAt: Date }[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const log of logs) {
    const key = dayKey(new Date(log.loggedAt));
    map.set(key, (map.get(key) ?? 0) + log.value);
  }
  return map;
}

/** Last `days` day-keys oldest→newest, including today. */
export function lastNDays(days: number, today = new Date()): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}
