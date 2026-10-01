import { formatPrice } from "@/lib/cart-utils";
import { useCart } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

interface OrderSummaryProps {
  children?: ReactNode;
  shippingCost?: number | null;
  shippingLabel?: string;
}

export function OrderSummary({ children, shippingCost, shippingLabel }: OrderSummaryProps) {
  const { subtotal, itemCount } = useCart();

  const finalShippingCost = typeof shippingCost === "number" ? shippingCost : null;
  const effectiveTotal = subtotal + (finalShippingCost ?? 0);

  const renderShippingValue = () => {
    if (shippingLabel) {
      return shippingLabel;
    }
    if (shippingCost === undefined) {
      return "A calcular en checkout";
    }
    if (shippingCost === null) {
      return "A calcular";
    }
    if (shippingCost === 0) {
      return "Gratis";
    }
    return formatPrice(shippingCost);
  };

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
          <dd className="font-medium">{renderShippingValue()}</dd>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(effectiveTotal)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
