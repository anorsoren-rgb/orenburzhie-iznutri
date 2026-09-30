"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Sparkles, Loader2, MapPin, Clock, Route as RouteIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RouteMap = dynamic(() => import("@/components/route-map").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

type Place = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  category_name: string | null;
  category_icon: string | null;
  lat: number | null;
  lng: number | null;
};

type Stop = Place & {
  order: number;
  distanceFromPrev: number; // км
  travelMinutesFromPrev: number;
};

const AVG_SPEED_KMH = 60; // средняя скорость по трассе
const STOP_MINUTES = 45; // сколько минут проводят на месте

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Жадный алгоритм: начинаем с первого выбранного, каждый раз едем к ближайшему из оставшихся
function buildGreedyRoute(places: Place[]): Stop[] {
  const withCoords = places.filter((p) => p.lat !== null && p.lng !== null);
  const withoutCoords = places.filter((p) => p.lat === null || p.lng === null);

  if (withCoords.length === 0) return [];

  const result: Stop[] = [];
  const remaining = [...withCoords];
  let current = remaining.shift()!;

  result.push({
    ...current,
    order: 0,
    distanceFromPrev: 0,
    travelMinutesFromPrev: 0,
  });

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const d = haversine(current.lat!, current.lng!, remaining[i].lat!, remaining[i].lng!);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }

    const next = remaining.splice(nearestIdx, 1)[0];
    result.push({
      ...next,
      order: result.length,
      distanceFromPrev: nearestDist,
      travelMinutesFromPrev: Math.round((nearestDist / AVG_SPEED_KMH) * 60),
    });
    current = next;
  }

  // Места без координат добавляем в конец (без расчёта)
  withoutCoords.forEach((p) => {
    result.push({
      ...p,
      order: result.length,
      distanceFromPrev: 0,
      travelMinutesFromPrev: 0,
    });
  });

  return result;
}

export function RouteBuilder({ places }: { places: Place[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [route, setRoute] = useState<Stop[] | null>(null);
  const [building, setBuilding] = useState(false);

  function toggle(id: string) {
    setRoute(null);
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 6
        ? prev
        : [...prev, id]
    );
  }

  function build() {
    if (selected.length < 2) return;
    setBuilding(true);

    const chosen = places.filter((p) => selected.includes(p.id));
    // Начинаем с самого западного (меньшая долгота) — так логичнее для «утреннего старта»
    chosen.sort((a, b) => (a.lng ?? 0) - (b.lng ?? 0));

    const built = buildGreedyRoute(chosen);

    // Искусственная задержка для UX (чтобы был «эффект»)
    setTimeout(() => {
      setRoute(built);
      setBuilding(false);
    }, 600);
  }

  const totalDistance = useMemo(() => {
    if (!route) return 0;
    return route.reduce((sum, s) => sum + s.distanceFromPrev, 0);
  }, [route]);

  const totalTravelMinutes = useMemo(() => {
    if (!route) return 0;
    return route.reduce((sum, s) => sum + s.travelMinutesFromPrev, 0);
  }, [route]);

  const totalMinutes = totalTravelMinutes + (route?.length ?? 0) * STOP_MINUTES;

  return (
    <div className="space-y-6">
      {/* ВЫБОР МЕСТ */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold">
            1. Выбери места
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            От 2 до 6 мест. Мы построим маршрут так, чтобы было удобно и логично
            ехать.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {places.map((place) => {
              const isSelected = selected.includes(place.id);
              const hasCoords = place.lat !== null && place.lng !== null;

              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => toggle(place.id)}
                  className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent/40"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {isSelected && <span className="text-xs">✓</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {place.category_icon && (
                        <span className="text-sm">{place.category_icon}</span>
                      )}
                      <p className="truncate font-medium">{place.title}</p>
                    </div>
                    {place.short_desc && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {place.short_desc}
                      </p>
                    )}
                    {!hasCoords && (
                      <p className="mt-1 text-xs text-destructive">
                        ⚠ Нет координат — не попадёт в карту
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={build}
              disabled={selected.length < 2 || building}
              size="lg"
              className="[&_svg]:size-5"
            >
              {building ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Строим маршрут...</span>
                </>
              ) : (
                <>
                  <Sparkles />
                  <span>Собрать маршрут</span>
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              Выбрано: {selected.length} из 6
            </span>
          </div>
        </CardContent>
      </Card>

      {/* РЕЗУЛЬТАТ */}
      {route && route.length > 0 && (
        <>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">
                2. Твой маршрут
              </h2>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/40 p-3">
                  <RouteIcon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 font-display text-xl font-bold">
                    {totalDistance.toFixed(0)} км
                  </p>
                  <p className="text-xs text-muted-foreground">расстояние</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <Clock className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 font-display text-xl font-bold">
                    {Math.floor(totalMinutes / 60)} ч {totalMinutes % 60} м
                  </p>
                  <p className="text-xs text-muted-foreground">всего времени</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <MapPin className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 font-display text-xl font-bold">
                    {route.length}
                  </p>
                  <p className="text-xs text-muted-foreground">остановок</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Расчёт примерный: средняя скорость 60 км/ч + 45 минут на каждое
                место.
              </p>
            </CardContent>
          </Card>

          <RouteMap stops={route} />

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-semibold">
                Порядок посещения
              </h3>

              <div className="mt-4 space-y-3">
                {route.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-start gap-3 rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                      {stop.order + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/mesta/${stop.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {stop.title}
                      </Link>
                      {stop.short_desc && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {stop.short_desc}
                        </p>
                      )}
                      {stop.order > 0 && stop.distanceFromPrev > 0 && (
                        <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            🚗 {stop.distanceFromPrev.toFixed(0)} км от
                            предыдущего
                          </span>
                          <span>·</span>
                          <span>≈ {stop.travelMinutesFromPrev} мин в пути</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/mesta">
                    Посмотреть все места
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}