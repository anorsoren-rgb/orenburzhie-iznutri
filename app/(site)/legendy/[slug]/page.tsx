import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, Eye, MapPin, Calendar } from "lucide-react";
import { sql } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type LegendRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  source: string | null;
  views: number | null;
  created_at: string;
  place_slug: string | null;
  place_title: string | null;
};

async function getLegend(slug: string): Promise<LegendRow | null> {
  const rows = await sql<LegendRow[]>`
    SELECT
      l.id,
      l.slug,
      l.title,
      l.excerpt,
      l.body,
      l.source,
      l.views,
      l.created_at,
      p.slug  AS place_slug,
      p.title AS place_title
    FROM legends l
    LEFT JOIN places p ON p.id = l.place_id
    WHERE l.slug = ${slug} AND l.status = 'published'
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
  const legend = await getLegend(slug);

  if (!legend) return { title: "Легенда не найдена" };

  return {
    title: legend.title,
    description: legend.excerpt ?? legend.title,
    openGraph: {
      title: legend.title,
      description: legend.excerpt ?? "",
      type: "article",
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

  sql`UPDATE legends SET views = COALESCE(views, 0) + 1 WHERE id = ${legend.id}`.catch(() => {});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: legend.title,
    articleBody: legend.body,
    url: `${siteUrl}/legendy/${legend.slug}`,
    datePublished: legend.created_at,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          {legend.place_title && legend.place_slug && (
            <Link
              href={`/mesta/${legend.place_slug}`}
              className="flex items-center gap-1 hover:text-primary"
            >
              <MapPin className="h-4 w-4" />
              {legend.place_title}
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