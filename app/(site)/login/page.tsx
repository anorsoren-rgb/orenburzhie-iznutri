import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">С возвращением 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Войдите, чтобы добавлять места, маршруты и проходить тесты
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
