import Link from "next/link";
import { Hero } from "@/components/hero";
import { ChatWidget } from "@/components/chat-widget";
import { PlaceCard, type Place } from "@/components/place-card";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Sparkles, BookOpen, Trophy } from "lucide-react";

const TOP_PLACES: Place[] = [
  {
    id: "1",
    slug: "guberlinskie-gory",
    title: "Губерлинские горы",
    shortDesc:
      "Живописные холмы и скалы в 60 км от Орска. Идеально для выходных: пешие прогулки, фотографии, палаточный лагерь.",
    category: "Природа",
    tags: ["горы", "поход", "фото"],
    views: 1243,
    isFree: true,
  },
  {
    id: "2",
    slug: "iriklinskoe-vodohranilishche",
    title: "Ириклинское водохранилище",
    shortDesc:
      "Одно из крупнейших водохранилищ Урала. Рыбалка, кайтсёрфинг, песчаные пляжи и закаты, которые невозможно забыть.",
    category: "Природа",
    tags: ["озеро", "рыбалка", "пляж"],
    views: 987,
    isFree: true,
  },
  {
    id: "3",
    slug: "orskaia-krepost",
    title: "Орская крепость",
    shortDesc:
      "Историческое место основания города. Сохранились валы, рядом — краеведческий музей и старинные улицы.",
    category: "История",
    tags: ["история", "музей", "XVIII век"],
    views: 654,
  },
  {
    id: "4",
    slug: "gora-polkovnik",
    title: "Гора Полковник",
    shortDesc:
      "Место силы с панорамным видом на Орск. Легенда гласит: здесь стоял лагерем сам Емельян Пугачёв.",
    category: "Легенды",
    tags: ["легенды", "вид", "панорама"],
    views: 512,
  },
];

const LATEST_LEGENDS = [
  {
    slug: "legenda-o-urale-batyre",
    title: "Легенда о Урал-батыре",
    excerpt:
      "Почему река Урал разделяет Европу и Азию, и как древний батыр пожертвовал собой ради людей.",
    readTime: 5,
  },
  {
    slug: "taina-orskoi-kreposti",
    title: "Тайна Орской крепости",
    excerpt:
      "Подземные ходы, клады и призраки — что рассказывают старожилы о первых годах города.",
    readTime: 7,
  },
  {
    slug: "gde-zhivet-echo",
    title: "Где живёт эхо",
    excerpt:
      "Легенды Губерлинских гор: почему в ущельях слышны голоса, и кто их на самом деле издаёт.",
    readTime: 4,
  },
];

const QUIZZES = [
  {
    slug: "znayu-li-ya-orsk",
    title: "Знаю ли я Орск?",
    questions: 10,
    difficulty: "Легко",
  },
  {
    slug: "legendy-orenburzhya",
    title: "Легенды Оренбуржья",
    questions: 8,
    difficulty: "Средне",
  },
  {
    slug: "priroda-urala",
    title: "Природа Урала",
    questions: 12,
    difficulty: "Сложно",
  },
];

const EVENTS = [
  {
    slug: "den-goroda-orsk",
    title: "День города Орска",
    date: "2026-08-15",
    place: "Центральная площадь",
  },
  {
    slug: "festival-stepnoi-veter",
    title: "Фестиваль «Степной ветер»",
    date: "2026-09-05",
    place: "Губерлинские горы",
  },
];

export default function HomePage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Оренбуржье изнутри",
    url: siteUrl,
    logo: `${siteUrl}/og/default.svg`,
    description:
      "Народный интерактивный гид по Орску и Оренбургской области: места, легенды, маршруты, события, тесты. Умный помощник на базе GigaChat.",
    foundingDate: "2026",
    areaServed: {
      "@type": "Place",
      name: "Оренбургская область",
    },
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Оренбуржье изнутри",
    url: siteUrl,
    description:
      "Места, легенды, маршруты и события Орска и Оренбургской области.",
    inLanguage: "ru-RU",
    publisher: {
      "@type": "Organization",
      name: "Оренбуржье изнутри",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og/default.svg`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/mesta?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <Hero />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Топ-места Орска и области" href="/mesta" />
            <div className="grid gap-6 sm:grid-cols-2">
              {TOP_PLACES.map((place, i) => (
                <PlaceCard key={place.id} place={place} priority={i < 2} />
              ))}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ChatWidget />
            </div>
          </aside>
        </section>

        <section className="mt-20">
          <SectionHeader title="Свежие истории и легенды" href="/legendy" />
          <div className="grid gap-6 md:grid-cols-3">
            {LATEST_LEGENDS.map((legend) => (
              <Link
                key={legend.slug}
                href={`/legendy/${legend.slug}`}
                className="group"
              >
                <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="space-y-3 p-5">
                    <Badge variant="secondary" className="bg-accent">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Легенда
                    </Badge>
                    <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                      {legend.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {legend.excerpt}
                    </p>
                    <div className="flex items-center gap-1 pt-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {legend.readTime} мин чтения
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeader title="Проверь себя" href="/testy" />
          <div className="grid gap-6 md:grid-cols-3">
            {QUIZZES.map((quiz) => (
              <Link key={quiz.slug} href={`/testy/${quiz.slug}`} className="group">
                <Card className="h-full border-border/60 bg-gradient-to-br from-ochre-50 to-terracotta-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:from-deepblue-700 dark:to-deepblue-700">
                  <CardContent className="space-y-3 p-5">
                    <Trophy className="h-8 w-8 text-ochre-600" />
                    <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{quiz.questions} вопросов</span>
                      <Badge variant="outline">{quiz.difficulty}</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Пройти тест
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeader title="Ближайшие события" href="/sobytiya" />
          <div className="grid gap-4 md:grid-cols-2">
            {EVENTS.map((ev) => (
              <Link key={ev.slug} href={`/sobytiya/${ev.slug}`}>
                <Card className="border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <span className="text-lg font-bold leading-none">
                        {new Date(ev.date).getDate()}
                      </span>
                      <span className="text-[10px] uppercase">
                        {new Date(ev.date).toLocaleDateString("ru-RU", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold">{ev.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {ev.place}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Card className="overflow-hidden border-0 sunrise-gradient dark:sunrise-gradient-dark">
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center sm:p-14">
              <Sparkles className="h-10 w-10 text-primary" />
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Не знаешь, с чего начать?
              </h2>
              <p className="max-w-xl text-foreground/80">
                Выбери 3–5 мест — GigaChat соберёт маршрут с таймингом, бюджетом и
                советами. Экспортируй в PDF или GPX для навигатора.
              </p>
              <Button asChild size="lg" className="mt-2 [&_svg]:size-5">
                <Link
                  href="/sobrat-marshrut"
                  className="inline-flex items-center gap-2"
                >
                  <Sparkles />
                  <span>Собрать маршрут</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
