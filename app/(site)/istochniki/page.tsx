import type { Metadata } from "next";
import Link from "next/link";
import { Camera, BookOpen, Map, Sparkles, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Источники и лицензии",
  description:
    "Источники фотографий, текстов, карт и данных, использованных на сайте «Оренбуржье изнутри». Лицензии и авторы.",
};

export default function SourcesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Источники и лицензии
        </h1>
        <p className="mt-3 text-muted-foreground">
          Мы уважаем авторское право и указываем всех, чьими материалами
          пользуемся. Если ты автор и хочешь что-то изменить или удалить —{" "}
          <Link href="/o-proekte" className="text-primary hover:underline">
            напиши нам
          </Link>
          .
        </p>
      </header>

      <div className="space-y-6">
        {/* Фотографии */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Фотографии
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium">stepper88 / FotoTerra</p>
                <p className="mt-1 text-muted-foreground">
                  Фотографии природы Оренбургской области: Губерлинские горы,
                  Ириклинское водохранилище, окрестности Орска и Новотроицка.
                </p>
                <p className="mt-1 text-muted-foreground">
                  Лицензия:{" "}
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    CC BY 3.0
                  </a>{" "}
                  — свободное использование с указанием автора.
                </p>
                <a
                  href="https://fototerra.ru/Russia/Novotroitsk/Stepper88-10528.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Галерея автора на FotoTerra
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="border-t border-border/60 pt-4">
                <p className="font-medium">Unsplash</p>
                <p className="mt-1 text-muted-foreground">
                  Фотографии природы, степей, закатов, рек.
                </p>
                <p className="mt-1 text-muted-foreground">
                  Лицензия:{" "}
                  <a
                    href="https://unsplash.com/license"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Unsplash License
                  </a>{" "}
                  — свободное использование, указание автора не обязательно, но
                  мы стараемся указывать.
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <p className="font-medium">Pexels</p>
                <p className="mt-1 text-muted-foreground">
                  Стоковые фотографии природы и путешествий.
                </p>
                <p className="mt-1 text-muted-foreground">
                  Лицензия:{" "}
                  <a
                    href="https://www.pexels.com/license/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Pexels License
                  </a>{" "}
                  — свободное использование без указания автора.
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <p className="font-medium">Фотографии пользователей</p>
                <p className="mt-1 text-muted-foreground">
                  Фото, загруженные авторами проекта «Оренбуржье изнутри»,
                  публикуются с их согласия. Автор указан на странице места.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Тексты и данные */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Тексты и данные
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium">Материалы пользователей</p>
                <p className="mt-1 text-muted-foreground">
                  Истории, легенды и описания мест, добавленные авторами сайта.
                  При использовании указывайте ссылку на источник.
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <p className="font-medium">
                  Народные предания и легенды Оренбуржья
                </p>
                <p className="mt-1 text-muted-foreground">
                  Записи фольклорных экспедиций, краеведческие публикации
                  XIX–XX вв. Фольклорные тексты являются общественным
                  достоянием.
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <p className="font-medium">Энциклопедические данные</p>
                <p className="mt-1 text-muted-foreground">
                  Факты о географии, истории и культуре Оренбургской области
                  сверены с открытыми источниками:{" "}
                  <a
                    href="https://ruwiki.ru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Рувики
                  </a>{" "}
                  (CC BY 4.0), официальные сайты музеев и администраций.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Карты */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Картографические данные
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium">OpenStreetMap</p>
                <p className="mt-1 text-muted-foreground">
                  Основа для всех карт на сайте (Leaflet + OSM).
                </p>
                <p className="mt-1 text-muted-foreground">
                  Лицензия:{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ODbL 1.0
                  </a>{" "}
                  — открытая картографическая лицензия.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ИИ */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Искусственный интеллект
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium">GigaChat (Sber)</p>
                <p className="mt-1 text-muted-foreground">
                  Используется для помощи в редактировании, создания тестов,
                  маршрутов и модерации контента. ИИ не создаёт факты с нуля —
                  он работает с материалами, добавленными пользователями и
                  проверенными редакцией.
                </p>
                <a
                  href="https://giga.chat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                >
                  GigaChat
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Обратная связь */}
        <div className="rounded-lg border border-border/60 bg-muted/40 p-6 text-sm">
          <p className="font-medium">
            Ты автор и хочешь что-то изменить?
          </p>
          <p className="mt-2 text-muted-foreground">
            Если ты нашёл своё фото, текст или данные без указания авторства —
            напиши нам на почту, и мы немедленно исправим или удалим материал.
            Мы за открытость и уважение к авторам.
          </p>
          <p className="mt-2">
            <a
              href="mailto:hello@orenburzhie-iznutri.ru"
              className="text-primary hover:underline"
            >
              hello@orenburzhie-iznutri.ru
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
