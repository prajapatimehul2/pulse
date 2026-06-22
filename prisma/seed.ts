import { PrismaClient, HabitType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Default daily targets used when a user has not customized their goals.
const DEFAULT_GOALS: { type: HabitType; target: number; unit: string }[] = [
  { type: HabitType.WATER, target: 2000, unit: "ml" },
  { type: HabitType.SLEEP, target: 8, unit: "h" },
  { type: HabitType.WORKOUT, target: 1, unit: "session" },
  { type: HabitType.MEDICATION, target: 1, unit: "dose" },
];

async function main() {
  const email = "demo@habit.dev";
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo User", passwordHash },
  });

  for (const g of DEFAULT_GOALS) {
    await prisma.goal.upsert({
      where: { userId_type: { userId: user.id, type: g.type } },
      update: { target: g.target, unit: g.unit },
      create: { userId: user.id, ...g },
    });
  }

  // Seed ~14 days of sample logs so trends/streaks render immediately.
  const now = new Date();
  for (let d = 0; d < 14; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() - d);
    day.setHours(9, 0, 0, 0);

    const entries = [
      { type: HabitType.WATER, value: 400 + ((d * 137) % 1800), unit: "ml" },
      { type: HabitType.SLEEP, value: 6 + ((d * 7) % 4) * 0.5, unit: "h" },
      ...(d % 3 !== 0
        ? [{ type: HabitType.WORKOUT, value: 1, unit: "session" }]
        : []),
      { type: HabitType.MEDICATION, value: 1, unit: "dose" },
    ];

    for (const e of entries) {
      await prisma.habitLog.create({
        data: { userId: user.id, loggedAt: day, ...e },
      });
    }
  }

  console.log(`Seeded demo user ${email} (password: password123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
