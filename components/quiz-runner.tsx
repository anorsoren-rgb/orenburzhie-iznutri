"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

type Props = {
  quizId: string;
  quizSlug: string;
  quizTitle: string;
  questions: Question[];
};

export function QuizRunner({ quizId, quizSlug, quizTitle, questions }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  const total = questions.length;
  const isCorrect = selected === question?.correct;

  function choose(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) setScore((s) => s + 1);
  }

  async function next() {
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);

      // Сохраняем результат
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        await supabase.from("quiz_results").insert({
          quiz_id: quizId,
          user_id: user?.id ?? null,
          score: score + (isCorrect ? 0 : 0), // актуальный score уже посчитан
          total,
          answers: [],
        });
      } catch {
        // не критично
      }
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }

  // ============================================
  // РЕЗУЛЬТАТ
  // ============================================
  if (finished) {
    const percent = Math.round((score / total) * 100);
    let emoji = "📚";
    let title = "Надо повторить";
    let subtitle = "Загляни в статьи о местах — узнаешь много нового.";

    if (percent >= 80) {
      emoji = "🏆";
      title = "Знаток Оренбуржья!";
      subtitle = "Ты отлично знаешь родной край.";
    } else if (percent >= 50) {
      emoji = "👍";
      title = "Хороший результат";
      subtitle = "Ещё немного — и будет отлично.";
    }

    return (
      <Card className="border-border/60">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="text-6xl">{emoji}</div>

          <div>
            <h2 className="font-display text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>

          <div className="mx-auto flex max-w-xs items-center justify-center gap-6 rounded-lg bg-muted p-6">
            <div>
              <p className="text-3xl font-bold text-primary">{score}</p>
              <p className="text-xs text-muted-foreground">верных</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">вопросов</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-3xl font-bold">{percent}%</p>
              <p className="text-xs text-muted-foreground">результат</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button onClick={restart} variant="outline" className="[&_svg]:size-4">
              <RotateCcw />
              <span>Пройти ещё раз</span>
            </Button>
            <Button asChild variant="outline" className="[&_svg]:size-4">
              <Link href="/testy">
                <Trophy />
                <span>Другие тесты</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ============================================
  // ВОПРОС
  // ============================================
  const progress = ((current + (answered ? 1 : 0)) / total) * 100;

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-6 p-6">
        {/* Прогресс */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Вопрос {current + 1} из {total}
            </span>
            <span className="font-medium">
              {score} {score === 1 ? "балл" : score < 5 ? "балла" : "баллов"}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Вопрос */}
        <h2 className="font-display text-xl font-semibold leading-tight">
          {question.q}
        </h2>

        {/* Варианты */}
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isThisCorrect = i === question.correct;
            const isThisSelected = i === selected;

            let className =
              "w-full rounded-lg border p-4 text-left transition-colors ";

            if (!answered) {
              className += "border-border hover:bg-accent cursor-pointer";
            } else if (isThisCorrect) {
              className += "border-green-500 bg-green-50 dark:bg-green-950/30";
            } else if (isThisSelected) {
              className +=
                "border-destructive bg-destructive/10 text-destructive";
            } else {
              className += "border-border opacity-60";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={className}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                      answered && isThisCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : answered && isThisSelected
                        ? "border-destructive bg-destructive text-white"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {answered && isThisCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : answered && isThisSelected ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className="flex-1">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Пояснение */}
        {answered && (
          <div
            className={`rounded-lg border p-4 ${
              isCorrect
                ? "border-green-500/40 bg-green-50/50 dark:bg-green-950/20"
                : "border-destructive/40 bg-destructive/5"
            }`}
          >
            <p className="text-sm">
              <strong>
                {isCorrect ? "✅ Верно! " : "❌ Не совсем. "}
              </strong>
              {question.explain}
            </p>
          </div>
        )}

        {/* Кнопка «Далее» */}
        {answered && (
          <Button
            onClick={next}
            className="w-full [&_svg]:size-5"
            size="lg"
          >
            {current + 1 < total ? (
              <>
                <span>Следующий вопрос</span>
                <ArrowRight />
              </>
            ) : (
              <>
                <Trophy />
                <span>Показать результат</span>
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}