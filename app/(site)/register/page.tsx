import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Присоединяйтесь 🌅</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Станьте частью народного гида по Оренбуржью
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
