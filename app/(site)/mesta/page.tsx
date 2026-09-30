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
import { sql } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceMap } from "@/components/place-map";

type PlaceRow = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  full_desc: string | null;
  cover_url: string | null;
  gallery: string[] | null;
  lat: number | null;
  lng: number | null;
  season: string | null;
  is_free: boolean | null;
  how_to_get: string | null;
  tips: string | null;
  warnings: string | null;
  views: number | null;
  created_at: string;
  category_name: string | null;
  category_icon: string | null;
  author_name: string | null;
};

async function getPlace(slug: string): Promise<PlaceRow | null> {
  const rows = await sql<PlaceRow[]>`
    SELECT
      p.id,
      p.slug,
      p.title,
      p.short_desc,
      p.full_desc,
      p.cover_url,
      p.gallery,
      p.lat,
      p.lng,
      p.season,
      p.is_free,
      p.how_to_get,
      p.tips,
      p.warnings,
      p.views,
      p.created_at,
      c.name AS category_name,
      c.icon AS category_icon,
      COALESCE(pr.full_name, pr.username, 'Аноним') AS author_name
    FROM places p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN profiles pr ON pr.id = p.author_id
    WHERE p.slug = ${slug} AND p.status = 'published'
    LIMIT 1
  `;

  return rows[0] ?? null;
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: place.title,
    description,
    openGraph: {
      title: place.title,
      description,
      type: "article",
      url: `${siteUrl}/mesta/${place.slug}`,
      images: place.cover_url ? [place.cover_url] : undefined,
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

  // Увеличиваем счётчик просмотров (не блокируем рендер)
  sql`UPDATE places SET views = COALESCE(views, 0) + 1 WHERE id = ${place.id}`.catch(() => {});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
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

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          {place.category_name && (
            <Badge variant="secondary" className="bg-accent">
              {place.category_icon} {place.category_name}
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
          {place.author_name && (
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              {place.author_name}
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