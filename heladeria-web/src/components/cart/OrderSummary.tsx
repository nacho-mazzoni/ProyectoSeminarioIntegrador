import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/cart-utils";
import { useCart } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

export function OrderSummary({ children }: { children?: ReactNode }) {
  const { subtotal, deliveryFee, total, itemCount } = useCart();
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold">Order summary</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Items ({itemCount})</dt>
          <dd className="font-medium">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd className="font-medium">{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</dd>
        </div>
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(remaining)} more to get free delivery.
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
