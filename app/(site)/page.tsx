import Link from "next/link";
import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceCard } from "@/components/place-card";
import { SearchBar } from "@/components/search-bar";
import { MapPin, BookOpen, Calendar, Compass, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Оренбуржье изнутри — народный гид по Оренбургской области",
  description:
    "Места, истории, легенды, маршруты и события Оренбургской области. Народный гид по Оренбуржью.",
};

type PlaceCardRow = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  cover_url: string | null;
  views: number | null;
  is_free: boolean | null;
  category_name: string | null;
};

type LegendRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  address: string | null;
};

export default async function HomePage() {
  const [topPlaces, latestLegends, upcomingEvents] = await Promise.all([
    sql<PlaceCardRow[]>`
      SELECT
        p.id, p.slug, p.title, p.short_desc, p.cover_url,
        p.views, p.is_free,
        c.name AS category_name
      FROM places p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'published'
      ORDER BY p.views DESC NULLS LAST, p.created_at DESC
      LIMIT 6
    `,
    sql<LegendRow[]>`
      SELECT id, slug, title, excerpt
      FROM legends
      WHERE status = 'published'
      ORDER BY created_at DESC
      LIMIT 3
    `,
    sql<EventRow[]>`
      SELECT id, slug, title, starts_at, address
      FROM events
      WHERE status = 'published' AND starts_at >= NOW()
      ORDER BY starts_at ASC
      LIMIT 3
    `,
  ]);

  return (
    <div>
      <section className="relative overflow-hidden sunrise-gradient dark:sunrise-gradient-dark">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-4 py-1.5 text-sm backdrop-blur">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Народный гид по Оренбуржью</span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Оренбуржье{" "}
              <span className="bg-gradient-to-r from-terracotta-600 via-ochre-600 to-steppe-700 bg-clip-text text-transparent">
                изнутри
              </span>
            </h1>

            <p className="mt-6 text-lg text-foreground/80 sm:text-xl">
              Места, легенды, маршруты и события Оренбургской области — от
              местных жителей.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-background/70 backdrop-blur"
              >
                <Link href="/mesta">
                  <MapPin className="h-5 w-5" />
                  Все места
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/sobrat-marshrut">
                  <Compass className="h-5 w-5" />
                  Собрать маршрут
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {topPlaces.length > 0 && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Топ-места Оренбургской области
              </h2>
              <Link
                href="/mesta"
                className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Смотреть все
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topPlaces.map((place, i) => (
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
          </section>
        )}

        {latestLegends.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Свежие истории и легенды
              </h2>
              <Link
                href="/legendy"
                className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Смотреть все
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {latestLegends.map((legend) => (
                <Link
                  key={legend.id}
                  href={`/legendy/${legend.slug}`}
                  className="group"
                >
                  <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="space-y-3 p-5">
                      <Badge variant="secondary" className="bg-accent">
                        <BookOpen className="mr-1 h-3 w-3" />
                        Легенда
                      </Badge>
                      <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                        {legend.title}
                      </h3>
                      {legend.excerpt && (
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {legend.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {upcomingEvents.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Ближайшие события
              </h2>
              <Link
                href="/sobytiya"
                className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Смотреть все
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href={`/sobytiya/${event.slug}`}>
                  <Card className="border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-5">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-lg font-bold leading-none">
                          {new Date(event.starts_at).getDate()}
                        </span>
                        <span className="text-[10px] uppercase">
                          {new Date(event.starts_at).toLocaleDateString(
                            "ru-RU",
                            { month: "short" }
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display font-semibold">
                          {event.title}
                        </h3>
                        {event.address && (
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.address}
                          </p>
                        )}
                      </div>
                      <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <Card className="border-0 sunrise-gradient dark:sunrise-gradient-dark">
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center sm:p-14">
              <Compass className="h-10 w-10 text-primary" />
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Не знаешь, с чего начать?
              </h2>
              <p className="max-w-xl text-foreground/80">
                Выбери 3–5 мест — мы соберём маршрут с таймингом и советами.
              </p>
              <Button asChild size="lg" className="mt-2">
                <Link href="/sobrat-marshrut">
                  <Compass className="h-5 w-5" />
                  Собрать маршрут
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}