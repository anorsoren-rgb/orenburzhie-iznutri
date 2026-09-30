import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description:
    "Пользовательское соглашение проекта «Оренбуржье изнутри». Правила использования сайта, публикации контента и модерации.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Badge variant="secondary" className="bg-accent">
          <FileText className="mr-1 h-3 w-3" />
          Документ
        </Badge>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Пользовательское соглашение
        </h1>
        <p className="mt-3 text-muted-foreground">
          Последнее обновление: 30 сентября 2026
        </p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              1. Общие положения
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Настоящее Пользовательское соглашение (далее — «Соглашение»)
              регулирует отношения между администрацией сайта{" "}
              <strong>orenburzhie-iznutri.ru</strong> (далее — «Сайт») и
              пользователями Сайта.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              Используя Сайт, ты соглашаешься с условиями настоящего
              Соглашения. Если не согласен — пожалуйста, не используй Сайт.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              2. Что можно делать на Сайте
            </h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Читать материалы без регистрации</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Зарегистрироваться и добавлять места, легенды, события,
                  фотографии
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Собирать маршруты из мест</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Комментировать материалы и оставлять отзывы</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              3. Что запрещено
            </h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  Публиковать ложную, оскорбительную, экстремистскую
                  информацию
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>Загружать чужие фотографии без разрешения авторов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  Размещать рекламу, спам, ссылки на запрещённые ресурсы
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  Публиковать персональные данные третьих лиц без их согласия
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>Нарушать авторские права</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              4. Права на контент
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Ты сохраняешь авторские права на контент, который публикуешь на
              Сайте. Публикуя материал, ты даёшь администрации Сайта право
              на его использование, отображение и распространение в рамках
              работы Сайта.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              Ты гарантируешь, что твой контент не нарушает права третьих
              лиц и не содержит запрещённой информации.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              5. Модерация
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Администрация оставляет за собой право:
            </p>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Проверять любой добавленный контент</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Отклонять материалы без объяснения причин</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Редактировать текст (с сохранением смысла)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Блокировать пользователей за нарушения</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              6. Ответственность
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Сайт предоставляется «как есть». Администрация не несёт
              ответственности за:
            </p>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Точность информации, добавленной пользователями
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Возможные последствия использования информации с Сайта
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Временные перебои в работе Сайта</span>
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Перед поездкой в незнакомое место всегда проверяй информацию
              самостоятельно.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              7. Изменения в соглашении
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Администрация может изменять это Соглашение. Актуальная версия
              всегда на этой странице. Продолжая использовать Сайт после
              изменений, ты соглашаешься с новой редакцией.
            </p>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}