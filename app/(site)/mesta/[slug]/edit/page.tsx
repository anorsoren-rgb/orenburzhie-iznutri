import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditPlaceForm } from "@/components/edit-place-form";

export const metadata = { title: "Редактировать место" };

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/mesta/${slug}/edit`);
  }

  const { data: place } = await supabase
    .from("places")
    .select(
      "id, slug, title, short_desc, full_desc, how_to_get, tips, warnings, season, is_free, category_id, cover_url, gallery, lat, lng, author_id, status"
    )
    .eq("slug", slug)
    .single();

  if (!place) notFound();

  if (place.author_id !== user.id) {
    redirect(`/mesta/${slug}`);
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, icon")
    .order("sort_order", { ascending: true });

  const gallery = Array.isArray(place.gallery)
    ? (place.gallery as string[]).map((url) => ({
        url,
        path: url.split("/places/")[1] ?? "",
      }))
    : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          Редактировать место
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Изменения сохранятся сразу — место останется в текущем статусе.
        </p>
      </div>

      <EditPlaceForm
        userId={user.id}
        categories={categories ?? []}
        initial={{
          id: place.id,
          slug: place.slug,
          title: place.title,
          short_desc: place.short_desc ?? "",
          full_desc: place.full_desc ?? "",
          how_to_get: place.how_to_get ?? "",
          tips: place.tips ?? "",
          warnings: place.warnings ?? "",
          season: place.season ?? "all",
          is_free: place.is_free ?? true,
          category_id: place.category_id,
          cover_url: place.cover_url,
          gallery,
        }}
      />
    </div>
  );
}
