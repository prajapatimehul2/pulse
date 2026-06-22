import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { goalSchema } from "@/lib/validation";

// GET /api/goals -> the signed-in user's per-habit daily targets
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({ goals });
}

// PUT /api/goals -> upsert a single habit's target
export async function PUT(req: Request) {
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

  const parsed = goalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { type, target, unit } = parsed.data;
  const goal = await prisma.goal.upsert({
    where: { userId_type: { userId: session.user.id, type } },
    update: { target, unit },
    create: { userId: session.user.id, type, target, unit },
  });

  return NextResponse.json({ goal });
}
