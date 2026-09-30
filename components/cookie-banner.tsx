"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie_consent_v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Проверяем только на клиенте (чтобы не было SSR-ошибки)
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Небольшая задержка, чтобы баннер не «выскакивал» при первой загрузке
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accepted: true, at: new Date().toISOString() })
    );
    setVisible(false);
  }

  function dismiss() {
    // Закрыть без согласия — просто скрыть до следующей сессии
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление об использовании cookies"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-xl border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur sm:inset-x-6 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ochre-100 text-ochre-700 sm:flex dark:bg-ochre-600/20 dark:text-ochre-400">
          <Cookie className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold">
            Мы используем cookies 🍪
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Для авторизации, сохранения настроек и анализа посещаемости
            (Яндекс.Метрика). Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
            <Link
              href="/politika"
              target="_blank"
              className="text-primary underline hover:no-underline"
            >
              Политикой конфиденциальности
            </Link>
            .
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={accept} className="[&_svg]:size-4">
              Принять
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismiss}
              className="text-muted-foreground"
            >
              Позже
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Закрыть"
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
