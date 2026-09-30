import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { AddPlaceForm } from "@/components/add-place-form";

export const metadata = { title: "Добавить место" };

export default async function AddPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?next=/add");
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/login");

  const categories = await sql<{ id: number; slug: string; name: string; icon: string | null }[]>`
    SELECT id, slug, name, icon
    FROM categories
    ORDER BY sort_order ASC
  `;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Добавить место</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Опиши место подробно: где оно, что там можно делать, чем оно
          примечательно. Прикрепи фото — они появятся на странице места после
          модерации.
        </p>
      </div>

      <AddPlaceForm categories={categories ?? []} userId={userId} />
    </div>
  );
}