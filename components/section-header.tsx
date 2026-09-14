import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({ title, href, linkLabel = "Смотреть все" }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
