import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wallet,
  ExternalLink,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getEvent(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, starts_at, ends_at, address, price_rub, url, cover_url, status, place:places(id, slug, title, lat, lng)"
    )
    .eq("slug", slug)
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) return { title: "Событие не найдено" };

  return {
    title: event.title,
    description: event.description ?? event.title,
    openGraph: {
      title: event.title,
      description: event.description ?? "",
      type: "article",
    },
  };
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const place = event.place as
    | { id: string; slug: string; title: string }
    | null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? "",
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    url: `${siteUrl}/sobytiya/${event.slug}`,
    location: event.address
      ? { "@type": "Place", name: event.address }
      : undefined,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/sobytiya">
          <ArrowLeft className="h-4 w-4" />
          Все события
        </Link>
      </Button>

      <header>
        <Badge variant="secondary" className="bg-accent">
          <Calendar className="mr-1 h-3 w-3" />
          Событие
        </Badge>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {event.title}
        </h1>
      </header>

      <div className="mt-8 space-y-3 rounded-lg border border-border/60 bg-muted/30 p-5">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">{formatFullDate(event.starts_at)}</p>
            {event.ends_at &&
              event.ends_at !== event.starts_at && (
                <p className="text-sm text-muted-foreground">
                  до {formatFullDate(event.ends_at)}
                </p>
              )}
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Начало в {formatTime(event.starts_at)}
            </p>
          </div>
        </div>

        {(event.address || place) && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">
                {event.address ?? place?.title}
              </p>
              {place && event.address && (
                <Link
                  href={`/mesta/${place.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  Подробнее о месте →
                </Link>
              )}
            </div>
          </div>
        )}

        {event.price_rub !== null && (
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 shrink-0 text-primary" />
            <p className="font-medium">
              {event.price_rub === 0
                ? "Вход свободный"
                : `${event.price_rub.toLocaleString("ru-RU")} ₽`}
            </p>
          </div>
        )}
      </div>

      {event.description && (
        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed">
          {event.description}
        </div>
      )}

      {event.url && (
        <div className="mt-10">
          <Button asChild size="lg" className="w-full [&_svg]:size-5">
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink />
              <span>Перейти к событию</span>
            </a>
          </Button>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/sobytiya">Смотреть другие события</Link>
        </Button>
      </div>
    </article>
  );
}
