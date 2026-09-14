import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Оренбуржье изнутри — народный гид по Орску и Оренбургской области",
    template: "%s | Оренбуржье изнутри",
  },

  description:
    "Места, истории, легенды, маршруты и события Орска и Оренбургской области. Умный гид на базе GigaChat: спроси про Орск — и получи ответ.",

  keywords: [
    "Орск",
    "Оренбургская область",
    "Оренбуржье",
    "достопримечательности Орска",
    "куда сходить в Орске",
    "маршруты по Оренбуржью",
    "легенды Оренбуржья",
    "Губерлинские горы",
    "Ириклинское водохранилище",
    "Орская крепость",
    "путешествия по Уралу",
  ],

  authors: [{ name: "Оренбуржье изнутри" }],
  creator: "Оренбуржье изнутри",
  publisher: "Оренбуржье изнутри",

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Оренбуржье изнутри",
    title: "Оренбуржье изнутри — народный гид по Орску и области",
    description:
      "Места, легенды, маршруты и события Орска и Оренбургской области. Умный гид на базе GigaChat.",
    images: [
      {
        url: "/og/default.svg",
        width: 1200,
        height: 630,
        alt: "Оренбуржье изнутри — народный гид по Орску и области",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Оренбуржье изнутри",
    description:
      "Места, легенды, маршруты и события Орска и Оренбургской области.",
    images: ["/og/default.svg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Оренбуржье изнутри",
  url: SITE_URL,
  logo: `${SITE_URL}/og/default.svg`,
  description:
    "Народный интерактивный гид по Орску и Оренбургской области: места, легенды, маршруты, события, тесты. Умный помощник на базе GigaChat.",
  foundingDate: "2026",
  areaServed: {
    "@type": "Place",
    name: "Оренбургская область",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Оренбуржье изнутри",
  url: SITE_URL,
  description:
    "Места, легенды, маршруты и события Орска и Оренбургской области.",
  inLanguage: "ru-RU",
  publisher: {
    "@type": "Organization",
    name: "Оренбуржье изнутри",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/default.svg`,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/mesta?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <JsonLd id="org" data={organizationJsonLd} />
        <JsonLd id="website" data={websiteJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
