"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const CONSENT_VERSION = "2026-09-14";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Необходимо принять Политику конфиденциальности");
      setLoading(false);
      return;
    }

    const now = new Date().toISOString();

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username,
          terms_accepted_at: now,
          privacy_accepted_at: now,
          marketing_consent: marketingConsent,
          consent_version: CONSENT_VERSION,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/profil");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="username">
          Имя или ник
        </label>
        <Input
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Иван Петров"
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="password">
          Пароль
        </label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Минимум 6 символов"
          autoComplete="new-password"
          className="mt-1"
        />
      </div>

      {/* Обязательное согласие */}
      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
          required
        />
        <label htmlFor="terms" className="text-sm leading-snug">
          Я принимаю{" "}
          <Link
            href="/politika"
            target="_blank"
            className="text-primary underline hover:no-underline"
          >
            Политику конфиденциальности
          </Link>{" "}
          и даю согласие на обработку моих персональных данных (152-ФЗ)
        </label>
      </div>

      {/* Опциональное согласие */}
      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
        <input
          id="marketing"
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
        />
        <label htmlFor="marketing" className="text-sm leading-snug">
          Хочу получать новости проекта на email (необязательно)
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !termsAccepted}
        className="w-full"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Зарегистрироваться
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Данные хранятся в соответствии с Федеральным законом №152-ФЗ. Вы можете
        удалить свой аккаунт в любой момент.
      </p>
    </form>
  );
}
