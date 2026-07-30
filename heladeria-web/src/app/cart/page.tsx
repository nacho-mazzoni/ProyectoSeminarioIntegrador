"use client";

import Link from "next/link";
import { ArrowRight, LogIn, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { PageContainer } from "@/components/shared/PageContainer";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, clear } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={LogIn}
          title="Iniciá sesión"
          description="Necesitás estar logueado para ver tu carrito."
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Tu carrito está vacío"
          description="Parece que no agregaste nada todavía. Vamos a solucionarlo."
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link href="/catalog">Explorar el menú</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold sm:text-4xl">Tu carrito</h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clear}>
          <Trash2 className="size-4" />
          Vaciar
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
          {items.map((item, i) => (
            <div key={item.id}>
              <CartItemRow item={item} />
              {i < items.length - 1 && <Separator className="mt-5" />}
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <OrderSummary>
            <Button asChild size="lg" className="w-full rounded-full">
              <Link href="/checkout">
                Finalizar pedido
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </OrderSummary>
        </div>
      </div>
    </PageContainer>
  );
}
