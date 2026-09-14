import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  table: z.enum(["places", "legends", "events"]),
  id: z.string().uuid(),
  action: z.enum(["publish", "reject"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // 1. Проверяем, что пользователь — админ
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Не авторизован" },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Доступ запрещён. Только для админов." },
      { status: 403 }
    );
  }

  // 2. Валидация входных данных
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  // 3. Меняем статус
  const newStatus = body.action === "publish" ? "published" : "rejected";

  const { error } = await supabase
    .from(body.table)
    .update({ status: newStatus })
    .eq("id", body.id);

  if (error) {
    console.error("[admin/moderate]", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, newStatus });
}
