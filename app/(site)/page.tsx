import Link from "next/link";
import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceCard } from "@/components/place-card";
import { SearchBar } from "@/components/search-bar";
import { MapPin, BookOpen, Calendar, Compass, ArrowRight } from "lucide-react";

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
      {/* HERO */}
      <section className="relative overflow-hidden sunrise-gradient dark:sunrise-gradient-dark">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/70 text-foreground dark:bg-white/10">
              <MapPin className="mr-1 h-3 w-3" />
              Народный гид по Оренбуржью
            </Badge>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Оренбуржье изнутри
            </h1>

            <p className="mt-4 text-lg text-foreground/80 sm:text-xl">
              Места, легенды, маршруты и события Оренбургской области —
              собрано местными жителями и путешественниками.
            </p>

            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/mesta">
                  Смотреть места
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/add">Добавить место</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ТОП МЕСТ */}
      {topPlaces.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Топ места
              </h2>
              <p className="mt-2 text-muted-foreground">
                Самое популярное у посетителей
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/mesta">
                Все места
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
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

      {/* ЛЕГЕНДЫ */}
      {latestLegends.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  Легенды Оренбуржья
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Народные предания и истории старожилов
                </p>
              </div>
              <Button asChild variant="ghost">
                <Link href="/legendy">
                  Все легенды
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {latestLegends.map((legend) => (
                <Link
                  key={legend.id}
                  href={`/legendy/${legend.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="space-y-3 p-6">
                      <BookOpen className="h-6 w-6 text-primary" />
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
          </div>
        </section>
      )}

      {/* СОБЫТИЯ */}
      {upcomingEvents.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Ближайшие события
              </h2>
              <p className="mt-2 text-muted-foreground">
                Что происходит в Оренбуржье
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/sobytiya">
                Все события
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/sobytiya/${event.slug}`}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="space-y-3 p-6">
                    <Badge variant="secondary" className="bg-accent">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(event.starts_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })}
                    </Badge>
                    <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                      {event.title}
                    </h3>
                    {event.address && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.address}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border/60 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Compass className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Знаешь интересное место?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Поделись с другими — добавь место на сайт. Мы опубликуем после
            проверки.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/add">Добавить место</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}