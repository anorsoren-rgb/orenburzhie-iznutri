// ============================================
// ВРЕМЕННАЯ ЗАГЛУШКА ЗАГРУЗКИ ФОТО
// ============================================
// Supabase Storage удалён. Сейчас функция возвращает
// ошибку — загрузка недоступна до момента, когда
// перенесём хранение фото на VPS (через API-роут).

type UploadResult = {
  url: string;
  path: string;
};

export async function uploadPlaceImage(
  _file: File,
  _userId: string
): Promise<UploadResult> {
  throw new Error(
    "Загрузка фото временно недоступна. Мы работаем над этим."
  );
}

export async function deletePlaceImage(_path: string) {
  // Заглушка — ничего не делает
  return;
}