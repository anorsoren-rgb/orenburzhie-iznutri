import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "События Оренбургской области",
  description:
    "Афиша событий Оренбуржья: фестивали, концерты, выставки, ярмарки и другие события региона.",
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  address: string | null;
  price_rub: number | null;
  place_slug: string | null;
  place_title: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventsPage() {
  const events = await sql<EventRow[]>`
    SELECT
      e.id,
      e.slug,
      e.title,
      e.description,
      e.starts_at,
      e.ends_at,
      e.address,
      e.price_rub,
      p.slug  AS place_slug,
      p.title AS place_title
    FROM events e
    LEFT JOIN places p ON p.id = e.place_id
    WHERE e.status = 'published'
    ORDER BY e.starts_at ASC
  `;

  const list = events;
  const now = new Date();
  const upcoming = list.filter((e) => new Date(e.starts_at) >= now);
  const past = list.filter((e) => new Date(e.starts_at) < now);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          События Оренбургской области
        </h1>
        <p className="mt-2 text-muted-foreground">
          {upcoming.length > 0
            ? `${upcoming.length} ${
                upcoming.length === 1
                  ? "событие"
                  : upcoming.length >= 2 && upcoming.length <= 4
                  ? "события"
                  : "событий"
              } впереди`
            : "Афиша событий Оренбуржья"}
        </p>
      </header>

      {list.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-xl font-semibold">
              Событий пока нет
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Мы собираем афишу Оренбуржья. Скоро здесь появятся первые
              события.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl font-semibold">
                Ближайшие
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl font-semibold text-muted-foreground">
                Прошедшие
              </h2>
              <div className="grid gap-4 opacity-60 sm:grid-cols-2">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: EventRow }) {
  return (
    <Link href={`/sobytiya/${event.slug}`} className="group">
      <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="space-y-3 p-5">
          <Badge variant="secondary" className="bg-accent">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(event.starts_at)}
          </Badge>

          <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
            {event.title}
          </h3>

          {event.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {(event.address || event.place_title) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.address ?? event.place_title}
              </span>
            )}
            {event.price_rub !== null && (
              <span className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                {event.price_rub === 0
                  ? "Бесплатно"
                  : `${event.price_rub.toLocaleString("ru-RU")} ₽`}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}