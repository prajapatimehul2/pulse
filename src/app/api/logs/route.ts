import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logSchema } from "@/lib/validation";

// GET /api/logs?days=7  -> recent logs for the signed-in user
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.min(Math.max(Number(searchParams.get("days")) || 7, 1), 90);
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const logs = await prisma.habitLog.findMany({
    where: { userId: session.user.id, loggedAt: { gte: since } },
    orderBy: { loggedAt: "desc" },
  });

  return NextResponse.json({ logs });
}

// POST /api/logs  -> create a log entry
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = logSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { type, value, unit, loggedAt } = parsed.data;
  const log = await prisma.habitLog.create({
    data: {
      userId: session.user.id,
      type,
      value,
      unit,
      ...(loggedAt ? { loggedAt: new Date(loggedAt) } : {}),
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}
