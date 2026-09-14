import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddPlaceForm } from "@/components/add-place-form";

export const metadata = { title: "Добавить место" };

export default async function AddPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/add");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, icon")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Добавить место</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Опиши место в 2–3 строках, а GigaChat поможет развернуть его в
          полноценную карточку. Прикрепи фото — они появятся на странице места.
        </p>
      </div>

      <AddPlaceForm categories={categories ?? []} userId={user.id} />
    </div>
  );
}
