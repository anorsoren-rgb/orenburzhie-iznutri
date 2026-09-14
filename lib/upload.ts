import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_MB = 5;

// ============================================
// СЖАТИЕ ФОТО В БРАУЗЕРЕ
// ============================================
async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5, // 500 КБ после сжатия
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    return await imageCompression(file, options);
  } catch {
    // Если сжатие не удалось — вернём оригинал
    return file;
  }
}

// ============================================
// ЗАГРУЗКА ОДНОГО ФАЙЛА
// ============================================
export async function uploadPlaceImage(
  file: File,
  userId: string
): Promise<{ url: string; path: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Можно загружать только изображения");
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Файл больше ${MAX_SIZE_MB} МБ. Сожми и попробуй снова.`);
  }

  const compressed = await compressImage(file);
  const supabase = createClient();

  const ext = "webp";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from("places")
    .upload(path, compressed, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Ошибка загрузки: ${error.message}`);
  }

  const { data } = supabase.storage.from("places").getPublicUrl(path);

  return { url: data.publicUrl, path };
}

// ============================================
// УДАЛЕНИЕ ФАЙЛА
// ============================================
export async function deletePlaceImage(path: string) {
  const supabase = createClient();
  await supabase.storage.from("places").remove([path]);
}