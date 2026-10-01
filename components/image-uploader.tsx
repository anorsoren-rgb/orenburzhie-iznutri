"use client";

import { useRef, useState } from "react";
import { X, Loader2, ImagePlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadPlaceImage, deletePlaceImage } from "@/lib/upload";

type UploadedImage = {
  url: string;
  path: string;
};

type Props = {
  userId: string;
  maxFiles?: number;
  onChange: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
};

export function ImageUploader({
  userId,
  maxFiles = 5,
  onChange,
  initialImages = [],
}: Props) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function update(next: UploadedImage[]) {
    setImages(next);
    onChange(next);
  }

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const remaining = maxFiles - images.length;

    if (remaining <= 0) {
      setError(`Максимум ${maxFiles} фото`);
      return;
    }

    const toUpload = arr.slice(0, remaining);
    setUploading(true);
    setError(null);

    const uploaded: UploadedImage[] = [];

    for (const file of toUpload) {
      try {
        const result = await uploadPlaceImage(file, userId);
        uploaded.push(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      }
    }

    update([...images, ...uploaded]);
    setUploading(false);

    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(idx: number) {
    const img = images[idx];
    if (!img) return;

    update(images.filter((_, i) => i !== idx));

    try {
      await deletePlaceImage(img.path);
    } catch {
      // не критично
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-3">
      {/* Плашка «временно недоступно» */}
      <div className="flex items-start gap-2 rounded-md border border-ochre-500/40 bg-ochre-50 px-4 py-3 text-sm dark:bg-ochre-500/10">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ochre-600" />
        <div>
          <p className="font-medium">Загрузка фото временно недоступна</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Мы переносим хранилище на российский сервер. Скоро загрузка снова
            заработает — тогда вы сможете добавить фото к месту.
          </p>
        </div>
      </div>

      {/* Зона загрузки (неактивная) */}
      <div
        onClick={() => setError("Загрузка фото временно недоступна")}
        className={cn(
          "flex cursor-not-allowed flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center opacity-60",
          "border-border"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Загружаем...</p>
          </>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">
              Загрузка фото скоро вернётся
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP до 5 МБ · максимум {maxFiles} фото
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled
      />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((img, i) => (
            <div
              key={img.path}
              className="group relative aspect-square overflow-hidden rounded-md border border-border/60"
            >
              <img
                src={img.url}
                alt={`Фото ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(i);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Удалить"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}