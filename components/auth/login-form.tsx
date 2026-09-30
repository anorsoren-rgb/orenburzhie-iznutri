"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("еверный email или пароль");
      setLoading(false);
      return;
    }

    router.push(nextUrl ?? "/profil");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="password">
              ароль
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full [&_svg]:size-4"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>ходим...</span>
              </>
            ) : (
              <>
                <LogIn />
                <span>ойти</span>
              </>
            )}
          </Button>
        </form>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          ет аккаунта?{" "}
          <Link href="/register" className="text-primary hover:underline">
            арегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
