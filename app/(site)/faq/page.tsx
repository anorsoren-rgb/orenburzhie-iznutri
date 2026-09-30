import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description:
    "Частые вопросы о проекте «Оренбуржье изнутри»: как добавить место, как работает модерация, как связаться с нами.",
};

const FAQ = [
  {
    q: "Что такое «Оренбуржье изнутри»?",
    a: "Это народный гид по Оренбургской области. Здесь собраны места, легенды, маршруты и события региона — то, что обычно знают только местные. Контент создают сами пользователи, а команда проекта помогает его оформить и проверить.",
  },
  {
    q: "Кто может добавлять места?",
    a: "Любой зарегистрированный пользователь. Зарегистрируйся, зайди в раздел «Добавить место», заполни форму — и твой материал появится на сайте после проверки модератором.",
  },
  {
    q: "Как проходит модерация?",
    a: "Каждый новый материал проверяется вручную. Мы смотрим, чтобы информация была достоверной, без спама, рекламы, мата и оскорблений. Если что-то не так — попросим исправить или отклоним.",
  },
  {
    q: "Сколько ждать публикации?",
    a: "Обычно 1–3 дня. Если материал срочный или важный — напиши нам на почту, ускорим.",
  },
  {
    q: "Можно ли добавить фото?",
    a: "Да, к каждому месту можно прикрепить до 5 фотографий. Первое фото станет обложкой. Убедись, что у тебя есть права на эти снимки — не загружай чужие фото без разрешения.",
  },
  {
    q: "Что делать, если я нашёл ошибку?",
    a: "Напиши нам на почту или через форму обратной связи. Мы быстро исправим.",
  },
  {
    q: "Как связаться с командой?",
    a: "Почта для связи — указана в подвале сайта. Отвечаем в течение 2–3 дней.",
  },
  {
    q: "Проект коммерческий?",
    a: "Проект развивается на энтузиазме команды. Мы не продаём места и не берём деньги за публикацию. Если хочешь поддержать проект — напиши нам, расскажем как.",
  },
];

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Badge variant="secondary" className="bg-accent">
          <HelpCircle className="mr-1 h-3 w-3" />
          FAQ
        </Badge>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Вопросы и ответы
        </h1>
        <p className="mt-3 text-muted-foreground">
          Частые вопросы о проекте. Если не нашёл ответ — напиши нам.
        </p>
      </header>

      <div className="space-y-4">
        {FAQ.map((item, i) => (
          <Card key={i} className="border-border/60">
            <CardContent className="space-y-2 p-6">
              <h2 className="font-display text-lg font-semibold">
                {item.q}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/90">
                {item.a}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-border/60 bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Не нашёл ответ на свой вопрос?
        </p>
        <Button asChild className="mt-3">
          <Link href="/o-proekte">Написать нам</Link>
        </Button>
      </div>
    </article>
  );
}