import postgres from "postgres";

// ============================================
//   POSTGRESQL  VPS
// ============================================
//  .env.local должно быть:
// DATABASE_URL=postgresql://appuser:OrskApp2026Pass@127.0.0.1:5432/orenburzhie

const connectionString: string = process.env.DATABASE_URL ?? "";

if (!connectionString) {
  throw new Error(
    "DATABASE_URL не задан в .env.local. " +
      "обавь строку: DATABASE_URL=postgresql://appuser:Ь@127.0.0.1:5432/orenburzhie"
  );
}

// дин клиент на всё приложение (singleton)
// max: 5 — ограничиваем количество соединений (у нас слабый VPS)
// idle_timeout: 20 — закрываем неактивные соединения через 20 сек
// connect_timeout: 10 — таймаут подключения 10 сек
let cachedSql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (cachedSql) return cachedSql;

  cachedSql = postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: false, // локальное подключение — без SSL
  });

  return cachedSql;
}

// кспорт по умолчанию — удобный sql`...`
export const sql = getDb();
