import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/mesta`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/legendy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sobytiya`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/testy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/sobrat-marshrut`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/o-proekte`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/istochniki`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/politika`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Динамические страницы из БД
  try {
    const supabase = await createClient();

    // Места
    const { data: places } = await supabase
      .from("places")
      .select("slug, updated_at")
      .eq("status", "published");

    // Легенды
    const { data: legends } = await supabase
      .from("legends")
      .select("slug, updated_at")
      .eq("status", "published");

    // События
    const { data: events } = await supabase
      .from("events")
      .select("slug, starts_at")
      .in("status", ["published", "past"]);

    // Тесты
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("slug, created_at")
      .eq("status", "published");

    const placePages: MetadataRoute.Sitemap = (places ?? []).map((p) => ({
      url: `${siteUrl}/mesta/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const legendPages: MetadataRoute.Sitemap = (legends ?? []).map((l) => ({
      url: `${siteUrl}/legendy/${l.slug}`,
      lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const eventPages: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
      url: `${siteUrl}/sobytiya/${e.slug}`,
      lastModified: e.starts_at ? new Date(e.starts_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const quizPages: MetadataRoute.Sitemap = (quizzes ?? []).map((q) => ({
      url: `${siteUrl}/testy/${q.slug}`,
      lastModified: q.created_at ? new Date(q.created_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

    return [
      ...staticPages,
      ...placePages,
      ...legendPages,
      ...eventPages,
      ...quizPages,
    ];
  } catch (err) {
    // Если БД недоступна — возвращаем хотя бы статические
    console.error("[sitemap] Ошибка загрузки данных:", err);
    return staticPages;
  }
}