import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 5;

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };
  try {
    return await imageCompression(file, options);
  } catch {
    return file;
  }
}

// TODO: Загрузка на VPS (S3 или локально) — пока заглушка
export async function uploadPlaceImage(
  file: File,
  userId: string
): Promise<{ url: string; path: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Можно загружать только изображения");
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Файл больше ${MAX_SIZE_MB} МБ`);
  }

  await compressImage(file);

  throw new Error(
    "Загрузка фото временно недоступна. Скоро добавим!"
  );
}

export async function deletePlaceImage(path: string) {
  // Заглушка
  return;
}
