import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Trophy, Sparkles, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizRunner } from "@/components/quiz-runner";

type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

async function getQuiz(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("quizzes")
    .select(
      "id, slug, title, description, questions, created_by_gigachat, place:places(id, slug, title)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  if (!quiz) return { title: "Тест не найден" };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  return {
    title: quiz.title,
    description: quiz.description ?? `Викторина: ${quiz.title}`,
    alternates: { canonical: `/testy/${quiz.slug}` },
    openGraph: {
      title: quiz.title,
      description: quiz.description ?? "",
      url: `${siteUrl}/testy/${quiz.slug}`,
      type: "article",
      images: [`${siteUrl}/og/default.svg`],
    },
    twitter: {
      card: "summary_large_image",
      title: quiz.title,
      description: quiz.description ?? "",
      images: [`${siteUrl}/og/default.svg`],
    },
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

  const place = quiz.place as unknown as
    | { id: string; slug: string; title: string }
    | null;
  const questions = Array.isArray(quiz.questions)
    ? (quiz.questions as Question[])
    : [];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orenburzhie-iznutri.ru";

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: quiz.title,
    description: quiz.description ?? "",
    url: `${siteUrl}/testy/${quiz.slug}`,
    educationalLevel: "intermediate",
    inLanguage: "ru-RU",
    numberOfQuestions: questions.length,
    about: place?.title ?? undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Тесты",
        item: `${siteUrl}/testy`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: quiz.title,
        item: `${siteUrl}/testy/${quiz.slug}`,
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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

        {place && (
          <Link
            href={`/mesta/${place.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" />
            О месте: {place.title}
          </Link>
        )}
      </header>

      <QuizRunner quizId={quiz.id} questions={questions} />
    </article>
  );
}
