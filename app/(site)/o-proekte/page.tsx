import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, BookOpen, Camera, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "«Оренбуржье изнутри» — народный гид по Оренбургской области. Места, легенды, маршруты и события от местных жителей.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Badge variant="secondary" className="bg-accent">
          <MapPin className="mr-1 h-3 w-3" />
          О проекте
        </Badge>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Оренбуржье изнутри
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Народный гид по Оренбургской области. Места, легенды, маршруты и
          события — от местных жителей.
        </p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Зачем этот проект
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              Оренбургская область — огромный регион с удивительной природой,
              историей и культурой. Но информации о нём часто не хватает:
              официальные путеводители устарели, а то, что знают местные,
              остаётся только в разговорах на кухне.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              «Оренбуржье изнутри» собирает это знание в одном месте —
              честно, без канцелярита и рекламных штампов.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Кто создаёт контент
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              Основной контент добавляют сами жители и путешественники. Они
              описывают места, делятся историями, загружают фотографии и
              отмечают точки на карте. Команда проекта помогает оформить и
              опубликовать материалы.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              Каждый материал проходит проверку модератором, чтобы на сайте
              не было спама, недостоверной информации и нарушений.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Что можно найти
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Места</strong> — достопримечательности, природа,
                  история, заброшки, места для детей
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Легенды</strong> — народные предания и истории
                  старожилов
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Маршруты</strong> — готовые и собранные вручную
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>События</strong> — афиша Оренбуржья
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Тесты</strong> — проверь свои знания о регионе
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Как помочь проекту
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              Если знаешь интересное место, историю или легенду — добавь её
              через форму на сайте. Мы опубликуем после проверки. Если
              заметил ошибку — сообщи, и мы исправим.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              «Оренбуржье изнутри» — народный проект. Без вас он не
              работает.
            </p>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}