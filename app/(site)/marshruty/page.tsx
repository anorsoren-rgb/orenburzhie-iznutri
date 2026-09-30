import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "аршруты по ренбургской области",
  description:
    "отовые маршруты по ренбуржью: куда поехать на выходные, что посмотреть за день, как добраться.",
};

export default async function RoutesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          аршруты по ренбургской области
        </h1>
        <p className="mt-2 text-muted-foreground">
          отовые маршруты — выбирай, смотри, езжай.
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <Compass className="h-12 w-12 text-muted-foreground/40" />
          <p className="font-display text-xl font-semibold">
            аршрутов пока нет
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Скоро здесь появятся готовые маршруты по ренбуржью.  пока —
            собери свой из мест.
          </p>
          <Button asChild className="mt-2">
            <Link href="/sobrat-marshrut">Собрать свой маршрут</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}