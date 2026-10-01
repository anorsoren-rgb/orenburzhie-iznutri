"use client";

import { useEffect, useState } from "react";

type Star = {
  top: string;
  left: string;
  size: number;
  opacity: number;
  animationDelay: string;
};

export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const count = 120;
    const generated: Star[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        animationDelay: `${Math.random() * 5}s`,
      });
    }
    setStars(generated);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle 3s ease-in-out infinite`,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
}