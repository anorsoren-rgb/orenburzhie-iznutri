"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Category = { id: number; slug: string; name: string; icon: string | null };

type Props = {
  categories: Category[];
};

export function PlaceFilters({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeSeason = searchParams.get("season");
  const activeFree = searchParams.get("free");
  const activeQuery = searchParams.get("q");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = activeCategory || activeSeason || activeFree || activeQuery;

  return (
    <div className="space-y-4">
      {/* Категории */}
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Категория
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam("category", cat.slug)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                activeCategory === cat.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Сезон + бесплатно */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">Сезон:</p>
        {[
          { value: "all", label: "Круглый год" },
          { value: "winter", label: "Зима" },
          { value: "spring", label: "Весна" },
          { value: "summer", label: "Лето" },
          { value: "autumn", label: "Осень" },
        ].map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => updateParam("season", s.value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              activeSeason === s.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            }`}
          >
            {s.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => updateParam("free", "1")}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            activeFree === "1"
              ? "border-ochre-600 bg-ochre-500 text-white"
              : "border-border bg-background hover:bg-accent"
          }`}
        >
          💰 Бесплатно
        </button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="ml-2 [&_svg]:size-4"
          >
            <X />
            <span>Сбросить</span>
          </Button>
        )}
      </div>
    </div>
  );
}