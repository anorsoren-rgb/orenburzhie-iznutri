"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  Search,
  MapPin,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  Plus,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { href: "/mesta", label: "Места" },
  { href: "/marshruty", label: "Маршруты" },
  { href: "/legendy", label: "Легенды" },
  { href: "/sobytiya", label: "События" },
  { href: "/testy", label: "Тесты" },
];

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  async function logout() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  const user = session?.user;
  const loading = status === "loading";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold"
        >
          <MapPin className="h-6 w-6 text-primary" />
          <span>Оренбуржье изнутри</span>
        </Link>

        <nav className="flex items-center gap-1">
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

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Сменить тему"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {!loading && (
            <>
              {user ? (
                <>
                  <Button
                    asChild
                    className="hidden [&_svg]:size-4 sm:inline-flex"
                  >
                    <Link href="/add">
                      <Plus />
                      <span>Добавить</span>
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                          aria-label="Меню профиля"
                        >
                          {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.name ?? "Пользователь"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        render={
                          <Link href="/profil" className="cursor-pointer">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Мой профиль</span>
                          </Link>
                        }
                      />
                      <DropdownMenuItem
                        render={
                          <Link href="/add" className="cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Добавить место</span>
                          </Link>
                        }
                      />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Выйти</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  asChild
                  className="hidden [&_svg]:size-4 sm:inline-flex"
                >
                  <Link href="/login">
                    <UserIcon />
                    <span>Войти</span>
                  </Link>
                </Button>
              )}
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Меню"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
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

                <div className="my-3 h-px bg-border" />

                {user ? (
                  <>
                    <Link
                      href="/profil"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Мой профиль</span>
                    </Link>
                    <Link
                      href="/add"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Добавить место</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-base font-medium text-destructive hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Выйти</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Войти</span>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}