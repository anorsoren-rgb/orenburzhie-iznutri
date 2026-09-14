import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModerateButtons } from "@/components/moderate-buttons";
import { Shield, MapPin, BookOpen, Calendar } from "lucide-react";

export const metadata = { title: "Панель модерации" };

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  // Проверяем роль
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, username, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  // Загружаем pending контент
  const [placesRes, legendsRes, eventsRes] = await Promise.all([
    supabase
      .from("places")
      .select("id, title, short_desc, created_at, status, cover_url")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("legends")
      .select("id, title, excerpt, created_at, status")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select("id, title, description, starts_at, status")
      .eq("status", "draft")
      .order("created_at", { ascending: false }),
  ]);

  const pendingPlaces = placesRes.data ?? [];
  const pendingLegends = legendsRes.data ?? [];
  const pendingEvents = eventsRes.data ?? [];

  const totalPending =
    pendingPlaces.length + pendingLegends.length + pendingEvents.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Заголовок */}
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold">Панель модерации</h1>
          <p className="text-sm text-muted-foreground">
            Привет, {profile.full_name || profile.username || "админ"}. На
            модерации: {totalPending}
          </p>
        </div>
      </div>

      {/* Места */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">
            Места на модерации ({pendingPlaces.length})
          </h2>
        </div>

        {pendingPlaces.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Нет мест на модерации
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingPlaces.map((place) => (
              <Card key={place.id} className="border-border/60">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/mesta/${place.title}`}
                        className="font-display text-lg font-semibold hover:text-primary"
                      >
                        {place.title}
                      </Link>
                      <Badge variant="secondary">pending</Badge>
                    </div>
                    {place.short_desc && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {place.short_desc}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(place.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <ModerateButtons table="places" id={place.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Легенды */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">
            Легенды на модерации ({pendingLegends.length})
          </h2>
        </div>

        {pendingLegends.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Нет легенд на модерации
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingLegends.map((legend) => (
              <Card key={legend.id} className="border-border/60">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">
                        {legend.title}
                      </h3>
                      <Badge variant="secondary">pending</Badge>
                    </div>
                    {legend.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {legend.excerpt}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(legend.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <ModerateButtons table="legends" id={legend.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* События */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">
            События-черновики ({pendingEvents.length})
          </h2>
        </div>

        {pendingEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Нет событий на модерации
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingEvents.map((event) => (
              <Card key={event.id} className="border-border/60">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">
                        {event.title}
                      </h3>
                      <Badge variant="secondary">draft</Badge>
                    </div>
                    {event.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(event.starts_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <ModerateButtons table="events" id={event.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
