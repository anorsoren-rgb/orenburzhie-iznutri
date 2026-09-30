import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

const Body = z.object({
  placeId: z.string().uuid(),
  action: z.enum(["publish", "reject"]),
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

    const { placeId, action } = parsed.data;
    const newStatus = action === "publish" ? "published" : "rejected";

    await sql`
      UPDATE places
      SET status = ${newStatus}, updated_at = NOW()
      WHERE id = ${placeId}
    `;

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (err) {
    console.error("[admin/moderate]", err);
    return NextResponse.json(
      { ok: false, error: "Ошибка модерации" },
      { status: 500 }
    );
  }
}