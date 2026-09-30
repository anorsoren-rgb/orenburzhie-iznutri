import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Trophy, Sparkles, MapPin } from "lucide-react";
import { sql } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizRunner } from "@/components/quiz-runner";

type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

type QuizRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  questions: unknown;
  created_by_gigachat: boolean | null;
  place_slug: string | null;
  place_title: string | null;
};

async function getQuiz(slug: string): Promise<QuizRow | null> {
  const rows = await sql<QuizRow[]>`
    SELECT
      q.id,
      q.slug,
      q.title,
      q.description,
      q.questions,
      q.created_by_gigachat,
      p.slug  AS place_slug,
      p.title AS place_title
    FROM quizzes q
    LEFT JOIN places p ON p.id = q.place_id
    WHERE q.slug = ${slug} AND q.status = 'published'
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  if (!quiz) return { title: "Тест не найден" };

  return {
    title: quiz.title,
    description: quiz.description ?? `Викторина: ${quiz.title}`,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  if (!quiz) notFound();

  const questions = Array.isArray(quiz.questions)
    ? (quiz.questions as Question[])
    : [];

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          У этого теста нет вопросов. Попробуй другой.
        </p>
        <Button asChild className="mt-4">
          <Link href="/testy">Все тесты</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/testy">
          <ArrowLeft className="h-4 w-4" />
          Все тесты
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-accent">
            <Trophy className="mr-1 h-3 w-3" />
            Викторина
          </Badge>
          {quiz.created_by_gigachat && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              Создано GigaChat
            </Badge>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight">
          {quiz.title}
        </h1>

        {quiz.description && (
          <p className="mt-2 text-muted-foreground">{quiz.description}</p>
        )}

        {quiz.place_slug && quiz.place_title && (
          <Link
            href={`/mesta/${quiz.place_slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" />
            О месте: {quiz.place_title}
          </Link>
        )}
      </header>

      <QuizRunner quizId={quiz.id} questions={questions} />
    </article>
  );
}