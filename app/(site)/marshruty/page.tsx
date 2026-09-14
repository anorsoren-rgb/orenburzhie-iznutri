import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Route, Clock, Wallet, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Маршруты по Орску и Оренбуржью",
  description:
    "Готовые маршруты по Оренбургской области: на выходные, с детьми, фотомаршруты. Собери свой маршрут с GigaChat.",
};

const TRANSPORT_LABEL: Record<string, string> = {
  car: "На машине",
  walk: "Пешком",
  bike: "На велосипеде",
  mixed: "Смешанный",
};

export default async function RoutesPage() {
  const supabase = await createClient();

  const { data: routes } = await supabase
    .from("routes")
    .select(
      "id, slug, title, description, duration_min, budget_rub, transport, views, created_at"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const list = routes ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Маршруты
          </h1>
          <p className="mt-2 text-muted-foreground">
            Готовые маршруты по Оренбуржью — или собери свой с GigaChat.
          </p>
        </div>
        <Button asChild className="[&_svg]:size-5">
          <Link href="/sobrat-marshrut">
            <Sparkles />
            <span>Собрать маршрут</span>
          </Link>
        </Button>
      </header>

      {list.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Route className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-xl font-semibold">
              Маршрутов пока нет
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Собери первый маршрут из мест на сайте — GigaChat подскажет
              тайминг, бюджет и советы.
            </p>
            <Button asChild className="mt-2">
              <Link href="/sobrat-marshrut">Собрать маршрут</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((route) => (
            <Link
              key={route.id}
              href={`/marshruty/${route.slug}`}
              className="group"
            >
              <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="space-y-3 p-5">
                  <Badge variant="secondary" className="bg-accent">
                    <Route className="mr-1 h-3 w-3" />
                    Маршрут
                  </Badge>

                  <h2 className="font-display text-xl font-semibold leading-tight transition-colors group-hover:text-primary">
                    {route.title}
                  </h2>

                  {route.description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {route.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
                    {route.duration_min && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {Math.floor(route.duration_min / 60)} ч
                        {route.duration_min % 60 > 0 &&
                          ` ${route.duration_min % 60} мин`}
                      </span>
                    )}
                    {route.budget_rub !== null && (
                      <span className="flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5" />
                        ~{route.budget_rub.toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                    {route.transport && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {TRANSPORT_LABEL[route.transport] ?? route.transport}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}