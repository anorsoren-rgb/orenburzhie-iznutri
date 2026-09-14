"use client";

import { useRef, useState } from "react";
import { X, Loader2, ImagePlus } from "lucide-react";
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
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-accent/40"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Загружаем и сжимаем...</p>
          </>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">
              Перетащи фото сюда или нажми
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP до 5 МБ · максимум {maxFiles} фото · автоматически
              сжимаем в WebP
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
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Загружено: {images.length} из {maxFiles}
        </p>
      )}
    </div>
  );
}
