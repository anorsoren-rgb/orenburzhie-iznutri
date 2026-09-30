import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModerateButtons } from "@/components/moderate-buttons";
import { CheckCircle2, Clock, XCircle, Eye } from "lucide-react";

export const metadata = { title: "Админка — модерация" };

type PlaceRow = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  status: string;
  created_at: string;
  author_name: string | null;
  category_name: string | null;
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?next=/admin");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "moderator") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <XCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 font-display text-2xl font-bold">
          Доступ запрещён
        </h1>
        <p className="mt-2 text-muted-foreground">
          Эта страница доступна только модераторам и администраторам.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    );
  }

  const pending = await sql<PlaceRow[]>`
    SELECT
      p.id, p.slug, p.title, p.short_desc, p.status, p.created_at,
      COALESCE(pr.full_name, pr.username, 'Аноним') AS author_name,
      c.name AS category_name
    FROM places p
    LEFT JOIN profiles pr ON pr.id = p.author_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'pending'
    ORDER BY p.created_at ASC
  `;

  const published = await sql<PlaceRow[]>`
    SELECT
      p.id, p.slug, p.title, p.short_desc, p.status, p.created_at,
      COALESCE(pr.full_name, pr.username, 'Аноним') AS author_name,
      c.name AS category_name
    FROM places p
    LEFT JOIN profiles pr ON pr.id = p.author_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT 30
  `;

  const rejected = await sql<PlaceRow[]>`
    SELECT
      p.id, p.slug, p.title, p.short_desc, p.status, p.created_at,
      COALESCE(pr.full_name, pr.username, 'Аноним') AS author_name,
      c.name AS category_name
    FROM places p
    LEFT JOIN profiles pr ON pr.id = p.author_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'rejected'
    ORDER BY p.created_at DESC
    LIMIT 30
  `;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Панель модерации
        </h1>
        <p className="mt-2 text-muted-foreground">
          Проверяй места, отправленные пользователями
        </p>
      </header>

      {/* ОЧЕРЕДЬ */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-ochre-600" />
          <h2 className="font-display text-xl font-semibold">
            На модерации ({pending.length})
          </h2>
        </div>

        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Очередь пуста — все места проверены
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((place) => (
              <Card key={place.id}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-ochre-100 text-ochre-700">
                      ⏳ На модерации
                    </Badge>
                    {place.category_name && (
                      <Badge variant="outline">{place.category_name}</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      {place.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Автор: {place.author_name} ·{" "}
                      {new Date(place.created_at).toLocaleDateString("ru-RU")}
                    </p>
                    {place.short_desc && (
                      <p className="mt-2 text-sm text-foreground/90">
                        {place.short_desc}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ModerateButtons placeId={place.id} />
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={`/mesta/${place.slug}`}
                        target="_blank"
                      >
                        <Eye className="h-4 w-4" />
                        Посмотреть
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ОПУБЛИКОВАННЫЕ */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-steppe-700" />
          <h2 className="font-display text-xl font-semibold">
            Опубликованные ({published.length})
          </h2>
        </div>

        {published.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Пока ничего не опубликовано
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {published.map((place) => (
              <Card key={place.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{place.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {place.author_name} ·{" "}
                      {new Date(place.created_at).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/mesta/${place.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ОТКЛОНЁННЫЕ */}
      {rejected.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <h2 className="font-display text-xl font-semibold">
              Отклонённые ({rejected.length})
            </h2>
          </div>

          <div className="space-y-2">
            {rejected.map((place) => (
              <Card key={place.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{place.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {place.author_name} ·{" "}
                      {new Date(place.created_at).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <ModerateButtons placeId={place.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}