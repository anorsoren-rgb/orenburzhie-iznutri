"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  Save,
  Wand2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

type Category = { id: number; slug: string; name: string; icon: string | null };

type ExpandedData = {
  short_desc: string;
  full_desc: string;
  how_to_get: string;
  tips: string;
  warnings: string;
  season: "all" | "winter" | "spring" | "summer" | "autumn";
  is_free: boolean;
  tags: string[];
};

export function AddPlaceForm({ categories }: { categories: Category[] }) {
  const router = useRouter();

  // Основные поля
  const [title, setTitle] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Поля, которые заполняет GigaChat
  const [expanded, setExpanded] = useState<ExpandedData | null>(null);

  // Состояния
  const [improving, setImproving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canImprove = rawInput.trim().length >= 10;
  const canSave = title.trim().length >= 3 && expanded !== null;

  // ============================================
  // ВЫЗОВ GIGACHAT — «Улучшить»
  // ============================================
  async function improve() {
    if (!canImprove || improving) return;

    setImproving(true);
    setError(null);

    try {
      const categoryName = categories.find((c) => c.id === categoryId)?.name;

      const res = await fetch("/api/gigachat/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: rawInput.trim(),
          category: categoryName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Не удалось улучшить текст");
      }

      setExpanded(data.data as ExpandedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setImproving(false);
    }
  }

  // ============================================
  // СОХРАНЕНИЕ В БД
  // ============================================
  async function save() {
    if (!canSave || saving) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const slug = title
        .toLowerCase()
        .replace(/[^a-zа-я0-9\s-]/gi, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60) + "-" + Date.now().toString(36);

     // Получаем текущего пользователя, чтобы указать его как автора
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  throw new Error("Не удалось определить пользователя. Войди заново.");
}

const { error: insertError } = await supabase.from("places").insert({
  slug,
  title: title.trim(),
  short_desc: expanded!.short_desc,
  full_desc: expanded!.full_desc,
  how_to_get: expanded!.how_to_get,
  tips: expanded!.tips,
  warnings: expanded!.warnings,
  season: expanded!.season,
  is_free: expanded!.is_free,
  category_id: categoryId,
  author_id: user.id,
  status: "pending",
});

      if (insertError) throw new Error(insertError.message);

      router.push("/profil");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
      setSaving(false);
    }
  }

  // ============================================
  // ОБНОВЛЕНИЕ ПОЛЯ EXPANDED
  // ============================================
  function updateExpanded<K extends keyof ExpandedData>(
    key: K,
    value: ExpandedData[K]
  ) {
    setExpanded((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div className="space-y-6">
      {/* Шаг 1 — основное */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">
            1. Основное
          </h2>

          <div>
            <label className="text-sm font-medium" htmlFor="title">
              Название места *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Гора Полковник"
              className="mt-1"
              maxLength={120}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="raw">
              Кратко опиши место (2–3 строки) *
            </label>
            <Textarea
              id="raw"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Красивая гора над Орском. По легенде, там был лагерь Пугачёва. С горы виден весь город, особенно красив закат."
              className="mt-1 min-h-24"
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Чем больше деталей, тем точнее GigaChat развернёт карточку.
              Осталось символов: {1000 - rawInput.length}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Категория</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    categoryId === cat.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={improve}
            disabled={!canImprove || improving}
            className="w-full [&_svg]:size-5"
            size="lg"
          >
            {improving ? (
              <>
                <Loader2 className="animate-spin" />
                <span>GigaChat думает (10–20 сек)...</span>
              </>
            ) : (
              <>
                <Sparkles />
                <span>Улучшить с помощью GigaChat</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Шаг 2 — расширенное описание */}
      {expanded && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">
                2. Проверь и отредактируй
              </h2>
            </div>

            <div>
              <label className="text-sm font-medium">Короткое описание</label>
              <Textarea
                value={expanded.short_desc}
                onChange={(e) => updateExpanded("short_desc", e.target.value)}
                className="mt-1 min-h-16"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Полное описание</label>
              <Textarea
                value={expanded.full_desc}
                onChange={(e) => updateExpanded("full_desc", e.target.value)}
                className="mt-1 min-h-40"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Как добраться</label>
              <Textarea
                value={expanded.how_to_get}
                onChange={(e) => updateExpanded("how_to_get", e.target.value)}
                className="mt-1 min-h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Советы</label>
              <Textarea
                value={expanded.tips}
                onChange={(e) => updateExpanded("tips", e.target.value)}
                className="mt-1 min-h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Предупреждения (если есть)
              </label>
              <Textarea
                value={expanded.warnings}
                onChange={(e) => updateExpanded("warnings", e.target.value)}
                className="mt-1 min-h-16"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium">Сезон</label>
                <select
                  value={expanded.season}
                  onChange={(e) =>
                    updateExpanded(
                      "season",
                      e.target.value as ExpandedData["season"]
                    )
                  }
                  className="mt-1 block rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="all">Круглый год</option>
                  <option value="winter">Зима</option>
                  <option value="spring">Весна</option>
                  <option value="summer">Лето</option>
                  <option value="autumn">Осень</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Посещение</label>
                <select
                  value={expanded.is_free ? "free" : "paid"}
                  onChange={(e) =>
                    updateExpanded("is_free", e.target.value === "free")
                  }
                  className="mt-1 block rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="free">Бесплатно</option>
                  <option value="paid">Платно</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Теги</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {expanded.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={save}
              disabled={!canSave || saving}
              className="w-full [&_svg]:size-5"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Сохраняем...</span>
                </>
              ) : (
                <>
                  <Save />
                  <span>Опубликовать (на модерацию)</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ошибка */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
