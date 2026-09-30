import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { askGigaChatJSON } from "@/lib/gigachat/client";
import { MODERATE_SYSTEM, moderateUserPrompt } from "@/lib/gigachat/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  placeId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "admin" && role !== "moderator") {
      return NextResponse.json(
        { ok: false, error: "Недостаточно прав" },
        { status: 403 }
      );
    }

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Некорректный запрос" },
        { status: 400 }
      );
    }

    const rows = await sql<{ title: string; short_desc: string | null; full_desc: string | null }[]>`
      SELECT title, short_desc, full_desc
      FROM places
      WHERE id = ${parsed.data.placeId}
      LIMIT 1
    `;

    const place = rows[0];
    if (!place) {
      return NextResponse.json(
        { ok: false, error: "Место не найдено" },
        { status: 404 }
      );
    }

    const text = [
      `Название: ${place.title}`,
      place.short_desc ? `Кратко: ${place.short_desc}` : "",
      place.full_desc ? `Описание: ${place.full_desc}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const result = await askGigaChatJSON<{
      status: "ok" | "warn" | "reject";
      reason: string;
      fixed_text?: string;
    }>(MODERATE_SYSTEM, moderateUserPrompt(text));

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[gigachat/moderate]", err);
    return NextResponse.json(
      { ok: false, error: "Ошибка проверки GigaChat" },
      { status: 500 }
    );
  }
}