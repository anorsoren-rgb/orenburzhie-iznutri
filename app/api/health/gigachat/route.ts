import { NextResponse } from "next/server";
import { askGigaChat } from "@/lib/gigachat/client";

export const runtime = "nodejs";

export async function GET() {
  const started = Date.now();

  try {
    const answer = await askGigaChat(
      "Ты коротко и дружелюбно отвечаешь на вопросы об Оренбуржье.",
      "В одном предложении: чем известна Оренбургская область?"
    );

    return NextResponse.json({
      ok: true,
      duration_ms: Date.now() - started,
      model: process.env.GIGACHAT_MODEL ?? "GigaChat-2",
      answer,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[health/gigachat]", message);

    return NextResponse.json(
      {
        ok: false,
        duration_ms: Date.now() - started,
        error: message,
      },
      { status: 500 }
    );
  }
}
