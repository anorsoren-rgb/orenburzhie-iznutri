import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGigaChatJSON } from "@/lib/gigachat/client";
import { EXPAND_SYSTEM, expandUserPrompt } from "@/lib/gigachat/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// ============================================
// СХЕМА ЗАПРОСА
// ============================================
const RequestSchema = z.object({
  input: z.string().min(10).max(1000),
  category: z.string().max(50).optional(),
});

// ============================================
// СХЕМА ОТВЕТА ОТ GIGACHAT
// ============================================
const ResponseSchema = z.object({
  short_desc: z.string().max(300),
  full_desc: z.string(),
  how_to_get: z.string().optional().default(""),
  tips: z.string().optional().default(""),
  warnings: z.string().optional().default(""),
  season: z.enum(["all", "winter", "spring", "summer", "autumn"]).default("all"),
  is_free: z.boolean().default(true),
  tags: z.array(z.string()).max(10).default([]),
});

// ============================================
// RATE LIMITING
// ============================================
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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
      {
        ok: false,
        error:
          "Слишком много запросов на улучшение. Подожди минуту.",
      },
      { status: 429 }
    );
  }

  // 2. Валидация входных данных
  let body: z.infer<typeof RequestSchema>;
  try {
    const json = await req.json();
    body = RequestSchema.parse(json);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  // 3. Запрос к GigaChat
  try {
    const raw = await askGigaChatJSON<unknown>(
      EXPAND_SYSTEM,
      expandUserPrompt(body.input, body.category)
    );

    // 4. Валидация ответа
    const parsed = ResponseSchema.safeParse(raw);

    if (!parsed.success) {
      console.error(
        "[gigachat/expand] Невалидный ответ:",
        JSON.stringify(raw).slice(0, 500),
        parsed.error.issues
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "ИИ вернул неполный ответ. Попробуй ещё раз или дополни описание.",
        },
        { status: 502 }
      );
    }

    const duration = Date.now() - started;

    // 5. Логируем
    try {
      const supabase = await createClient();
      await supabase.from("gigachat_logs").insert({
        scenario: "expand",
        prompt: body.input,
        response: JSON.stringify(parsed.data).slice(0, 5000),
        duration_ms: duration,
      });
    } catch {
      // не критично
    }

    return NextResponse.json({
      ok: true,
      data: parsed.data,
      duration_ms: duration,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[gigachat/expand]", message);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось улучшить текст. Проверь соединение и попробуй ещё раз.",
      },
      { status: 500 }
    );
  }
}
