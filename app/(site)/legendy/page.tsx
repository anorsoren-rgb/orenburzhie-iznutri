import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Eye, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Легенды Оренбуржья",
  description:
    "Народные легенды, мифы и предания Орска и Оренбургской области: Урал-батыр, Пугачёв, Гора Полковник и другие.",
};

export default async function LegendsPage() {
  const supabase = await createClient();

  const { data: legends } = await supabase
    .from("legends")
    .select(
      "id, slug, title, excerpt, body, views, created_at, place:places(id, slug, title)"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const list = legends ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Легенды Оренбуржья
        </h1>
        <p className="mt-2 text-muted-foreground">
          {list.length}{" "}
          {list.length === 1
            ? "легенда"
            : list.length >= 2 && list.length <= 4
            ? "легенды"
            : "легенд"}{" "}
          — народные предания, истории старожилов и мифы
        </p>
      </header>

      {list.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-xl font-semibold">
              Легенды скоро появятся
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Мы собираем истории старожилов и народные предания Орска. Скоро
              здесь будут первые легенды.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((legend) => {
            const place = legend.place as unknown as
              | { id: string; slug: string; title: string }
              | null;

            const readMin = Math.max(
              1,
              Math.round(((legend.body ?? "").split(/\s+/).length || 0) / 180)
            );

            return (
              <Link
                key={legend.id}
                href={`/legendy/${legend.slug}`}
                className="group"
              >
                <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="space-y-3 p-6">
                    <Badge variant="secondary" className="bg-accent">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Легенда
                    </Badge>

                    <h2 className="font-display text-xl font-semibold leading-tight transition-colors group-hover:text-primary">
                      {legend.title}
                    </h2>

                    {legend.excerpt && (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {legend.excerpt}
                      </p>
                    )}

                    {place && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {place.title}
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {readMin} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {legend.views ?? 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
