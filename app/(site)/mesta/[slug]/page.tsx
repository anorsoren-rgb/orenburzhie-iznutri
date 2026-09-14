import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  MapPin,
  Eye,
  Calendar,
  Compass,
  Lightbulb,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Sparkles,
  Cloud,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceMap } from "@/components/place-map";

async function getPlace(slug: string) {
  const supabase = await createClient();

  const { data: place } = await supabase
    .from("places")
    .select(
      "id, slug, title, short_desc, full_desc, cover_url, gallery, lat, lng, season, is_free, how_to_get, tips, warnings, views, created_at, status, category:categories(id, slug, name, icon), author:profiles!places_author_id_fkey(id, username, full_name, avatar_url)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return place;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (!place) return { title: "Место не найдено" };

  const description = place.short_desc ?? place.title;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";
  const url = `${siteUrl}/mesta/${place.slug}`;
  const image = place.cover_url
    ? place.cover_url
    : `${siteUrl}/og/default.svg`;

  return {
    title: place.title,
    description,
    alternates: {
      canonical: `/mesta/${place.slug}`,
    },
    openGraph: {
      title: place.title,
      description,
      type: "article",
      url,
      images: [{ url: image, width: 1200, height: 630, alt: place.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: place.title,
      description,
      images: [image],
    },
  };
}

const SEASON_LABEL: Record<string, string> = {
  all: "Круглый год",
  winter: "Зима",
  spring: "Весна",
  summer: "Лето",
  autumn: "Осень",
};

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (!place) notFound();

  const supabase = await createClient();
  supabase
    .from("places")
    .update({ views: (place.views ?? 0) + 1 })
    .eq("id", place.id)
    .then(() => {});

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";
  const category = place.category as unknown as
    | { id: number; slug: string; name: string; icon: string | null }
    | null;
  const author = place.author as unknown as
    | { id: string; username: string | null; full_name: string | null }
    | null;

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.title,
    description: place.short_desc,
    url: `${siteUrl}/mesta/${place.slug}`,
    image: place.cover_url ?? undefined,
    geo:
      place.lat && place.lng
        ? {
            "@type": "GeoCoordinates",
            latitude: place.lat,
            longitude: place.lng,
          }
        : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Места",
        item: `${siteUrl}/mesta`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: place.title,
        item: `${siteUrl}/mesta/${place.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/mesta">
          <ArrowLeft className="h-4 w-4" />
          Все места
        </Link>
      </Button>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
        {place.cover_url ? (
          <Image
            src={place.cover_url}
            alt={place.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center sunrise-gradient dark:sunrise-gradient-dark">
            <MapPin className="h-20 w-20 text-primary/30" />
          </div>
        )}
      </div>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <Badge variant="secondary" className="bg-accent">
              {category.icon} {category.name}
            </Badge>
          )}
          {place.is_free ? (
            <Badge className="bg-ochre-500 text-white hover:bg-ochre-500">
              Бесплатно
            </Badge>
          ) : (
            <Badge variant="outline">
              <DollarSign className="mr-1 h-3 w-3" />
              Платно
            </Badge>
          )}
          {place.season && (
            <Badge variant="outline">
              <Cloud className="mr-1 h-3 w-3" />
              {SEASON_LABEL[place.season] ?? place.season}
            </Badge>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {place.title}
        </h1>

        {place.short_desc && (
          <p className="mt-3 text-lg text-muted-foreground">
            {place.short_desc}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {author && (
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              {author.full_name ?? author.username ?? "Аноним"}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {place.views ?? 0} просмотров
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(place.created_at).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </header>

      {place.full_desc && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl font-semibold">
            Описание
          </h2>
          <div className="max-w-none whitespace-pre-wrap text-base leading-relaxed">
            {place.full_desc}
          </div>
        </section>
      )}

      {place.lat && place.lng && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl font-semibold">
            На карте
          </h2>
          <PlaceMap lat={place.lat} lng={place.lng} title={place.title} />
          <p className="mt-2 text-xs text-muted-foreground">
            Координаты: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
          </p>
        </section>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {place.how_to_get && (
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">Как добраться</h3>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                {place.how_to_get}
              </p>
            </CardContent>
          </Card>
        )}

        {place.tips && (
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-ochre-600" />
                <h3 className="font-display font-semibold">Советы</h3>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                {place.tips}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {place.warnings && (
        <Card className="mt-4 border-destructive/40 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-display font-semibold text-destructive">
                Важно знать
              </h3>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">
              {place.warnings}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/mesta">
            <Share2 className="h-4 w-4" />
            Смотреть другие места
          </Link>
        </Button>
      </div>
    </article>
  );
}
