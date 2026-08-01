"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { api } from "@/services/api";
import { getErrorMessage } from "@/lib/error-messages";
import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/shared/PageContainer";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: api.pedidos.listar,
  });

  return (
    <AuthGate>
      <PageContainer className="py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Mis pedidos</h1>
        <p className="mt-2 text-muted-foreground">Seguí y revisá tus pedidos recientes.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-3xl" />
            ))
          ) : error ? (
            <div className="md:col-span-2">
              <EmptyState
                icon={Package}
                title="Error al cargar tus pedidos"
                description={getErrorMessage(error, "No se pudieron cargar tus pedidos. Intentá de nuevo.")}
                action={
                  <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                }
              />
            </div>
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
