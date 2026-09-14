import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGigaChatJSON } from "@/lib/gigachat/client";
import { MODERATE_SYSTEM, moderateUserPrompt } from "@/lib/gigachat/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

const RequestSchema = z.object({
  text: z.string().min(1).max(10000),
});

const ResponseSchema = z.object({
  status: z.enum(["ok", "warn", "reject"]),
  reason: z.string().default(""),
  fixed_text: z.string().default(""),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
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

export async function POST(req: NextRequest) {
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

  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  try {
    const raw = await askGigaChatJSON<unknown>(
      MODERATE_SYSTEM,
      moderateUserPrompt(body.text)
    );

    const parsed = ResponseSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({
        ok: true,
        data: {
          status: "ok",
          reason: "Не удалось проверить, публикуем как есть",
          fixed_text: body.text,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      data: {
        status: parsed.data.status,
        reason: parsed.data.reason,
        fixed_text: parsed.data.fixed_text || body.text,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[gigachat/moderate]", message);

    return NextResponse.json({
      ok: true,
      data: {
        status: "ok",
        reason: "Модерация недоступна, публикуем как есть",
        fixed_text: body.text,
      },
    });
  }
}
