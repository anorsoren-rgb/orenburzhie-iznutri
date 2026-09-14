import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGigaChatJSON } from "@/lib/gigachat/client";
import { ROUTE_SYSTEM, routeUserPrompt } from "@/lib/gigachat/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// ============================================
// СХЕМА ЗАПРОСА
// ============================================
const RequestSchema = z.object({
  place_ids: z.array(z.string().uuid()).min(2).max(6),
});

// ============================================
// СХЕМА ОТВЕТА
// ============================================
const StepSchema = z.object({
  place_index: z.number().int().min(0),
  arrival: z.string(),
  duration_min: z.number().int().min(5).max(600),
  activity: z.string(),
  tips: z.string().optional().default(""),
});

const ResponseSchema = z.object({
  title: z.string().max(120),
  description: z.string(),
  duration_min: z.number().int().min(30).max(1440),
  budget_rub: z.number().int().min(0),
  transport: z.enum(["car", "walk", "bike", "mixed"]),
  steps: z.array(StepSchema).min(2),
  overall_tips: z.string().default(""),
});

// ============================================
// RATE LIMITING
// ============================================
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // маршрутов в минуту
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (entry.resetAt < now) rateLimit.delete(ip);
  }
}, 5 * 60_000);

// ============================================
// ОБРАБОТЧИК
// ============================================
export async function POST(req: NextRequest) {
  const started = Date.now();

  // 1. Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много запросов. Подожди минуту." },
      { status: 429 }
    );
  }

  // 2. Валидация
  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Нужно выбрать от 2 до 6 мест" },
      { status: 400 }
    );
  }

  // 3. Загружаем места из БД
  const supabase = await createClient();
  const { data: places, error: placesError } = await supabase
    .from("places")
    .select("id, slug, title, short_desc, full_desc, lat, lng")
    .in("id", body.place_ids)
    .eq("status", "published");

  if (placesError || !places || places.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Не удалось загрузить места" },
      { status: 400 }
    );
  }

  // 4. Спрашиваем GigaChat
  try {
    const raw = await askGigaChatJSON<unknown>(
      ROUTE_SYSTEM,
      routeUserPrompt(
        places.map((p) => ({
          title: p.title,
          description: p.short_desc ?? "",
        }))
      )
    );

    const parsed = ResponseSchema.safeParse(raw);

    if (!parsed.success) {
      console.error(
        "[route-builder] Невалидный ответ:",
        JSON.stringify(raw).slice(0, 500),
        parsed.error.issues
      );
      return NextResponse.json(
        { ok: false, error: "ИИ вернул неполный маршрут. Попробуй ещё раз." },
        { status: 502 }
      );
    }

    const duration = Date.now() - started;

    // 5. Логируем
    try {
      await supabase.from("gigachat_logs").insert({
        scenario: "route-builder",
        prompt: places.map((p) => p.title).join(" → "),
        response: JSON.stringify(parsed.data).slice(0, 5000),
        duration_ms: duration,
      });
    } catch {
      // не критично
    }

    return NextResponse.json({
      ok: true,
      data: parsed.data,
      places: places.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        lat: p.lat,
        lng: p.lng,
      })),
      duration_ms: duration,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[route-builder]", message);
    return NextResponse.json(
      { ok: false, error: "Не удалось собрать маршрут. Попробуй ещё раз." },
      { status: 500 }
    );
  }
}