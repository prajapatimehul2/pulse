import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validation";
import { HABITS, HABIT_TYPES } from "@/lib/habits";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Create the user with sensible default goals so the dashboard works day one.
  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      goals: {
        create: HABIT_TYPES.map((t) => ({
          type: t,
          target: HABITS[t].defaultTarget,
          unit: HABITS[t].unit,
        })),
      },
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
