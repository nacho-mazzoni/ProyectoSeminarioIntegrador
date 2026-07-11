import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { PedidoResponse } from "@/lib/types";
import { formatPrice } from "@/lib/cart-utils";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderCard({ order }: { order: PedidoResponse }) {
  const ultimoEstado = order.historial?.[order.historial.length - 1];

  return (
    <article className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Pedido #{order.idPedido}</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(order.fecha), "d MMM yyyy · HH:mm", { locale: es })}
          </p>
        </div>
        {ultimoEstado && <OrderStatusBadge status={ultimoEstado.estado} />}
      </div>

      <ul className="mt-4 space-y-1.5 text-sm">
        {order.detalles.map((d) => (
          <li key={d.idDetalle} className="flex justify-between gap-3 text-muted-foreground">
            <span className="truncate">
              <span className="font-medium text-foreground">{d.cantidad}×</span> {d.producto}
            </span>
            <span className="shrink-0">{formatPrice(d.precioUnitHist * d.cantidad)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="truncate text-sm text-muted-foreground">{order.direccion}</span>
        <span className="shrink-0 font-semibold">{formatPrice(order.total)}</span>
      </div>
    </article>
  );
}
