import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/profil/",
          "/login",
          "/register",
          "/mesta/*/edit",
        ],
      },
      // Яндекс — основные правила
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/profil/",
          "/login",
          "/register",
          "/mesta/*/edit",
        ],
        crawlDelay: 1,
      },
      // Запрещаем AI-ботам парсить контент
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}