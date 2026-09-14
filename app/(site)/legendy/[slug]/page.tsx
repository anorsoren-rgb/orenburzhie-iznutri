import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, Eye, MapPin, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getLegend(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("legends")
    .select(
      "id, slug, title, excerpt, body, source, views, created_at, place:places(id, slug, title)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const legend = await getLegend(slug);

  if (!legend) return { title: "Легенда не найдена" };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  return {
    title: legend.title,
    description: legend.excerpt ?? legend.title,
    alternates: { canonical: `/legendy/${legend.slug}` },
    openGraph: {
      title: legend.title,
      description: legend.excerpt ?? "",
      type: "article",
      url: `${siteUrl}/legendy/${legend.slug}`,
      images: [`${siteUrl}/og/default.svg`],
    },
    twitter: {
      card: "summary_large_image",
      title: legend.title,
      description: legend.excerpt ?? "",
      images: [`${siteUrl}/og/default.svg`],
    },
  };
}

export default async function LegendPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const legend = await getLegend(slug);

  if (!legend) notFound();

  const supabase = await createClient();
  supabase
    .from("legends")
    .update({ views: (legend.views ?? 0) + 1 })
    .eq("id", legend.id)
    .then(() => {});

  const place = legend.place as unknown as
    | { id: string; slug: string; title: string }
    | null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: legend.title,
    articleBody: legend.body,
    url: `${siteUrl}/legendy/${legend.slug}`,
    datePublished: legend.created_at,
    inLanguage: "ru-RU",
    author: { "@type": "Organization", name: "Оренбуржье изнутри" },
    publisher: {
      "@type": "Organization",
      name: "Оренбуржье изнутри",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og/default.svg`,
      },
    },
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
        name: "Легенды",
        item: `${siteUrl}/legendy`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: legend.title,
        item: `${siteUrl}/legendy/${legend.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/legendy">
          <ArrowLeft className="h-4 w-4" />
          Все легенды
        </Link>
      </Button>

      <header>
        <Badge variant="secondary" className="bg-accent">
          <BookOpen className="mr-1 h-3 w-3" />
          Легенда
        </Badge>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {legend.title}
        </h1>

        {legend.excerpt && (
          <p className="mt-4 text-lg italic text-muted-foreground">
            {legend.excerpt}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {place && (
            <Link
              href={`/mesta/${place.slug}`}
              className="flex items-center gap-1 hover:text-primary"
            >
              <MapPin className="h-4 w-4" />
              {place.title}
            </Link>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {legend.views ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(legend.created_at).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </header>

      <div className="mt-8 max-w-none whitespace-pre-wrap text-base leading-relaxed">
        {legend.body}
      </div>

      {legend.source && (
        <div className="mt-8 rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
          <strong>Источник:</strong> {legend.source}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/legendy">Читать другие легенды</Link>
        </Button>
      </div>
    </article>
  );
}
