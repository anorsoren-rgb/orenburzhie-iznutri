"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

type Props = {
  quizId: string;
  questions: Question[];
};

export function QuizRunner({ quizId, questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  const isCorrect = selected === question?.correct;

  function choose(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <Trophy className="mx-auto h-16 w-16 text-ochre-600" />
          <h2 className="font-display text-2xl font-bold">Тест пройден!</h2>
          <p className="text-lg">
            Твой результат: <strong>{score}</strong> из{" "}
            <strong>{questions.length}</strong> ({pct}%)
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button onClick={restart} variant="outline">
              <RotateCcw className="h-4 w-4" />
              Пройти заново
            </Button>
            <Button asChild>
              <Link href="/testy">Другие тесты</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Вопрос {current + 1} из {questions.length}
        </span>
        <span>Правильных: {score}</span>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">{question.q}</h2>

          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isRight = idx === question.correct;

              let cls =
                "w-full rounded-lg border border-border p-3 text-left text-sm transition-colors hover:bg-accent";

              if (answered && isSelected && isRight) {
                cls =
                  "w-full rounded-lg border border-green-500 bg-green-500/10 p-3 text-left text-sm";
              } else if (answered && isSelected && !isRight) {
                cls =
                  "w-full rounded-lg border border-destructive bg-destructive/10 p-3 text-left text-sm";
              } else if (answered && isRight) {
                cls =
                  "w-full rounded-lg border border-green-500 bg-green-500/10 p-3 text-left text-sm";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => choose(idx)}
                  disabled={answered}
                  className={cls}
                >
                  <div className="flex items-center gap-2">
                    {answered && isSelected && isRight && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {answered && isSelected && !isRight && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {answered && question.explain && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <strong>Пояснение:</strong> {question.explain}
            </div>
          )}

          {answered && (
            <Button onClick={next} className="w-full">
              {current + 1 >= questions.length
                ? "Показать результат"
                : "Следующий вопрос"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
