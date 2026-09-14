import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "place" | "route" | "ai" | "event";
  className?: string;
};

const TEXTS: Record<string, { title: string; text: string }> = {
  place: {
    title: "Информация носит ознакомительный характер",
    text:
      "Посещение места может быть связано с риском для здоровья и имущества. " +
      "Администрация сайта не несёт ответственности за возможный вред. " +
      "Оценивайте свои силы и соблюдайте меры безопасности.",
  },
  route: {
    title: "Маршрут носит рекомендательный характер",
    text:
      "Перед поездкой проверьте актуальность дорог, погоду и доступность мест. " +
      "Администрация сайта не несёт ответственности за возможный вред здоровью " +
      "или имуществу в ходе следования по маршруту.",
  },
  ai: {
    title: "Создано с помощью GigaChat",
    text:
      "Текст сгенерирован нейросетью и может содержать неточности. " +
      "Проверяйте факты самостоятельно. Администрация не гарантирует " +
      "точность сгенерированной информации.",
  },
  event: {
    title: "Информация о событии может меняться",
    text:
      "Даты, место и условия проведения уточняйте у организаторов. " +
      "Администрация сайта не несёт ответственности за изменения " +
      "в программе событий.",
  },
};

export function Disclaimer({ variant = "place", className }: Props) {
  const { title, text } = TEXTS[variant] ?? TEXTS.place;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-ochre-500/40 bg-ochre-50/60 p-4 dark:border-ochre-500/30 dark:bg-ochre-950/20",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-ochre-600 dark:text-ochre-500" />
      <div className="text-sm">
        <p className="font-medium text-ochre-800 dark:text-ochre-300">
          {title}
        </p>
        <p className="mt-1 text-ochre-700/90 dark:text-ochre-400/90">
          {text}
        </p>
      </div>
    </div>
  );
}
