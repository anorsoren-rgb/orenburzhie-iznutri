import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Wallet, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "События Орска и Оренбургской области",
  description:
    "Афиша Орска и Оренбуржья: фестивали, концерты, праздники, экскурсии. Что происходит сегодня и в ближайшие дни.",
};

function formatDateRange(starts: string, ends: string | null) {
  const start = new Date(starts);
  const startStr = start.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  if (!ends) return startStr;
  const end = new Date(ends);
  const endStr = end.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  return startStr === endStr ? startStr : `${startStr} — ${endStr}`;
}

export default async function EventsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: events } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, starts_at, ends_at, address, price_rub, url, cover_url, place:places(id, slug, title)"
    )
    .in("status", ["published", "past"])
    .order("starts_at", { ascending: true });

  const list = events ?? [];
  const upcoming = list.filter((e) => new Date(e.starts_at) >= new Date(now));
  const past = list.filter((e) => new Date(e.starts_at) < new Date(now));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Афиша Оренбуржья
        </h1>
        <p className="mt-2 text-muted-foreground">
          Фестивали, концерты, праздники и экскурсии — что происходит в Орске и
          области.
        </p>
      </header>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">
          Предстоящие ({upcoming.length})
        </h2>

        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/40" />
              <p className="font-display text-lg font-semibold">
                Пока нет предстоящих событий
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Следи за обновлениями — скоро здесь появятся новые события.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcoming.map((ev) => (
              <EventRow key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-muted-foreground">
            Прошедшие ({past.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {past.map((ev) => (
              <EventRow key={ev.id} event={ev} isPast />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EventRow({
  event,
  isPast,
}: {
  event: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string | null;
    address: string | null;
    price_rub: number | null;
    url: string | null;
    place: unknown;
  };
  isPast?: boolean;
}) {
  const date = new Date(event.starts_at);
  const dayNum = date.getDate();
  const monthShort = date
    .toLocaleDateString("ru-RU", { month: "short" })
    .replace(".", "");
  const place = event.place as { title: string } | null;

  return (
    <Link href={`/sobytiya/${event.slug}`} className="block group">
      <Card className="border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
        <CardContent className="flex items-start gap-4 p-5">
          <div
            className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg ${
              isPast
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <span className="text-xl font-bold leading-none">{dayNum}</span>
            <span className="text-[10px] uppercase tracking-wide">
              {monthShort}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
              {event.title}
            </h3>

            {event.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {event.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateRange(event.starts_at, event.ends_at)}
              </span>

              {(event.address || place) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.address ?? place?.title}
                </span>
              )}

              {event.price_rub !== null && (
                <span className="flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5" />
                  {event.price_rub === 0
                    ? "Бесплатно"
                    : `${event.price_rub.toLocaleString("ru-RU")} ₽`}
                </span>
              )}
            </div>
          </div>

          {event.url && (
            <ExternalLink className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </CardContent>
      </Card>
    </Link>
  );
}