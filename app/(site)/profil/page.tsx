import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Pencil, Eye, Clock } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata = { title: "Личный кабинет" };

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  draft: {
    text: "Черновик",
    className: "bg-muted text-muted-foreground",
  },
  pending: {
    text: "На модерации",
    className: "bg-ochre-100 text-ochre-700 dark:bg-ochre-600/30 dark:text-ochre-400",
  },
  published: {
    text: "Опубликовано",
    className: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  },
  rejected: {
    text: "Отклонено",
    className: "bg-destructive/10 text-destructive",
  },
};

export default async function ProfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url, role, reputation, created_at")
    .eq("id", user.id)
    .single();

  const { data: myPlaces } = await supabase
    .from("places")
    .select("id, slug, title, status, views, created_at, cover_url")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const displayName = profile?.full_name || profile?.username || user.email;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Профиль */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {(displayName ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Роль: {profile?.role ?? "user"} · Репутация:{" "}
              {profile?.reputation ?? 0}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="[&_svg]:size-4">
            <Link href="/add">
              <Plus />
              <span>Добавить место</span>
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      {/* Мои места */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            Мои места
            {myPlaces && myPlaces.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({myPlaces.length})
              </span>
            )}
          </h2>
        </div>

        {!myPlaces || myPlaces.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <MapPin className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Ты ещё не добавил ни одного места. Самое время начать!
              </p>
              <Button asChild className="mt-2">
                <Link href="/add">Добавить первое место</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myPlaces.map((place) => {
              const status = STATUS_LABEL[place.status] ?? {
                text: place.status,
                className: "bg-muted",
              };

              return (
                <Card key={place.id} className="border-border/60">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    {/* Обложка */}
                    <Link
                      href={`/mesta/${place.slug}`}
                      className="block h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      {place.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={place.cover_url}
                          alt={place.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center sunrise-gradient">
                          <MapPin className="h-6 w-6 text-primary/40" />
                        </div>
                      )}
                    </Link>

                    {/* Инфо */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/mesta/${place.slug}`}
                          className="font-display text-lg font-semibold hover:text-primary"
                        >
                          {place.title}
                        </Link>
                        <Badge className={status.className}>
                          {status.text}
                        </Badge>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {place.views ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(place.created_at).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Кнопки */}
                    <div className="flex shrink-0 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="[&_svg]:size-4"
                      >
                        <Link href={`/mesta/${place.slug}`}>
                          <Eye />
                          <span className="hidden sm:inline">Смотреть</span>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="[&_svg]:size-4"
                      >
                        <Link href={`/mesta/${place.slug}/edit`}>
                          <Pencil />
                          <span className="hidden sm:inline">Изменить</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
