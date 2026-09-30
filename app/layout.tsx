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
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Оренбуржье изнутри",
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