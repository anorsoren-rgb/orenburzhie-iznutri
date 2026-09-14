"use client";

import { useEffect, useState } from "react";

type Props = {
  data: Record<string, unknown>;
  id: string;
};

// Client Component — вставляет JSON-LD через DOM.
// Это гарантирует, что script попадёт в <head>, даже если Next.js
// вырезает inline-скрипты из Server Components.
export function JsonLd({ data, id }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const scriptId = `jsonld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [data, id, mounted]);

  return null;
}
