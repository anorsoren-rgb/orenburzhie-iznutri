import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { RouteBuilder } from "@/components/route-builder";

export const metadata: Metadata = {
  title: "Собрать маршрут",
  description:
    "Выбери 2–5 мест — GigaChat соберёт маршрут с таймингом, бюджетом и советами.",
};

export default async function RouteBuilderPage() {
  const supabase = await createClient();

  const { data: places } = await supabase
    .from("places")
    .select(
      "id, slug, title, short_desc, category:categories(id, name, icon)"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const list = (places ?? []).map((p) => {
    const cat = p.category as
      | { id: number; name: string; icon: string | null }
      | null;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      short_desc: p.short_desc,
      category_name: cat?.name ?? null,
      category_icon: cat?.icon ?? null,
    };
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Собрать маршрут
        </h1>
        <p className="mt-2 text-muted-foreground">
          Выбери 2–5 мест — GigaChat построит маршрут с таймингом, бюджетом и
          практическими советами.
        </p>
      </header>

      {list.length < 2 ? (
        <p className="text-muted-foreground">
          Пока на сайте мало мест. Добавь хотя бы два, чтобы собрать маршрут.
        </p>
      ) : (
        <RouteBuilder places={list} />
      )}
    </div>
  );
}