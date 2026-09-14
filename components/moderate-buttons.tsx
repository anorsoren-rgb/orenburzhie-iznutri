"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  table: "places" | "legends" | "events";
  id: string;
};

export function ModerateButtons({ table, id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"publish" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moderate(action: "publish" | "reject") {
    setLoading(action);
    setError(null);

    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, action }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Ошибка");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => moderate("publish")}
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
        onClick={() => moderate("reject")}
        disabled={loading !== null}
        className="text-destructive hover:bg-destructive hover:text-white [&_svg]:size-4"
      >
        {loading === "reject" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <X />
        )}
        <span>Отклонить</span>
      </Button>
      {error && (
        <span className="self-center text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
