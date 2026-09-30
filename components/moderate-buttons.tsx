"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModerateButtons({ placeId }: { placeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"publish" | "reject" | "check" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function action(type: "publish" | "reject") {
    setLoading(type);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, action: type }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Ошибка");
      }

      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(null);
    }
  }

  async function checkWithAI() {
    setLoading("check");
    setMessage(null);

    try {
      const res = await fetch("/api/gigachat/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Ошибка");
      }

      const status = data.result?.status;
      const reason = data.result?.reason;

      if (status === "ok") {
        setMessage("✅ мы: всё чисто, можно публиковать");
      } else if (status === "warn") {
        setMessage(`⚠️ мы: ${reason ?? "есть замечания"}`);
      } else if (status === "reject") {
        setMessage(`❌ мы: ${reason ?? "рекомендуется отклонить"}`);
      } else {
        setMessage("мы ответил нестандартно");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка проверки");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        onClick={() => action("publish")}
        disabled={loading !== null}
        className="[&_svg]:size-4"
      >
        {loading === "publish" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Check />
        )}
        <span>Опубликовать</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => action("reject")}
        disabled={loading !== null}
        className="[&_svg]:size-4"
      >
        {loading === "reject" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <X />
        )}
        <span>Отклонить</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={checkWithAI}
        disabled={loading !== null}
        className="[&_svg]:size-4"
      >
        {loading === "check" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Sparkles />
        )}
        <span>Проверить мы</span>
      </Button>

      {message && (
        <span className="w-full text-xs text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  );
}