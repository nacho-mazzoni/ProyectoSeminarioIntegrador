"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Package, AlertCircle } from "lucide-react";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

const ESTADOS = ["", "PENDIENTE", "EN_PREPARACION", "EN_CAMINO", "ENTREGADO", "CANCELADO"];

function getUltimoEstado(historial: { estado: string }[]): string {
  return historial.length > 0 ? historial[historial.length - 1].estado : "";
}

export default function AdminOrdersPage() {
  const [filtroEstado, setFiltroEstado] = useState("");

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["admin-orders", filtroEstado],
    queryFn: () => api.admin.pedidos.listar(filtroEstado || undefined),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Pedidos</h2>
        <p className="text-sm text-muted-foreground">Gestioná todos los pedidos del sistema.</p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-48 h-10 rounded-full">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Todos los estados</SelectItem>
            {ESTADOS.filter(Boolean).map((e) => (
              <SelectItem key={e} value={e}>{e.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12">
            <EmptyState icon={AlertCircle} title="Error al cargar" description={error.message} />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12">
            <EmptyState icon={Package} title="Sin pedidos" description={filtroEstado ? "No hay pedidos con ese estado." : "Todavía no hay pedidos."} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right w-24">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.idPedido}>
                  <TableCell className="text-muted-foreground">#{o.idPedido}</TableCell>
                  <TableCell className="font-medium">{o.cliente}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(o.fecha).toLocaleDateString("es-AR", {
                      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{formatPrice(o.total)}</TableCell>
                  <TableCell className="text-sm capitalize">{o.metodoEntrega}</TableCell>
                  <TableCell><OrderStatusBadge status={getUltimoEstado(o.historial)} /></TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/admin/pedidos/${o.idPedido}`}>Ver</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
