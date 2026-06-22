import { describe, it, expect } from "vitest";
import { computeStreak, totalsByDay, dayKey, lastNDays } from "./habits";

const at = (daysAgo: number, value: number) => {
  const d = new Date("2026-06-22T09:00:00");
  d.setDate(d.getDate() - daysAgo);
  return { value, loggedAt: d };
};

describe("computeStreak", () => {
  const today = new Date("2026-06-22T12:00:00");

  it("counts consecutive met days back from today", () => {
    const totals = totalsByDay([at(0, 2000), at(1, 2100), at(2, 2500)]);
    expect(computeStreak(totals, 2000, today)).toBe(3);
  });

  it("does not break the streak when today is still incomplete", () => {
    // Today below target, but the previous two days met it.
    const totals = totalsByDay([at(0, 500), at(1, 2100), at(2, 2500)]);
    expect(computeStreak(totals, 2000, today)).toBe(2);
  });

  it("returns 0 when neither today nor yesterday met the target", () => {
    const totals = totalsByDay([at(0, 100), at(1, 100)]);
    expect(computeStreak(totals, 2000, today)).toBe(0);
  });

  it("stops at the first missed day", () => {
    const totals = totalsByDay([at(0, 2000), at(1, 2000), at(3, 2000)]);
    expect(computeStreak(totals, 2000, today)).toBe(2); // day 2 missed
  });
});

describe("totalsByDay", () => {
  it("sums multiple entries on the same day", () => {
    const totals = totalsByDay([at(0, 250), at(0, 250), at(0, 500)]);
    expect(totals.get(dayKey(new Date("2026-06-22T00:00:00")))).toBe(1000);
  });
});

describe("lastNDays", () => {
  it("returns N keys ending today, oldest first", () => {
    const days = lastNDays(7, new Date("2026-06-22T00:00:00"));
    expect(days).toHaveLength(7);
    expect(days[6]).toBe("2026-06-22");
    expect(days[0]).toBe("2026-06-16");
  });
});
