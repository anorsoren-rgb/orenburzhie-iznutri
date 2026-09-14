import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PlaceCard } from "@/components/place-card";
import { PlaceFilters } from "@/components/place-filters";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Места Орска и Оренбургской области",
  description:
    "Все достопримечательности, природные объекты и интересные места Орска и Оренбуржья. Фильтры по категориям, сезону и стоимости.",
};

type SearchParams = Promise<{
  category?: string;
  season?: string;
  free?: string;
  q?: string;
}>;

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, icon")
    .order("sort_order", { ascending: true });

  let query = supabase
    .from("places")
    .select(
      "id, slug, title, short_desc, cover_url, views, is_free, season, category:categories(id, slug, name, icon)"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (sp.category && categories) {
    const cat = categories.find((c) => c.slug === sp.category);
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (sp.season) {
    query = query.eq("season", sp.season);
  }

  if (sp.free === "1") {
    query = query.eq("is_free", true);
  }

  if (sp.q) {
    query = query.ilike("title", `%${sp.q}%`);
  }

  const { data: places } = await query;
  const list = places ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Места Орска и Оренбуржья
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

      <PlaceFilters categories={categories ?? []} />

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
            {list.map((place, i) => {
              const cat = place.category as
                | { id: number; slug: string; name: string; icon: string | null }
                | null;

              return (
                <PlaceCard
                  key={place.id}
                  place={{
                    id: place.id,
                    slug: place.slug,
                    title: place.title,
                    shortDesc: place.short_desc ?? "",
                    coverUrl: place.cover_url,
                    category: cat?.name,
                    views: place.views ?? 0,
                    isFree: place.is_free ?? true,
                  }}
                  priority={i < 3}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
