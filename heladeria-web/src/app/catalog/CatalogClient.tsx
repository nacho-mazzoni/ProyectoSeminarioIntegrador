"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IceCreamCone, Search, X } from "lucide-react";
import { api } from "@/services/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CatalogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriaParam = searchParams.get("categoria");
  const [term, setTerm] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categorias.listar,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.productos.listar,
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = !categoriaParam || p.categoria.idCategoria === Number(categoriaParam);
      const matchesTerm =
        !term.trim() ||
        p.nombre.toLowerCase().includes(term.toLowerCase());
      return matchesCat && matchesTerm;
    });
  }, [products, categoriaParam, term]);

  const setCategory = (id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("categoria", id);
    } else {
      params.delete("categoria");
    }
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <PageContainer className="py-10">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold sm:text-4xl">Nuestro menú</h1>
        <p className="text-muted-foreground">Cada sabor es elaborado fresco, en pequeños lotes.</p>
      </div>

      <div className="sticky top-16 z-20 -mx-5 mt-8 bg-background/90 px-5 py-4 backdrop-blur md:top-18">
        <div className="relative mb-4 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar sabores..."
            aria-label="Buscar sabores"
            className="h-11 rounded-full pl-11 pr-10"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          <FilterPill active={!categoriaParam} onClick={() => setCategory(undefined)}>
            Todos
          </FilterPill>
          {categories.map((c) => (
            <FilterPill key={c.idCategoria} active={categoriaParam === String(c.idCategoria)} onClick={() => setCategory(String(c.idCategoria))}>
              {c.nombre}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {!isLoading && filtered.length === 0 ? (
          <EmptyState
            icon={IceCreamCone}
            title="No se encontraron sabores"
            description="Probá con otra búsqueda o categoría."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setTerm("");
                  setCategory(undefined);
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <ProductGrid products={filtered} loading={isLoading} />
        )}
      </div>
    </PageContainer>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
