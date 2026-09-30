import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "екорректные данные" },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const emailLower = email.toLowerCase().trim();

    const existing = await sql<{ id: string }[]>`
      SELECT id FROM profiles WHERE email = ${emailLower} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "ользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const rows = await sql<{ id: string }[]>`
      INSERT INTO profiles (email, password_hash, full_name, username, role)
      VALUES (
        ${emailLower},
        ${hash},
        ${name},
        ${emailLower.split("@")[0]},
        'user'
      )
      RETURNING id
    `;

    return NextResponse.json({ ok: true, userId: rows[0].id });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { ok: false, error: "шибка регистрации" },
      { status: 500 }
    );
  }
}
