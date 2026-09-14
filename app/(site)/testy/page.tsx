import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, MapPin, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Тесты о Орске и Оренбуржье",
  description:
    "Проверь, насколько хорошо ты знаешь Орск и Оренбургскую область. Викторины, созданные с помощью GigaChat.",
};

export default async function QuizzesPage() {
  const supabase = await createClient();

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(
      "id, slug, title, description, questions, created_by_gigachat, created_at, place:places(id, slug, title)"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const list = quizzes ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Проверь себя
        </h1>
        <p className="mt-2 text-muted-foreground">
          Викторины о Орске и Оренбургской области. Проверь свои знания и
          узнай новое.
        </p>
      </header>

      {list.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-xl font-semibold">
              Тестов пока нет
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Зайди на страницу любого места — там можно сгенерировать тест по
              нему через GigaChat.
            </p>
            <Button asChild className="mt-2">
              <Link href="/mesta">Смотреть места</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((quiz) => {
            const place = quiz.place as unknown as
              | { id: string; slug: string; title: string }
              | null;
            const questions = Array.isArray(quiz.questions)
              ? quiz.questions
              : [];

            return (
              <Link
                key={quiz.id}
                href={`/testy/${quiz.slug}`}
                className="group"
              >
                <Card className="h-full border-border/60 bg-gradient-to-br from-ochre-50 to-terracotta-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:from-deepblue-700 dark:to-deepblue-700">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-8 w-8 text-ochre-600" />
                      {quiz.created_by_gigachat && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          GigaChat
                        </Badge>
                      )}
                    </div>

                    <h2 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                      {quiz.title}
                    </h2>

                    {quiz.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {quiz.description}
                      </p>
                    )}

                    {place && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {place.title}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {questions.length} вопросов
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="[&_svg]:size-4"
                      >
                        <Play />
                        <span>Пройти</span>
                      </Button>
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
