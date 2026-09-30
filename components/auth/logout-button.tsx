"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4" />
      <span>Выйти</span>
    </Button>
  );
}
