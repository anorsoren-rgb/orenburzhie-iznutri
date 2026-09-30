import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, MapPin, Play } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Тесты об Оренбуржье",
  description:
    "Проверь, насколько хорошо ты знаешь Оренбургскую область. Викторины о местах, легендах и истории региона.",
};

type QuizRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  questions: unknown;
  created_by_gigachat: boolean | null;
  created_at: string;
  place_slug: string | null;
  place_title: string | null;
};

export default async function QuizzesPage() {
  const quizzes = await sql<QuizRow[]>`
    SELECT
      q.id,
      q.slug,
      q.title,
      q.description,
      q.questions,
      q.created_by_gigachat,
      q.created_at,
      p.slug  AS place_slug,
      p.title AS place_title
    FROM quizzes q
    LEFT JOIN places p ON p.id = q.place_id
    WHERE q.status = 'published'
    ORDER BY q.created_at DESC
  `;

  const list = quizzes;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Проверь себя
        </h1>
        <p className="mt-2 text-muted-foreground">
          Викторины об Оренбургской области. Проверь свои знания и узнай
          новое.
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
              Скоро здесь появятся викторины о местах и легендах Оренбуржья.
            </p>
            <Button asChild className="mt-2">
              <Link href="/mesta">Смотреть места</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((quiz) => {
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
                          ИИ
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

                    {quiz.place_title && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {quiz.place_title}
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