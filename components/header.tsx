"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, MapPin, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { href: "/mesta", label: "Места" },
  { href: "/marshruty", label: "Маршруты" },
  { href: "/legendy", label: "Легенды" },
  { href: "/sobytiya", label: "События" },
  { href: "/testy", label: "Тесты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <MapPin className="h-6 w-6 text-primary" />
          <span>Оренбуржье изнутри</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Поиск">
            <Link href="/mesta">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Сменить тему">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button asChild className="hidden sm:inline-flex">
            <Link href="/add">Добавить место</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link href="/add" onClick={() => setOpen(false)}>
                    Добавить место
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
