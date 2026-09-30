import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

const Body = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(3).max(200),
  short_desc: z.string().min(10).max(500),
  full_desc: z.string().min(30).max(20000),
  how_to_get: z.string().max(2000).nullable(),
  tips: z.string().max(2000).nullable(),
  warnings: z.string().max(1000).nullable(),
  season: z.enum(["all", "winter", "spring", "summer", "autumn"]),
  is_free: z.boolean(),
  category_id: z.number().int().nullable(),
  cover_url: z.string().nullable(),
  gallery: z.array(z.string()),
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

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Не удалось определить пользователя" },
        { status: 401 }
      );
    }

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Некорректные данные формы" },
        { status: 400 }
      );
    }

    const d = parsed.data;

    const rows = await sql<{ id: string }[]>`
      INSERT INTO places (
        slug, title, short_desc, full_desc,
        how_to_get, tips, warnings,
        season, is_free, category_id,
        cover_url, gallery,
        author_id, status
      ) VALUES (
        ${d.slug}, ${d.title}, ${d.short_desc}, ${d.full_desc},
        ${d.how_to_get}, ${d.tips}, ${d.warnings},
        ${d.season}, ${d.is_free}, ${d.category_id},
        ${d.cover_url}, ${d.gallery},
        ${userId}, 'pending'
      )
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error("[places/create]", err);
    return NextResponse.json(
      { ok: false, error: "Ошибка сохранения" },
      { status: 500 }
    );
  }
}
