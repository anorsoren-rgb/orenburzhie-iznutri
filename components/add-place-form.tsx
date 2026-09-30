"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/image-uploader";

type Category = { id: number; slug: string; name: string; icon: string | null };
type UploadedImage = { url: string; path: string };

export function AddPlaceForm({
  categories,
  userId,
}: {
  categories: Category[];
  userId: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [howToGet, setHowToGet] = useState("");
  const [tips, setTips] = useState("");
  const [warnings, setWarnings] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [season, setSeason] = useState<"all" | "winter" | "spring" | "summer" | "autumn">("all");
  const [isFree, setIsFree] = useState(true);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    title.trim().length >= 3 &&
    shortDesc.trim().length >= 10 &&
    fullDesc.trim().length >= 30;

  async function save() {
    if (!canSave || saving) return;

    setSaving(true);
    setError(null);

    try {
      const slug =
        title
          .toLowerCase()
          .replace(/[^a-zа-я0-9\s-]/gi, "")
          .trim()
          .replace(/\s+/g, "-")
          .slice(0, 60) +
        "-" +
        Date.now().toString(36);

      const res = await fetch("/api/places/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: title.trim(),
          short_desc: shortDesc.trim(),
          full_desc: fullDesc.trim(),
          how_to_get: howToGet.trim() || null,
          tips: tips.trim() || null,
          warnings: warnings.trim() || null,
          season,
          is_free: isFree,
          category_id: categoryId,
          cover_url: images[0]?.url ?? null,
          gallery: images.map((img) => img.url),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Ошибка сохранения");
      }

      router.push("/profil");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">
              Информация о месте
            </h2>
          </div>

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
            <label className="text-sm font-medium" htmlFor="short">
              Короткое описание * (1–2 предложения)
            </label>
            <Textarea
              id="short"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Красивая гора над Оренбургом. С неё виден весь город, особенно красив закат."
              className="mt-1 min-h-20"
              maxLength={300}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Осталось символов: {300 - shortDesc.length}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="full">
              Полное описание * (3+ абзаца)
            </label>
            <Textarea
              id="full"
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Расскажи подробно: как выглядит место, что там можно делать, чем оно примечательно..."
              className="mt-1 min-h-40"
              maxLength={5000}
            />
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

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium">Сезон</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as typeof season)}
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
                value={isFree ? "free" : "paid"}
                onChange={(e) => setIsFree(e.target.value === "free")}
                className="mt-1 block rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="free">Бесплатно</option>
                <option value="paid">Платно</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="howto">
              Как добраться
            </label>
            <Textarea
              id="howto"
              value={howToGet}
              onChange={(e) => setHowToGet(e.target.value)}
              placeholder="На машине: 30 минут от Оренбурга по трассе М-5..."
              className="mt-1 min-h-20"
              maxLength={1000}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="tips">
              Советы
            </label>
            <Textarea
              id="tips"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Возьмите с собой воду, удобную обувь..."
              className="mt-1 min-h-20"
              maxLength={1000}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="warn">
              Важно знать (предупреждения)
            </label>
            <Textarea
              id="warn"
              value={warnings}
              onChange={(e) => setWarnings(e.target.value)}
              placeholder="Крутые склоны, будьте осторожны..."
              className="mt-1 min-h-16"
              maxLength={500}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Фотографии</label>
            <p className="mb-2 text-xs text-muted-foreground">
              Первое фото станет обложкой места
            </p>
            <ImageUploader userId={userId} maxFiles={5} onChange={setImages} />
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

          <p className="text-center text-xs text-muted-foreground">
            После отправки место появится на сайте после проверки модератором.
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}