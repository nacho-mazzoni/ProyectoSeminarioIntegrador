import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/cart-utils";
import { useCart } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

export function OrderSummary({ children, deliveryFeeOverride, discount = 0 }: { children?: ReactNode; deliveryFeeOverride?: number; discount?: number }) {
  const { items, subtotal, deliveryFee: defaultDeliveryFee, itemCount } = useCart();
  const deliveryFee = deliveryFeeOverride ?? defaultDeliveryFee;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold">Resumen del pedido</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="space-y-3 border-b border-border pb-3">
          {items.map((item) => <div key={item.id}><div className="flex justify-between gap-3"><dt className="font-medium">{item.quantity} × {item.product.nombre}</dt><dd className="shrink-0">{formatPrice(item.unitPrice * item.quantity)}</dd></div>{item.sabores.length > 0 && <p className="text-xs text-muted-foreground">Sabores: {item.sabores.map((s) => s.nombre).join(", ")}</p>}{item.adicionales.length > 0 && <p className="text-xs text-muted-foreground">Adicionales: {item.adicionales.map((a) => a.nombre).join(", ")}</p>}</div>)}
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Productos ({itemCount})</dt>
          <dd className="font-medium">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Envío</dt>
          <dd className="font-medium">{deliveryFee === 0 ? "Sin costo" : formatPrice(deliveryFee)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>Descuento</dt>
            <dd className="font-medium">-{formatPrice(discount)}</dd>
          </div>
        )}
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground">
             Sumá {formatPrice(remaining)} para obtener envío sin costo.
          </p>
        )}
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
