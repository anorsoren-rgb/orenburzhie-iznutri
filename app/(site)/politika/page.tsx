import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика конфиденциальности проекта «Оренбуржье изнутри». Как мы собираем, используем и защищаем персональные данные.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Badge variant="secondary" className="bg-accent">
          <Shield className="mr-1 h-3 w-3" />
          Документ
        </Badge>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Политика конфиденциальности
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
              Настоящая политика конфиденциальности (далее — «Политика»)
              определяет порядок обработки и защиты персональных данных
              пользователей сайта{" "}
              <strong>orenburzhie-iznutri.ru</strong> (далее — «Сайт»).
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              Политика разработана в соответствии с Федеральным законом от
              27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              2. Какие данные мы собираем
            </h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Email</strong> — для регистрации и связи
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Имя</strong> — для отображения в профиле
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Хеш пароля</strong> — для входа в аккаунт (в
                  открытом виде не хранится)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Контент</strong> — места, легенды, фотографии,
                  которые вы добавляете
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Технические данные</strong> — cookies, IP-адрес,
                  user-agent (для аналитики)
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              3. Зачем мы собираем данные
            </h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Регистрация и вход в личный кабинет</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Публикация контента от вашего имени</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Связь с вами по вопросам модерации</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Улучшение работы сайта (аналитика)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              4. Где хранятся данные
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Все персональные данные хранятся на серверах, расположенных на
              территории Российской Федерации. Это соответствует
              требованиям 152-ФЗ о локализации персональных данных.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              5. Кто имеет доступ к данным
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Доступ к персональным данным имеет только администрация сайта.
              Мы не передаём данные третьим лицам, за исключением случаев,
              предусмотренных законодательством РФ.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              6. Cookies и аналитика
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Сайт использует cookies для работы сессий и анонимной
              аналитики (Яндекс.Метрика). Cookies не содержат персональных
              данных и не передаются третьим лицам.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              Ты можешь отключить cookies в настройках браузера, но тогда
              часть функций сайта может не работать.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              7. Твои права
            </h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Узнать, какие данные о тебе хранятся</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Исправить неточные данные</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Удалить аккаунт и все данные</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Отозвать согласие на обработку данных</span>
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Для реализации своих прав напиши нам на почту, указанную в
              подвале сайта.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">
              8. Изменения в политике
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              Мы можем обновлять эту политику. Актуальная версия всегда
              доступна на этой странице. При существенных изменениях
              уведомим пользователей на главной странице.
            </p>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}