"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api";
import { Hero } from "@/components/home/Hero";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CategoryCard } from "@/components/products/CategoryCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categorias.listar,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.productos.listar,
  });

  const featured = products.filter((_, i) => i < 4);

  return (
    <>
      <Hero />

      <section className="py-14">
        <PageContainer className="space-y-8">
          <SectionHeader eyebrow="Categorías" title="Encontrá tu antojo" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.idCategoria} category={c} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-14">
        <PageContainer className="space-y-8">
          <SectionHeader
            eyebrow="Destacados"
            title="Los favoritos de todos"
            description="Nuestros productos más populares."
            action={
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/catalog">
                  Ver todo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
          <ProductGrid products={featured} loading={isLoading} skeletonCount={4} />
        </PageContainer>
      </section>

      <section className="py-14">
        <PageContainer>
          <div className="overflow-hidden rounded-4xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
              Envío gratis en pedidos sobre $25
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              Cargate de tus favoritos y ahorrate el costo de envío.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-7 rounded-full">
              <Link href="/catalog">Empezar tu pedido</Link>
            </Button>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
