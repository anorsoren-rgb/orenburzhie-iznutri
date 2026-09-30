import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { RouteBuilder } from "@/components/route-builder";

export const metadata: Metadata = {
  title: "Собрать маршрут",
  description:
    "Выбери 2–6 мест — мы построим удобный маршрут с расстоянием и временем в пути.",
};

type PlaceRow = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  lat: number | null;
  lng: number | null;
  category_name: string | null;
  category_icon: string | null;
};

export default async function RouteBuilderPage() {
  const rows = await sql<PlaceRow[]>`
    SELECT
      p.id,
      p.slug,
      p.title,
      p.short_desc,
      p.lat,
      p.lng,
      c.name AS category_name,
      c.icon AS category_icon
    FROM places p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'
    ORDER BY p.title ASC
  `;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Собрать маршрут
        </h1>
        <p className="mt-2 text-muted-foreground">
          Выбери 2–6 мест — мы построим логичный маршрут с расстоянием,
          временем в пути и картой.
        </p>
      </header>

      {rows.length < 2 ? (
        <p className="text-muted-foreground">
          Пока на сайте мало мест. Добавь хотя бы два, чтобы собрать маршрут.
        </p>
      ) : (
        <RouteBuilder
          places={rows.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            short_desc: p.short_desc,
            lat: p.lat,
            lng: p.lng,
            category_name: p.category_name,
            category_icon: p.category_icon,
          }))}
        />
      )}
    </div>
  );
}