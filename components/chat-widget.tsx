"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Message = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Привет! Я умный гид по Орску и Оренбуржью. Спроси про места, легенды, маршруты или что посмотреть в выходные.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const history = messages.slice(-6); // последние 6 сообщений

    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gigachat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, history }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Не удалось получить ответ");
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка";
      setError(msg);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Упс, что-то пошло не так. Попробуй ещё раз через минутку.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="flex items-center gap-2 border-b border-border/60 bg-gradient-to-r from-terracotta-50 to-ochre-50 px-4 py-3 dark:from-deepblue-700 dark:to-deepblue-700">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-semibold">Спроси про Орск</h2>
      </div>

      <CardContent className="space-y-3 p-4">
        <div
          ref={scrollRef}
          className="max-h-80 space-y-3 overflow-y-auto pr-1"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
                  : "mr-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm"
              }
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Думаю...
            </div>
          )}
        </div>

        <form onSubmit={send} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Например: куда сходить с детьми в Орске?"
            disabled={loading}
            maxLength={500}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {error && (
          <p className="text-center text-xs text-destructive">{error}</p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Отвечает на основе материалов сайта. Не заменяет экскурсовода.
        </p>
      </CardContent>
    </Card>
  );
}
