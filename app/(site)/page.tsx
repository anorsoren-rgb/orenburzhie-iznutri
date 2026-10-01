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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/70 text-xs text-foreground dark:bg-white/10 sm:text-sm"
            >
              <MapPin className="mr-1 h-3 w-3" />
              Народный гид по Оренбуржью
            </Badge>

            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Оренбуржье изнутри
            </h1>

            <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-xl">
              Места, легенды, маршруты и события Оренбургской области —
              собрано местными жителями и путешественниками.
            </p>

            <div className="mt-6 max-w-xl sm:mt-8">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="[&_svg]:size-4">
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
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
                Топ места
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                Самое популярное у посетителей
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/mesta">
                Все места
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
                  Легенды Оренбуржья
                </h2>
                <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                  Народные предания и истории старожилов
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
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
                    <CardContent className="space-y-3 p-5 sm:p-6">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <h3 className="font-display text-base font-semibold leading-tight transition-colors group-hover:text-primary sm:text-lg">
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
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
                Ближайшие события
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                Что происходит в Оренбуржье
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
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
                  <CardContent className="space-y-3 p-5 sm:p-6">
                    <Badge variant="secondary" className="bg-accent text-xs">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(event.starts_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })}
                    </Badge>
                    <h3 className="font-display text-base font-semibold leading-tight transition-colors group-hover:text-primary sm:text-lg">
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
      <section className="border-t border-border/60 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Compass className="mx-auto h-10 w-10 text-primary sm:h-12 sm:w-12" />
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
            Знаешь интересное место?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
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