"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <PageContainer className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div className="max-w-xl space-y-6">
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Helado artesanal Rumba Habana, hecho todos los días y entregado frío.
          </h1>
          <p className="text-lg text-muted-foreground">
            Ingredientes naturales, elaborados en pequeños lotes. Pedí tus sabores favoritos y
            disfrutalos en casa en minutos.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/catalog">
                Pedir ahora
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-primary" /> Envío rápido
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="size-4 text-primary" /> Ingredientes naturales
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-4xl border border-border shadow-lift">
            <img
              src="/assets/hero.jpg"
              alt="Helados artesanales"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
