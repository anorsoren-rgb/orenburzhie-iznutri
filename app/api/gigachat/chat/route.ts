import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGigaChat } from "@/lib/gigachat/client";
import { CHAT_SYSTEM, chatUserPrompt } from "@/lib/gigachat/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

// ============================================
// СХЕМА ВАЛИДАЦИИ
// ============================================
const BodySchema = z.object({
  question: z.string().min(2).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(10)
    .optional()
    .default([]),
});

// ============================================
// ПРОСТОЙ RATE LIMITING (в памяти)
// ============================================
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // запросов
const WINDOW_MS = 60_000; // в минуту

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Периодическая очистка карты (чтобы не текла память)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (entry.resetAt < now) rateLimit.delete(ip);
  }
}, 5 * 60_000);

// ============================================
// ПОИСК КОНТЕКСТА (пока — простой, потом RAG)
// ============================================
async function findContext(question: string): Promise<string[]> {
  try {
    const supabase = await createClient();

    // Ищем места и легенды по ключевым словам (ILIKE — простой поиск)
    const words = question
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 3);

    if (words.length === 0) return [];

    const orQuery = words.map((w) => `title.ilike.%${w}%`).join(",");

    const { data: places } = await supabase
      .from("places")
      .select("title, short_desc, full_desc")
      .eq("status", "published")
      .or(orQuery)
      .limit(3);

    return (places ?? []).map(
      (p) => `${p.title}\n${p.short_desc ?? ""}\n${p.full_desc ?? ""}`
    );
  } catch {
    return [];
  }
}

// ============================================
// ОСНОВНОЙ ОБРАБОТЧИК
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
        error: "Слишком много вопросов. Подожди минуту и попробуй снова.",
      },
      { status: 429 }
    );
  }

  // 2. Валидация входных данных
  let body: z.infer<typeof BodySchema>;
  try {
    const json = await req.json();
    body = BodySchema.parse(json);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  const { question } = body;

  // 3. Ищем контекст на сайте
  const context = await findContext(question);

  // 4. Спрашиваем GigaChat
  try {
    const answer = await askGigaChat(
      CHAT_SYSTEM,
      chatUserPrompt(question, context)
    );

    const duration = Date.now() - started;

    // 5. Логируем в БД (не блокируя ответ)
    try {
      const supabase = await createClient();
      await supabase.from("gigachat_logs").insert({
        scenario: "chat",
        prompt: question,
        response: answer,
        duration_ms: duration,
      });
    } catch {
      // Не критично, если лог не записался
    }

    return NextResponse.json({
      ok: true,
      answer,
      duration_ms: duration,
      context_used: context.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[gigachat/chat]", message);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось получить ответ. Попробуй ещё раз через минуту.",
      },
      { status: 500 }
    );
  }
}
