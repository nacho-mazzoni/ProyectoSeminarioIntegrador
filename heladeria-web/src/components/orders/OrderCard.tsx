"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { PedidoResponse } from "@/lib/types";
import { formatPrice } from "@/lib/cart-utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function OrderCard({ order }: { order: PedidoResponse }) {
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const ultimoEstado = order.historial?.[order.historial.length - 1];
  const esCancelable = ultimoEstado?.estado === "PENDIENTE" || ultimoEstado?.estado === "EN_PREPARACION";
  const estadoPago = order.estadoPago?.toLowerCase();
  const estadoPagoLabel = estadoPago === "aprobado" ? "Pagado"
    : estadoPago === "rechazado" ? "Rechazado"
      : estadoPago === "en_proceso" ? "En proceso"
        : estadoPago === "pendiente" ? "Pendiente" : order.estadoPago;

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de cancelar este pedido?")) return;
    setCancelling(true);
    try {
      await api.pedidos.cancelar(order.idPedido);
      setCancelled(true);
      toast.success("Pedido cancelado");
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-order", order.idPedido] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al cancelar";
      console.error("Error al cancelar pedido:", msg);
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <article className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Pedido #{order.idPedido}</h3>
          <p className="text-xs font-medium text-primary">Seguimiento: {order.numeroSeguimiento ?? `RH-${order.idPedido}`}</p>
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
        <div className="flex items-center gap-2">
          {order.metodoPago && (
            <span className="text-xs text-muted-foreground">
              {order.metodoPago === "mercado_pago" ? "Mercado Pago" : "Efectivo"}
              {estadoPagoLabel && ` · ${estadoPagoLabel}`}
            </span>
          )}
        </div>
        <span className="shrink-0 font-semibold">{formatPrice(order.total)}</span>
      </div>

      {order.detalles.some((d) => d.sabores?.length || d.adicionales?.length) && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-primary">Ver detalle completo</summary>
          <div className="mt-2 space-y-2 text-sm">
            {order.detalles.map((d) => (
              <div key={d.idDetalle} className="border-t border-border pt-2">
                <p className="font-medium">{d.cantidad}x {d.producto}</p>
                {d.sabores?.length > 0 && (
                  <p className="text-muted-foreground ml-2">Sabores: {d.sabores.join(", ")}</p>
                )}
                {d.adicionales?.length > 0 && (
                  <p className="text-muted-foreground ml-2">Adicionales: {d.adicionales.join(", ")}</p>
                )}
              </div>
            ))}
            {order.historial && order.historial.length > 1 && (
              <div className="border-t border-border pt-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Historial</p>
                {order.historial.map((h) => (
                  <p key={h.idHist} className="text-xs text-muted-foreground">
                    {format(new Date(h.fechaHora), "d MMM HH:mm", { locale: es })} —{" "}
                    <span className="font-medium">{h.estado}</span>
                    {h.notas && ` — ${h.notas}`}
                  </p>
                ))}
              </div>
            )}
          </div>
        </details>
      )}

      {(esCancelable && !cancelled) ? (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" className="rounded-full text-destructive border-destructive/50 hover:bg-destructive/10" onClick={handleCancel} disabled={cancelling}>
            {cancelling && <Loader2 className="size-3.5 animate-spin" />}
            Cancelar pedido
          </Button>
        </div>
      ) : cancelled ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-secondary/40 p-3 text-sm">
          <span>Podés iniciar un nuevo pedido cuando quieras.</span>
          <Button asChild size="sm" className="rounded-full"><Link href="/catalog">Ir al catálogo</Link></Button>
        </div>
      ) : null}
    </article>
  );
}
