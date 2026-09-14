import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata = { title: "Личный кабинет" };

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
    .select("id, slug, title, status, views, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const displayName = profile?.full_name || profile?.username || user.email;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {(displayName ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Роль: {profile?.role ?? "user"} · Репутация: {profile?.reputation ?? 0}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/add">
              <Plus className="h-4 w-4" />
              Добавить место
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold">Мои места</h2>

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
          <div className="space-y-2">
            {myPlaces.map((place) => (
              <Card key={place.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <Link
                      href={`/mesta/${place.slug}`}
                      className="font-medium hover:text-primary"
                    >
                      {place.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Статус: {place.status} · Просмотров: {place.views ?? 0}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(place.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
