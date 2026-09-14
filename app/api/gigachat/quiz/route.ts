import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGigaChatJSON } from "@/lib/gigachat/client";
import { QUIZ_SYSTEM, quizUserPrompt } from "@/lib/gigachat/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// ============================================
// СХЕМА ЗАПРОСА
// ============================================
const RequestSchema = z.object({
  place_id: z.string().uuid(),
});

// ============================================
// СХЕМА ОТВЕТА
// ============================================
const QuestionSchema = z.object({
  q: z.string(),
  options: z.array(z.string()).length(4),
  correct: z.number().int().min(0).max(3),
  explain: z.string(),
});

const ResponseSchema = z.object({
  title: z.string().max(120),
  questions: z.array(QuestionSchema).min(3).max(12),
});

// ============================================
// RATE LIMITING
// ============================================
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
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
// ГЕНЕРАЦИЯ SLUG ИЗ НАЗВАНИЯ
// ============================================
function slugify(text: string) {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };

  return (
    text
      .toLowerCase()
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

// ============================================
// ОБРАБОТЧИК
// ============================================
export async function POST(req: NextRequest) {
  const started = Date.now();

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

  const supabase = await createClient();

  // Загружаем место
  const { data: place } = await supabase
    .from("places")
    .select("id, title, short_desc, full_desc, tips, how_to_get")
    .eq("id", body.place_id)
    .eq("status", "published")
    .single();

  if (!place) {
    return NextResponse.json(
      { ok: false, error: "Место не найдено" },
      { status: 404 }
    );
  }

  // Собираем текст статьи
  const articleText = [
    place.title,
    place.short_desc ?? "",
    place.full_desc ?? "",
    place.tips ?? "",
    place.how_to_get ?? "",
  ]
    .filter(Boolean)
    .join("\n\n");

  if (articleText.length < 100) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "У места слишком мало текста для создания теста. Добавь больше описания.",
      },
      { status: 400 }
    );
  }

  try {
    const raw = await askGigaChatJSON<unknown>(
      QUIZ_SYSTEM,
      quizUserPrompt(articleText)
    );

    const parsed = ResponseSchema.safeParse(raw);

    if (!parsed.success) {
      console.error(
        "[quiz] Невалидный ответ:",
        JSON.stringify(raw).slice(0, 500),
        parsed.error.issues
      );
      return NextResponse.json(
        { ok: false, error: "ИИ вернул неполный тест. Попробуй ещё раз." },
        { status: 502 }
      );
    }

    // Сохраняем квиз в БД
    const slug = slugify(parsed.data.title);
    const { data: saved, error: saveError } = await supabase
      .from("quizzes")
      .insert({
        slug,
        title: parsed.data.title,
        description: `Тест по месту «${place.title}»`,
        place_id: place.id,
        questions: parsed.data.questions,
        created_by_gigachat: true,
        status: "published",
      })
      .select("id, slug")
      .single();

    if (saveError) {
      console.error("[quiz] Ошибка сохранения:", saveError);
      // Возвращаем всё равно результат — просто без сохранения
    }

    const duration = Date.now() - started;

    try {
      await supabase.from("gigachat_logs").insert({
        scenario: "quiz",
        prompt: place.title,
        response: JSON.stringify(parsed.data).slice(0, 5000),
        duration_ms: duration,
      });
    } catch {
      // не критично
    }

    return NextResponse.json({
      ok: true,
      quiz: {
        id: saved?.id ?? null,
        slug: saved?.slug ?? null,
        title: parsed.data.title,
        questions: parsed.data.questions,
      },
      duration_ms: duration,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[quiz]", message);
    return NextResponse.json(
      { ok: false, error: "Не удалось создать тест. Попробуй ещё раз." },
      { status: 500 }
    );
  }
}
