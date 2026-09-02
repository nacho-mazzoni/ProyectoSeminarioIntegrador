"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/cart-utils";
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

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, subtotal } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-display text-xl">Tu carrito</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Todavía no hay nada."
              : `${itemCount} ${itemCount === 1 ? "producto agregado" : "productos agregados"}`}
          </SheetDescription>
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
                  <span>Envío</span>
                  <span className="font-medium text-foreground">A calcular en checkout</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold text-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
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
