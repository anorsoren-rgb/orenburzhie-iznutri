import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Оренбуржье изнутри — народный гид по Оренбургской области",
    template: "%s | Оренбуржье изнутри",
  },
  description:
    "Места, истории, легенды, маршруты и события Оренбургской области. Народный гид по Оренбуржью.",
  keywords: [
    "Оренбургская область",
    "Оренбуржье",
    "достопримечательности Оренбуржья",
    "куда сходить в Оренбурге",
    "маршруты по Оренбуржью",
    "Соль-Илецк",
    "Губерлинские горы",
    "Ириклинское водохранилище",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Оренбуржье изнутри",
    title: "Оренбуржье изнутри — народный гид по Оренбургской области",
    description:
      "Места, истории, легенды, маршруты и события Оренбургской области.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Оренбуржье изнутри",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Оренбуржье изнутри",
    description:
      "Места, истории, легенды, маршруты и события Оренбургской области.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}