"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const LABELS_ESTADO: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO_PARA_RETIRAR: "Listo para retirar",
  LISTO_PARA_ENVIO: "Listo para envío",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

function getSiguientesEstados(estadoActual: string, metodoEntrega?: string): string[] {
  const esDelivery = metodoEntrega?.toLowerCase() === "delivery";
  switch (estadoActual) {
    case "PENDIENTE":
      return ["EN_PREPARACION", "CANCELADO"];
    case "EN_PREPARACION":
      return esDelivery
        ? ["LISTO_PARA_ENVIO", "CANCELADO"]
        : ["LISTO_PARA_RETIRAR", "CANCELADO"];
    case "LISTO_PARA_RETIRAR":
      return ["FINALIZADO"];
    case "LISTO_PARA_ENVIO":
      return ["EN_CAMINO"];
    case "EN_CAMINO":
      return ["ENTREGADO"];
    default:
      return [];
  }
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = Number(id);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => api.admin.pedidos.obtener(orderId),
    enabled: !isNaN(orderId),
  });

  const mutation = useMutation({
    mutationFn: (estado: string) => api.admin.pedidos.cambiarEstado(orderId, { estado }),
    onSuccess: (updated) => {
      toast.success(`Estado actualizado a "${updated.historial[updated.historial.length - 1].estado}"`);
      setNuevoEstado("");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo actualizar el estado"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-muted-foreground">Pedido no encontrado.</p>;
  }

  const ultimoEstado = order.historial.length > 0
    ? order.historial[order.historial.length - 1].estado
    : "";

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="rounded-full" onClick={() => router.back()}>
        <ArrowLeft className="size-4" />
        Volver
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display text-lg font-semibold">Detalle del pedido</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pedido #</dt>
                <dd className="font-medium">{order.idPedido}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium">{order.cliente}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Fecha</dt>
                <dd className="font-medium">
                  {new Date(order.fecha).toLocaleDateString("es-AR", {
                    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Método de entrega</dt>
                <dd className="font-medium capitalize">{order.metodoEntrega}</dd>
              </div>
              {order.direccion && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dirección</dt>
                  <dd className="font-medium text-right max-w-60">{order.direccion}</dd>
                </div>
              )}
              {order.promocion && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Promoción</dt>
                  <dd className="font-medium">{order.promocion}</dd>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display text-lg font-semibold">Productos</h3>
            <div className="space-y-4">
              {order.detalles.map((d) => (
                <div key={d.idDetalle} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{d.producto}</p>
                    {d.sabores.length > 0 && (
                      <p className="text-xs text-muted-foreground">Sabores: {d.sabores.join(", ")}</p>
                    )}
                    {d.adicionales.length > 0 && (
                      <p className="text-xs text-muted-foreground">Adicionales: {d.adicionales.join(", ")}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium">x{d.cantidad}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(d.precioUnitHist)} c/u</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display text-lg font-semibold">Estado actual</h3>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-muted-foreground" />
              <OrderStatusBadge status={ultimoEstado} />
            </div>

            <Separator className="my-4" />

            {(() => {
              const siguientesEstados = getSiguientesEstados(ultimoEstado, order.metodoEntrega);
              if (siguientesEstados.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground">Este pedido está finalizado y no se puede modificar.</p>
                );
              }
              return (
                <>
                  <h4 className="mb-3 text-sm font-semibold">Cambiar estado</h4>
                  <div className="flex gap-2">
                    <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                      <SelectTrigger className="h-10 flex-1 rounded-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {siguientesEstados.map((e) => (
                          <SelectItem key={e} value={e}>
                            {LABELS_ESTADO[e] ?? e.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="rounded-full shrink-0"
                      onClick={() => nuevoEstado && mutation.mutate(nuevoEstado)}
                      disabled={!nuevoEstado || mutation.isPending}
                    >
                      {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
                      Actualizar
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display text-lg font-semibold">Línea de tiempo</h3>
            <div className="space-y-4">
              {[...order.historial].reverse().map((h, i) => (
                <div key={h.idHist} className="relative flex gap-4">
                  {i < order.historial.length - 1 && (
                    <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
                  )}
                  <div className="relative flex flex-col items-center">
                    <div className={`size-6 rounded-full border-2 ${
                      i === 0 ? "border-primary bg-primary" : "border-border bg-card"
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1 pb-4">
                    <div className="text-sm font-medium">
                      <OrderStatusBadge status={h.estado} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(h.fechaHora).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                    {h.notas && <p className="mt-1 text-xs text-muted-foreground">{h.notas}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
