import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HabitType } from "@prisma/client";

// Phase 6 (optional extension). The model is live; this route lets the future
// settings UI manage per-habit reminder times.

const reminderSchema = z.object({
  type: z.nativeEnum(HabitType),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm"),
  enabled: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reminders = await prisma.reminder.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({ reminders });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = reminderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const reminder = await prisma.reminder.create({
    data: {
      userId: session.user.id,
      type: parsed.data.type,
      time: parsed.data.time,
      enabled: parsed.data.enabled ?? true,
    },
  });
  return NextResponse.json({ reminder }, { status: 201 });
}
