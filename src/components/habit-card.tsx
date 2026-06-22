"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { HabitType } from "@prisma/client";
import { Flame, Plus, Check, Loader2 } from "lucide-react";
import { HABITS } from "@/lib/habits";
import { ProgressRing } from "@/components/progress-ring";

type Props = {
  type: HabitType;
  todayTotal: number;
  target: number;
  streak: number;
};

export function HabitCard({ type, todayTotal, target, streak }: Props) {
  const meta = HABITS[type];
  const Icon = meta.icon;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [custom, setCustom] = useState("");

  const progress = target > 0 ? todayTotal / target : 0;
  const met = todayTotal >= target;

  async function addLog(value: number) {
    if (!value || value <= 0) return;
    setBusy(true);
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value, unit: meta.unit }),
      });
      setCustom("");
      // Re-render the server component so totals/streaks update.
      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  const loading = busy || pending;

  return (
    <div className="card flex flex-col gap-4 p-5 transition hover:border-border/80">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${meta.color}`} />
          <span className="font-semibold">{meta.label}</span>
        </div>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2/60 px-2 py-0.5 text-xs text-muted">
            <Flame className="h-3 w-3 text-accent-fuchsia" />
            {streak}d
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ProgressRing progress={progress} color={meta.accentHex}>
          {met ? (
            <Check className="h-6 w-6" style={{ color: meta.accentHex }} />
          ) : (
            <span className="text-sm font-semibold">
              {Math.round(progress * 100)}%
            </span>
          )}
        </ProgressRing>
        <div>
          <div className="text-2xl font-bold tabular-nums">
            {formatVal(todayTotal)}
            <span className="ml-1 text-sm font-normal text-muted">
              / {formatVal(target)} {meta.unit}
            </span>
          </div>
          <div className="text-xs text-muted">today</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => addLog(meta.quickAdd)}
          disabled={loading}
          className="btn-primary flex-1 text-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {meta.quickAdd} {meta.unit}
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addLog(Number(custom));
          }}
          className="flex items-center gap-1"
        >
          <input
            type="number"
            step="any"
            min="0"
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="custom"
            className="input w-20 px-2 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !custom}
            className="btn-ghost px-3 py-2 text-sm"
            aria-label={`Add custom ${meta.label}`}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

function formatVal(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}
