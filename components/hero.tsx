import Link from "next/link";
import { Search, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  return (
    <section className="relative overflow-hidden sunrise-gradient dark:sunrise-gradient-dark">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-4 py-1.5 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Умный гид на базе GigaChat</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Оренбуржье{" "}
            <span className="bg-gradient-to-r from-terracotta-600 via-ochre-600 to-steppe-700 bg-clip-text text-transparent">
              изнутри
            </span>
          </h1>

          <p className="mt-6 text-lg text-foreground/80 sm:text-xl">
            Места, легенды, маршруты и события Орска и Оренбургской области —
            от местных жителей. Спроси про Орск — и получи живой ответ.
          </p>

          {/* Поиск */}
          <form
            action="/mesta"
            method="get"
            className="mx-auto mt-8 flex max-w-xl gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Найти место, легенду, событие..."
                className="h-12 bg-background/90 pl-10 text-base backdrop-blur"
              />
            </div>
            <Button type="submit" size="lg" className="h-12">
              Найти
            </Button>
          </form>

          {/* CTA кнопки */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline" size="lg" className="bg-background/70 backdrop-blur">
              <Link href="/mesta">
                <MapPin className="mr-2 h-5 w-5" />
                Все места
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/sobrat-marshrut">
                <Sparkles className="mr-2 h-5 w-5" />
                Собрать маршрут
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Декоративный градиент снизу, чтобы плавно переходил в фон */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
