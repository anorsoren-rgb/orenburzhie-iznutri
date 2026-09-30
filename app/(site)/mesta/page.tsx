import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { PlaceCard } from "@/components/place-card";
import { PlaceFilters } from "@/components/place-filters";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Места Оренбургской области",
  description:
    "Все достопримечательности, природные объекты и интересные места Оренбуржья. Фильтры по категориям, сезону и стоимости.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  category?: string;
  season?: string;
  free?: string;
  q?: string;
}>;

type PlaceRow = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  cover_url: string | null;
  views: number | null;
  is_free: boolean | null;
  season: string | null;
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  category_icon: string | null;
};

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const categories = await sql<{ id: number; slug: string; name: string; icon: string | null }[]>`
    SELECT id, slug, name, icon
    FROM categories
    ORDER BY sort_order ASC
  `;

  let categoryId: number | null = null;
  if (sp.category) {
    const found = categories.find((c) => c.slug === sp.category);
    if (found) categoryId = found.id;
  }

  const season = sp.season ?? null;
  const isFree = sp.free === "1" ? true : null;
  const q = sp.q ?? null;

  const places = await sql<PlaceRow[]>`
    SELECT
      p.id,
      p.slug,
      p.title,
      p.short_desc,
      p.cover_url,
      p.views,
      p.is_free,
      p.season,
      p.category_id,
      c.name  AS category_name,
      c.slug  AS category_slug,
      c.icon  AS category_icon
    FROM places p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE
      p.status = 'published'
      AND (${categoryId}::int IS NULL OR p.category_id = ${categoryId})
      AND (${season}::text IS NULL OR p.season = ${season})
      AND (${isFree}::bool IS NULL OR p.is_free = ${isFree})
      AND (${q}::text IS NULL OR p.title ILIKE '%' || ${q} || '%')
    ORDER BY p.created_at DESC
  `;

  const list = places;
  const categoryList = categories ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Места Оренбургской области
        </h1>
        <p className="mt-2 text-muted-foreground">
          {list.length}{" "}
          {list.length === 1
            ? "место"
            : list.length >= 2 && list.length <= 4
            ? "места"
            : "мест"}{" "}
          найдено
        </p>
      </header>

      <PlaceFilters categories={categoryList} />

      <div className="mt-8">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-xl font-semibold">
              Пока тут пусто
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              По этим фильтрам мест не найдено. Попробуй сбросить фильтры или
              добавь своё место — оно появится здесь после модерации.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((place, i) => (
              <PlaceCard
                key={place.id}
                place={{
                  id: place.id,
                  slug: place.slug,
                  title: place.title,
                  shortDesc: place.short_desc ?? "",
                  coverUrl: place.cover_url,
                  category: place.category_name ?? undefined,
                  views: place.views ?? 0,
                  isFree: place.is_free ?? true,
                }}
                priority={i < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
