import Link from "next/link";

const LINKS = {
  "О проекте": [
    { href: "/o-proekte", label: "О проекте" },
    { href: "/faq", label: "Вопросы и ответы" },
    { href: "/politika", label: "Политика конфиденциальности" },
  ],
  Разделы: [
    { href: "/mesta", label: "Места" },
    { href: "/marshruty", label: "Маршруты" },
    { href: "/legendy", label: "Легенды" },
    { href: "/sobytiya", label: "События" },
    { href: "/testy", label: "Тесты" },
  ],
  Участие: [
    { href: "/add", label: "Добавить место" },
    { href: "/sobrat-marshrut", label: "Собрать маршрут" },
    { href: "/profil", label: "Личный кабинет" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-lg font-bold">Оренбуржье изнутри</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Народный гид по Орску и Оренбургской области. Места, легенды, маршруты.
            </p>
          </div>

          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
              </h4>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Оренбуржье изнутри.
          </p>
          <p className="text-xs text-muted-foreground">
            6+ · Контент проверяется модерацией · 152-ФЗ соблюдается
          </p>
        </div>
      </div>
    </footer>
  );
}
