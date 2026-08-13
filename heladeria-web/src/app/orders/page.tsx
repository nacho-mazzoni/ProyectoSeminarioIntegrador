"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Package, ShieldAlert } from "lucide-react";
import { api } from "@/services/api";
import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/shared/PageContainer";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import type { PedidoResponse } from "@/lib/types";
import { formatPrice } from "@/lib/cart-utils";

export default function OrdersPage() {
  const { user, isAuthenticated, isReady } = useAuth();
  const isStaff = user?.rol === "ADMINISTRADOR" || user?.rol === "CAJERO";
  const [lastOrder, setLastOrder] = useState<{ order: PedidoResponse; paymentPending: boolean } | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("rumba-habana-last-order");
    if (stored) {
      try {
        // La lectura ocurre solo en cliente para evitar diferencias de hidratación.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLastOrder(JSON.parse(stored));
      } catch { localStorage.removeItem("rumba-habana-last-order"); }
    }
  }, []);
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: api.pedidos.listar,
    enabled: isReady && isAuthenticated && !isStaff,
  });

  if (isStaff) {
    return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <ShieldAlert className="mx-auto size-12 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Acceso denegado</h1>
          <p className="text-muted-foreground">El historial de pedidos no está disponible para usuarios del panel.</p>
          <Button asChild className="rounded-full"><Link href="/admin">Ir al panel</Link></Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <AuthGate>
      <PageContainer className="py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Mis pedidos</h1>
        <p className="mt-2 text-muted-foreground">Seguí y revisá tus pedidos recientes.</p>
        {lastOrder && <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-5 shadow-soft">
          <p className="font-display text-lg font-semibold">{lastOrder.paymentPending ? "Pedido creado, pago pendiente" : "Pedido confirmado"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Pedido #{lastOrder.order.idPedido} · Seguimiento: <strong className="text-foreground">{lastOrder.order.numeroSeguimiento ?? `RH-${lastOrder.order.idPedido}`}</strong> · {formatPrice(lastOrder.order.total)}</p>
          {lastOrder.paymentPending && <p className="mt-2 text-sm text-muted-foreground">Si Mercado Pago rechazó o canceló el pago, tu carrito sigue disponible para intentar nuevamente.</p>}
          <button type="button" className="mt-3 text-sm font-medium text-primary underline" onClick={() => { localStorage.removeItem("rumba-habana-last-order"); setLastOrder(null); }}>Cerrar confirmación</button>
        </div>}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
           {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-3xl" />
            ))
           ) : error ? (
             <div className="md:col-span-2"><EmptyState icon={Package} title="No pudimos cargar tus pedidos" description={error.message} /></div>
           ) : orders.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState
                icon={Package}
                title="Todavía no hay pedidos"
                description="Cuando hagas un pedido, aparecerá acá."
                action={
                  <Button asChild className="rounded-full">
                    <Link href="/catalog">Empezar a pedir</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            orders.map((order) => <OrderCard key={order.idPedido} order={order} />)
          )}
        </div>
      </PageContainer>
    </AuthGate>
  );
}
