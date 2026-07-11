"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/cart-utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartItemRow } from "./CartItemRow";
import { EmptyState } from "@/components/shared/EmptyState";
import { Progress } from "@/components/ui/progress";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, subtotal, total, deliveryFee } = useCart();
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-display text-xl">Tu carrito</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Todavía no hay nada."
              : remaining > 0
                ? `Agregá ${formatPrice(remaining)} más para envío gratis.`
                : "¡Tenés envío gratis!"}
          </SheetDescription>
          {items.length > 0 && remaining > 0 && (
            <Progress value={(subtotal / FREE_DELIVERY_THRESHOLD) * 100} className="mt-2 h-1.5" />
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={ShoppingBag}
              title="Tu carrito está vacío"
              description="Explorá nuestros sabores y agregá algo dulce."
              className="border-0 bg-transparent"
              action={
                <Button asChild onClick={() => onOpenChange(false)}>
                  <Link href="/catalog">Explorar sabores</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} compact />
              ))}
            </div>
            <SheetFooter className="gap-3 border-t border-border">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className="font-medium text-foreground">
                    {deliveryFee === 0 ? "Gratis" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button asChild size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                <Link href="/cart">Revisar pedido</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
