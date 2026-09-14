import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGigaChat } from "@/lib/gigachat/client";
import { CHAT_SYSTEM, chatUserPrompt } from "@/lib/gigachat/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

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

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
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

async function findContext(question: string): Promise<string[]> {
  try {
    const supabase = await createClient();

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

export async function POST(req: NextRequest) {
  const started = Date.now();

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

  let body: z.infer<typeof BodySchema>;
  try {
    const json = await req.json();
    body = BodySchema.parse(json);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  const { question } = body;
  const context = await findContext(question);

  try {
    const answer = await askGigaChat(
      CHAT_SYSTEM,
      chatUserPrompt(question, context)
    );

    const duration = Date.now() - started;

    try {
      const supabase = await createClient();
      await supabase.from("gigachat_logs").insert({
        scenario: "chat",
        prompt: question,
        response: answer,
        duration_ms: duration,
      });
    } catch {
      // не критично
    }

    return NextResponse.json({
      ok: true,
      answer,
      duration_ms: duration,
      context_used: context.length,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Не удалось получить ответ. Попробуй ещё раз через минуту.",
      },
      { status: 500 }
    );
  }
}
