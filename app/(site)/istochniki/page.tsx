import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  BookOpen,
  Map as MapIcon,
  Scale,
  Users,
  Globe,
  Landmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Источники и лицензии",
  description:
    "Правовая информация о фотографических, текстовых и картографических материалах, размещённых на сайте «Оренбуржье изнутри». Лицензии и порядок указания авторства.",
};

export default function SourcesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Badge variant="secondary" className="bg-accent">
          <Scale className="mr-1 h-3 w-3" />
          Правовая информация
        </Badge>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Источники и лицензии
        </h1>
        <p className="mt-3 text-muted-foreground">
          Администрация сайта уважает авторские и смежные права. На этой
          странице описаны источники материалов, размещённых на сайте, и
          порядок указания авторства. Если вы являетесь правообладателем и
          хотите изменить или удалить материал —{" "}
          <Link href="/o-proekte" className="text-primary hover:underline">
            свяжитесь с нами
          </Link>
          .
        </p>
      </header>

      <div className="space-y-6">
        {/* ФОТОГРАФИИ */}
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Фотографические материалы
              </h2>
            </div>

            <p className="text-sm text-foreground/90">
              Сайт использует фотографии из нескольких источников. Автор
              каждого конкретного снимка указывается непосредственно под
              фотографией или на странице материала.
            </p>

            <div className="space-y-4 text-sm">
              {/* 1. Пользователи сайта */}
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    Фотографии, загруженные пользователями Сайта
                  </p>
                </div>
                <p className="mt-1 text-muted-foreground">
                  <strong>Категория материалов:</strong> фотографии, которые
                  пользователи загружают через форму добавления материала.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Условия использования:</strong> материалы
                  публикуются исключительно с согласия правообладателя.
                  Загружая фотографию, пользователь подтверждает, что
                  является её автором или обладает разрешением
                  правообладателя на публикацию.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Указание авторства:</strong> автор фотографии
                  указывается на странице материала в подписи к снимку.
                </p>
              </div>

              {/* 2. Свободные лицензии */}
              <div className="border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    Фотографии под свободными лицензиями
                  </p>
                </div>
                <p className="mt-1 text-muted-foreground">
                  <strong>Категория материалов:</strong> фотографии,
                  размещённые в открытых фотостоках и на платформах с
                  лицензиями Creative Commons.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Лицензии:</strong> Creative Commons Attribution
                  (CC BY) различных версий, Unsplash License, Pexels
                  License, CC0 (Public Domain).
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Указание авторства:</strong> для фотографий под
                  лицензиями, требующими атрибуции (CC BY), имя автора и
                  ссылка на лицензию указываются на странице материала.
                  Для фотографий без требования атрибуции (CC0, Unsplash,
                  Pexels) указание автора — по желанию.
                </p>
              </div>

              {/* 3. Собственные фотографии */}
              <div className="border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    Собственные фотографии команды проекта
                  </p>
                </div>
                <p className="mt-1 text-muted-foreground">
                  <strong>Категория материалов:</strong> снимки, сделанные
                  авторами проекта «Оренбуржье изнутри» во время
                  путешествий и съёмок.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Условия использования:</strong> все права
                  принадлежат авторам. Использование возможно только с
                  письменного разрешения администрации Сайта.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ТЕКСТЫ */}
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Текстовые материалы и данные
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    Авторские тексты пользователей Сайта
                  </p>
                </div>
                <p className="mt-1 text-muted-foreground">
                  <strong>Категория материалов:</strong> описания мест,
                  легенды, истории, маршруты, добавленные пользователями.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Условия использования:</strong> при
                  цитировании обязательна ссылка на Сайт{" "}
                  <strong>orenburzhie-iznutri.ru</strong> и на страницу
                  первоисточника.
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    Фольклорные тексты и народные предания
                  </p>
                </div>
                <p className="mt-1 text-muted-foreground">
                  <strong>Правовой статус:</strong> произведения народного
                  творчества, записи XIX–XX вв. являются общественным
                  достоянием в соответствии со статьёй 1282 Гражданского
                  кодекса РФ.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Условия использования:</strong> свободное
                  использование без ограничений.
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    Энциклопедические и справочные данные
                  </p>
                </div>
                <p className="mt-1 text-muted-foreground">
                  <strong>Источники:</strong> открытые энциклопедии под
                  свободными лицензиями, официальные сайты государственных
                  органов, краеведческие публикации.
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Условия использования:</strong> материалы под
                  лицензией{" "}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    CC BY-SA 4.0
                  </a>{" "}
                  используются с обязательным указанием источника и
                  сохранением производных материалов под аналогичной
                  лицензией.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* КАРТЫ */}
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Картографические данные
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">
                  Правообладатель: OpenStreetMap contributors
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Категория материалов:</strong>{" "}
                  картографические данные, используемые в основе
                  интерактивных карт Сайта (Leaflet + OpenStreetMap).
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Лицензия:</strong>{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open Database License (ODbL) 1.0
                  </a>
                  .
                </p>
                <p className="mt-1 text-muted-foreground">
                  <strong>Условия использования:</strong> допускается
                  копирование, распространение и адаптация данных при
                  обязательном указании авторства OpenStreetMap
                  contributors и сохранении производных баз данных под
                  аналогичной лицензией.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ОБРАЩЕНИЕ ПРАВООБЛАДАТЕЛЯМ */}
        <Card className="border-border/60 bg-muted/40">
          <CardContent className="space-y-3 p-6 text-sm">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">
                Обращение правообладателей
              </h2>
            </div>
            <p className="text-muted-foreground">
              Если вы обнаружили на сайте материал, нарушающий ваши
              авторские или смежные права, направьте обращение
              администрации сайта с указанием:
            </p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>сведений о правообладателе (ФИО, контакты);</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>описания материала и его расположения на сайте;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>подтверждения ваших прав на материал;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  требования (удаление, указание авторства, корректировка).
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              Обращения рассматриваются в течение 10 рабочих дней.
              Администрация готова к досудебному урегулированию споров и
              незамедлительно реагирует на обоснованные претензии.
            </p>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}