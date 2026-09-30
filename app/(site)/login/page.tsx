import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "ход",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-center font-display text-3xl font-bold">
        ход
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        ойди, чтобы добавлять места и управлять профилем
      </p>
      <LoginForm nextUrl={sp.next} />
    </div>
  );
}
