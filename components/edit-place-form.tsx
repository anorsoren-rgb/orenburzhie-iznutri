"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/image-uploader";
import { createClient } from "@/lib/supabase/client";

type Category = { id: number; slug: string; name: string; icon: string | null };
type UploadedImage = { url: string; path: string };

type Initial = {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  full_desc: string;
  how_to_get: string;
  tips: string;
  warnings: string;
  season: string;
  is_free: boolean;
  category_id: number | null;
  cover_url: string | null;
  gallery: UploadedImage[];
};

export function EditPlaceForm({
  userId,
  categories,
  initial,
}: {
  userId: string;
  categories: Category[];
  initial: Initial;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [shortDesc, setShortDesc] = useState(initial.short_desc);
  const [fullDesc, setFullDesc] = useState(initial.full_desc);
  const [howToGet, setHowToGet] = useState(initial.how_to_get);
  const [tips, setTips] = useState(initial.tips);
  const [warnings, setWarnings] = useState(initial.warnings);
  const [season, setSeason] = useState(initial.season);
  const [isFree, setIsFree] = useState(initial.is_free);
  const [categoryId, setCategoryId] = useState<number | null>(
    initial.category_id
  );
  const [images, setImages] = useState<UploadedImage[]>(initial.gallery);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("places")
        .update({
          title: title.trim(),
          short_desc: shortDesc.trim(),
          full_desc: fullDesc.trim(),
          how_to_get: howToGet.trim(),
          tips: tips.trim(),
          warnings: warnings.trim(),
          season,
          is_free: isFree,
          category_id: categoryId,
          cover_url: images[0]?.url ?? null,
          gallery: images.map((img) => img.url),
        })
        .eq("id", initial.id)
        .eq("author_id", userId);

      if (updateError) throw new Error(updateError.message);

      setSuccess(true);
      router.refresh();

      setTimeout(() => {
        router.push(`/mesta/${initial.slug}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function deleteplace() {
    if (deleting) return;
    if (
      !confirm(
        "Удалить место? Это действие нельзя отменить. Фото тоже удалятся."
      )
    ) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from("places")
        .delete()
        .eq("id", initial.id)
        .eq("author_id", userId);

      if (deleteError) throw new Error(deleteError.message);

      router.push("/profil");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/mesta/${initial.slug}`}>
          <ArrowLeft className="h-4 w-4" />
          К месту
        </Link>
      </Button>

      {/* Фото */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Фотографии</h2>
          <p className="text-xs text-muted-foreground">
            Первое фото — обложка. Перетащи новые фото или удали старые.
          </p>
          <ImageUploader
            userId={userId}
            maxFiles={5}
            initialImages={initial.gallery}
            onChange={setImages}
          />
        </CardContent>
      </Card>

      {/* Основное */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">
            Основная информация
          </h2>

          <div>
            <label className="text-sm font-medium" htmlFor="title">
              Название
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              maxLength={120}
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

          <div>
            <label className="text-sm font-medium" htmlFor="short">
              Короткое описание
            </label>
            <Textarea
              id="short"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="mt-1 min-h-16"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="full">
              Полное описание
            </label>
            <Textarea
              id="full"
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              className="mt-1 min-h-40"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="how">
              Как добраться
            </label>
            <Textarea
              id="how"
              value={howToGet}
              onChange={(e) => setHowToGet(e.target.value)}
              className="mt-1 min-h-20"
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
              className="mt-1 min-h-20"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="warnings">
              Предупреждения
            </label>
            <Textarea
              id="warnings"
              value={warnings}
              onChange={(e) => setWarnings(e.target.value)}
              className="mt-1 min-h-16"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium">Сезон</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
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
        </CardContent>
      </Card>

      {/* Кнопки */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex-1 [&_svg]:size-5"
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
              <span>Сохранить изменения</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={deleteplace}
          disabled={deleting}
          variant="outline"
          size="lg"
          className="text-destructive hover:bg-destructive hover:text-white [&_svg]:size-4"
        >
          {deleting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Trash2 />
              <span>Удалить</span>
            </>
          )}
        </Button>
      </div>

      {/* Статус */}
      {success && (
        <div className="rounded-md border border-green-500/40 bg-green-50/50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">
          ✅ Сохранено! Перенаправляем на страницу места...
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}