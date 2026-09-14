import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Sparkles, Users, Heart, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "«Оренбуржье изнутри» — народный интерактивный гид по Орску и Оренбургской области. История проекта, цели и как присоединиться.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          О проекте
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          «Оренбуржье изнутри» — народный гид по Орску и Оренбургской области,
          который пишут сами жители.
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed">
        <h2 className="mt-8 font-display text-2xl font-semibold">
          Зачем мы это делаем
        </h2>
        <p className="mt-3">
          Оренбуржье — огромный и удивительный регион. Здесь есть и горы, и
          степи, и Урал-река, разделяющая Европу и Азию, и древние легенды о
          Пугачёве, и заброшенные крепости, и Ириклинское водохранилище с
          закатами, которые невозможно забыть. Но информации об этих местах в
          интернете либо мало, либо она разбросана по десяткам сайтов.
        </p>
        <p className="mt-3">
          Мы хотим собрать всё в одном месте — и рассказать о родном крае
          честно, изнутри. Без канцелярита, без «официальных» текстов из
          путеводителей 80-х. Так, как рассказывают своим друзьям.
        </p>

        <h2 className="mt-8 font-display text-2xl font-semibold">
          Как это работает
        </h2>
        <p className="mt-3">
          Основной контент создают пользователи. Вы добавляете места, легенды,
          фотографии, отмечаете их на карте — а мы помогаем оформить и
          опубликовать.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-semibold">
                Живые истории
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Места, которые знают и любят местные жители, а не только
                туристические сайты.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-5">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-semibold">
                Помощь GigaChat
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Умный редактор помогает оформить карточку, создать тест или
                маршрут — быстрее и качественнее.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-5">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-semibold">
                Сообщество
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Авторы получают рейтинг и репутацию. Лучшие — бейдж
                «Проверенный краевед».
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-5">
              <Heart className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-semibold">
                Для людей
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Проект некоммерческий. Мы не продаём данные и не показываем
                навязчивую рекламу.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-8 font-display text-2xl font-semibold">
          Как присоединиться
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <Link
              href="/register"
              className="text-primary hover:underline"
            >
              Зарегистрируйтесь
            </Link>{" "}
            — это займёт минуту.
          </li>
          <li>
            <Link href="/add" className="text-primary hover:underline">
              Добавьте место
            </Link>
            , которое знаете и любите.
          </li>
          <li>
            Расскажите о проекте друзьям — это лучший способ помочь.
          </li>
        </ul>

        <h2 className="mt-8 font-display text-2xl font-semibold">
          Редакционная политика
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            Весь пользовательский контент проходит модерацию — мы проверяем
            факты и удаляем спам.
          </li>
          <li>
            Мы указываем авторов материалов и источники информации.
          </li>
          <li>
            Если вы нашли ошибку или неточность —{" "}
            <a
              href="mailto:hello@orenburzhie-iznutri.ru"
              className="text-primary hover:underline"
            >
              напишите нам
            </a>
            .
          </li>
        </ul>

        <h2 className="mt-8 font-display text-2xl font-semibold">
          Команда
        </h2>
        <p className="mt-3">
          Проект делает небольшая команда энтузиастов из Орска и Оренбурга.
          Хотите помочь? Пишите — мы всегда рады новым авторам, редакторам и
          фотографам.
        </p>
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← На главную
        </Link>
      </div>
    </article>
  );
}
