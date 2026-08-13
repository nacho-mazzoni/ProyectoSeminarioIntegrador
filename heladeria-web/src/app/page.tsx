"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api";
import { Hero } from "@/components/home/Hero";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CategoryCard } from "@/components/products/CategoryCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export default function HomePage() {
  const { data: categories = [], error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categorias.listar,
  });

  const { data: products = [], isLoading, error: productsError } = useQuery({
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
           {categoriesError ? <EmptyState icon={AlertCircle} title="No pudimos cargar las categorías" description={categoriesError.message} /> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
             {categories.map((c) => (
               <CategoryCard key={c.idCategoria} category={c} />
             ))}
           </div>}
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
           {productsError ? <EmptyState icon={AlertCircle} title="No pudimos cargar los productos" description={productsError.message} /> : <ProductGrid products={featured} loading={isLoading} skeletonCount={4} />}
        </PageContainer>
      </section>

      <section className="py-14">
        <PageContainer>
          <div className="overflow-hidden rounded-4xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
               Helados artesanales, directo a tu puerta
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
               Elegí retiro en local o delivery y conocé el costo real antes de confirmar.
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
