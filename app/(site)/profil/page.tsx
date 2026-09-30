import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Мой профиль",
  description: "Личный кабинет — управление своими материалами на сайте.",
};

type PlaceRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<
  string,
  { text: string; icon: React.ReactNode; cls: string }
> = {
  draft: {
    text: "Черновик",
    icon: <FileText className="h-3 w-3" />,
    cls: "bg-muted text-foreground",
  },
  pending: {
    text: "На модерации",
    icon: <Clock className="h-3 w-3" />,
    cls: "bg-ochre-100 text-ochre-700",
  },
  published: {
    text: "Опубликовано",
    icon: <CheckCircle2 className="h-3 w-3" />,
    cls: "bg-green-100 text-green-700",
  },
  rejected: {
    text: "Отклонено",
    icon: <XCircle className="h-3 w-3" />,
    cls: "bg-destructive/10 text-destructive",
  },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/profil");
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/login");

  const places = await sql<PlaceRow[]>`
    SELECT id, slug, title, status, created_at
    FROM places
    WHERE author_id = ${userId}
    ORDER BY created_at DESC
  `;

  const stats = {
    total: places.length,
    published: places.filter((p) => p.status === "published").length,
    pending: places.filter((p) => p.status === "pending").length,
    rejected: places.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ШАПКА ПРОФИЛЯ */}
      <header className="mb-8 rounded-xl border border-border/60 bg-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {(session.user.name ?? session.user.email ?? "?")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold">
              {session.user.name ?? "Пользователь"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/add">
              <Plus className="h-4 w-4" />
              Добавить место
            </Link>
          </Button>
        </div>
      </header>

      {/* СТАТИСТИКА */}
      <section className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Моя статистика
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-display text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">всего</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-green-700">
                {stats.published}
              </p>
              <p className="text-xs text-muted-foreground">опубликовано</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-ochre-600">
                {stats.pending}
              </p>
              <p className="text-xs text-muted-foreground">на модерации</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-destructive">
                {stats.rejected}
              </p>
              <p className="text-xs text-muted-foreground">отклонено</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* МОИ МЕСТА */}
      <section className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Мои места ({places.length})
        </h2>

        {places.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/40" />
              <p className="font-display text-lg font-semibold">
                Пока ничего не добавлено
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Добавь первое место — оно появится здесь и уйдёт на
                проверку модератору.
              </p>
              <Button asChild className="mt-2">
                <Link href="/add">
                  <Plus className="h-4 w-4" />
                  Добавить место
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {places.map((place) => {
              const status = STATUS_LABEL[place.status] ?? STATUS_LABEL.draft;
              return (
                <Card key={place.id} className="border-border/60">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={status.cls} variant="secondary">
                          {status.icon}
                          <span className="ml-1">{status.text}</span>
                        </Badge>
                      </div>
                      <p className="mt-2 font-medium">{place.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Добавлено:{" "}
                        {new Date(place.created_at).toLocaleDateString(
                          "ru-RU",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {place.status === "published" && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/mesta/${place.slug}`}>Открыть</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Как работает публикация
        </h2>
        <Card className="border-border/60">
          <CardContent className="space-y-3 p-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs">
                1
              </div>
              <div>
                <p className="font-medium">Добавляешь место</p>
                <p className="text-muted-foreground">
                  Заполняешь форму на странице{" "}
                  <Link href="/add" className="text-primary hover:underline">
                    /add
                  </Link>
                  . Описываешь место, добавляешь фото, указываешь
                  координаты.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs">
                2
              </div>
              <div>
                <p className="font-medium">Материал уходит на модерацию</p>
                <p className="text-muted-foreground">
                  Твой материал получает статус <strong>«На модерации»</strong>
                  . Модератор проверяет его на достоверность, отсутствие
                  спама и ошибок.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs">
                3
              </div>
              <div>
                <p className="font-medium">Публикация</p>
                <p className="text-muted-foreground">
                  Если всё в порядке — материал получает статус{" "}
                  <strong>«Опубликовано»</strong> и появляется на сайте.
                  Если есть замечания — модератор напишет тебе.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
              <p>
                <strong>Срок проверки:</strong> обычно 1–3 дня. Если
                материал срочный — напиши нам на почту.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* БЫСТРЫЕ ССЫЛКИ */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">
          Быстрые ссылки
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/add">
              <Plus className="h-4 w-4" />
              Добавить место
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/mesta">
              <MapPin className="h-4 w-4" />
              Смотреть все места
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/o-proekte">
              <UserIcon className="h-4 w-4" />
              О проекте
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/faq">
              <FileText className="h-4 w-4" />
              Вопросы и ответы
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}