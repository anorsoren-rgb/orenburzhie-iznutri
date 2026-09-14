"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  MapPin,
  Clock,
  Wallet,
  Car,
  Footprints,
  Bike,
  Route as RouteIcon,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Place = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  category_name: string | null;
  category_icon: string | null;
};

type Step = {
  place_index: number;
  arrival: string;
  duration_min: number;
  activity: string;
  tips: string;
};

type RouteData = {
  title: string;
  description: string;
  duration_min: number;
  budget_rub: number;
  transport: "car" | "walk" | "bike" | "mixed";
  steps: Step[];
  overall_tips: string;
};

const TRANSPORT_LABEL: Record<string, string> = {
  car: "На машине",
  walk: "Пешком",
  bike: "На велосипеде",
  mixed: "Смешанный",
};

const TRANSPORT_ICON: Record<string, React.ReactNode> = {
  car: <Car className="h-4 w-4" />,
  walk: <Footprints className="h-4 w-4" />,
  bike: <Bike className="h-4 w-4" />,
  mixed: <RouteIcon className="h-4 w-4" />,
};

export function RouteBuilder({ places }: { places: Place[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function build() {
    if (selected.length < 2 || loading) return;

    setLoading(true);
    setError(null);
    setRoute(null);

    try {
      const res = await fetch("/api/gigachat/route-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_ids: selected }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Не удалось собрать маршрут");
      }

      setRoute(data.data as RouteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Выбор мест */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">
            1. Выбери 2–5 мест
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {places.map((p) => {
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {isSelected && "✓"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.title}</p>
                    {p.category_name && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.category_icon} {p.category_name}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              onClick={build}
              disabled={selected.length < 2 || loading}
              className="[&_svg]:size-5"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>GigaChat строит маршрут (10–25 сек)...</span>
                </>
              ) : (
                <>
                  <Sparkles />
                  <span>Собрать маршрут ({selected.length})</span>
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Выбрано: {selected.length} из {places.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ошибка */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Результат */}
      {route && (
        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <Badge variant="secondary" className="bg-accent">
                <RouteIcon className="mr-1 h-3 w-3" />
                Маршрут готов
              </Badge>
              <h2 className="mt-3 font-display text-2xl font-bold">
                {route.title}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {route.description}
              </p>
            </div>

            {/* Метрики */}
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5">
                <Clock className="h-4 w-4" />
                {Math.floor(route.duration_min / 60)} ч{" "}
                {route.duration_min % 60} мин
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5">
                <Wallet className="h-4 w-4" />
                ~{route.budget_rub.toLocaleString("ru-RU")} ₽
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5">
                {TRANSPORT_ICON[route.transport]}
                {TRANSPORT_LABEL[route.transport]}
              </span>
            </div>

            {/* Шаги */}
            <div className="space-y-3">
              <h3 className="font-display font-semibold">Этапы</h3>
              {route.steps.map((step, i) => {
                const place = places[step.place_index];
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {i + 1}
                        </div>
                        <p className="font-semibold">
                          {place?.title ?? `Место #${step.place_index + 1}`}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {step.arrival} · {step.duration_min} мин
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{step.activity}</p>
                    {step.tips && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        💡 {step.tips}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Общие советы */}
            {route.overall_tips && (
              <div className="rounded-lg bg-accent/40 p-4">
                <h3 className="font-display font-semibold">Общие советы</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {route.overall_tips}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams();
                  selected.forEach((id) => params.append("place", id));
                  window.location.href = `/sobrat-marshrut/pdf?${params.toString()}`;
                }}
                disabled
                title="Скоро"
              >
                📄 Скачать PDF
              </Button>
              <Button asChild variant="outline">
                <Link href="/mesta">Смотреть места</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}