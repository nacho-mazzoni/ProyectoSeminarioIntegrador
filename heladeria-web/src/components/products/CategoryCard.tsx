"use client";

import Link from "next/link";
import type { CategoriaResponse } from "@/lib/types";

export function CategoryCard({ category }: { category: CategoriaResponse }) {
  const emojis: Record<string, string> = {
    "Helado Pote": "🍨",
    "Helado Palito": "🍦",
    "Postre": "🍰",
  };

  return (
    <Link
      href={`/catalog?categoria=${category.idCategoria}`}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">
        {emojis[category.nombre] ?? "🍦"}
      </span>
      <div className="min-w-0">
        <h3 className="truncate font-display text-lg font-semibold text-foreground">
          {category.nombre}
        </h3>
      </div>
    </Link>
  );
}
