import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Частые вопросы",
  description:
    "Ответы на частые вопросы о проекте «Оренбуржье изнутри»: как добавить место, кто проверяет контент, как работает GigaChat.",
};

const FAQ = [
  {
    q: "Что такое «Оренбуржье изнутри»?",
    a: "Это народный интерактивный гид по Орску и Оренбургской области. Места, легенды, маршруты и события добавляют сами пользователи — местные жители и путешественники.",
  },
  {
    q: "Это бесплатно?",
    a: "Да, полностью. Проект некоммерческий, регистрация и вся функциональность сайта бесплатны.",
  },
  {
    q: "Как добавить место?",
    a: "Зарегистрируйтесь, откройте страницу «Добавить место», опишите его в 2–3 строках — а GigaChat поможет развернуть в полноценную карточку с описанием, советами и тегами.",
  },
  {
    q: "Кто проверяет контент?",
    a: "Все материалы проходят модерацию. Мы проверяем факты, убираем спам и мат, следим за качеством. Автор видит статус своего места в личном кабинете.",
  },
  {
    q: "Что за GigaChat и зачем он тут?",
    a: "GigaChat — нейросеть от Сбера. В нашем проекте она работает как умный редактор: помогает оформить карточку места, создать тест по статье, собрать маршрут или ответить на вопрос о регионе. ИИ не заменяет автора, а помогает ему.",
  },
  {
    q: "Мои данные в безопасности?",
    a: "Да. Мы обрабатываем данные в соответствии с 152-ФЗ. Пароли хранятся в зашифрованном виде, данные не передаются третьим лицам. Подробнее — в Политике конфиденциальности.",
  },
  {
    q: "Можно ли использовать ваши материалы?",
    a: "Тексты, добавленные пользователями, можно использовать со ссылкой на источник. Фотографии — только с разрешения авторов. Подробнее — на странице «Источники и лицензии».",
  },
  {
    q: "Как связаться с командой?",
    a: "Пишите на hello@orenburzhie-iznutri.ru или в наш Telegram. Отвечаем в течение 1–2 дней.",
  },
  {
    q: "Хочу помочь проекту. Что делать?",
    a: "Самый простой способ — добавлять места, которые знаете. Ещё можно стать модератором, помочь с дизайном, написать статью или рассказать о проекте друзьям.",
  },
];

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Частые вопросы
        </h1>
        <p className="mt-3 text-muted-foreground">
          Всё, что чаще всего спрашивают о проекте.
        </p>
      </header>

      <div className="space-y-4">
        {FAQ.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/40"
          >
            <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:hidden">
              <span className="mr-2 text-primary">•</span>
              {item.q}
            </summary>
            <p className="mt-3 pl-4 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border/60 bg-muted/40 p-6 text-center text-sm">
        <p className="font-medium">Не нашли ответ?</p>
        <p className="mt-2 text-muted-foreground">
          Напишите на{" "}
          <a
            href="mailto:hello@orenburzhie-iznutri.ru"
            className="text-primary hover:underline"
          >
            hello@orenburzhie-iznutri.ru
          </a>{" "}
          — постараемся помочь.
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
