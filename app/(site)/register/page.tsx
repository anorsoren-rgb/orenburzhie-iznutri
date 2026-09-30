import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "егистрация",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-center font-display text-3xl font-bold">
        егистрация
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Создай аккаунт, чтобы добавлять места и участвовать в проекте
      </p>
      <RegisterForm nextUrl={sp.next} />
    </div>
  );
}
