"use client";

import { X } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { formatPrice, lineTotal } from "@/lib/cart-utils";
import { getProductImage } from "@/lib/product-images";
import { useCart } from "@/context/cart-context";
import { QuantitySelector } from "@/components/shared/QuantitySelector";

export function CartItemRow({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  const saboresStr = item.sabores.map((s) => s.nombre).join(", ");
  const adicStr = item.adicionales.map((a) => a.nombre).join(", ");
  const meta = [saboresStr, adicStr].filter(Boolean).join(" · ");

  return (
    <div className="flex gap-4">
      <img
        src={getProductImage(item.product.nombre)}
        alt={item.product.nombre}
        loading="lazy"
        width={800}
        height={800}
        className={compact ? "size-16 rounded-xl object-cover" : "size-20 rounded-2xl object-cover sm:size-24"}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-foreground">{item.product.nombre}</h3>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Eliminar ${item.product.nombre}`}
            className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>
        {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            onChange={(q) => updateQuantity(item.id, q)}
          />
          <span className="font-semibold text-foreground">{formatPrice(lineTotal(item))}</span>
        </div>
      </div>
    </div>
  );
}
