"use client";

import { useQuery } from "@tanstack/react-query";
import { Package, IceCreamCone, Users, DollarSign, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import { StatsCard } from "@/components/admin/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "#D8C3A5",
  EN_PREPARACION: "#8B7355",
  EN_CAMINO: "#6F5443",
  ENTREGADO: "#7A9E6D",
  CANCELADO: "#8B3A2A",
};

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: api.admin.dashboard.stats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Error al cargar estadísticas"
        description={error.message}
      />
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Productos" value={stats.totalProductos} icon={IceCreamCone} />
        <StatsCard title="Pedidos totales" value={stats.totalPedidos} icon={Package} />
        <StatsCard
          title="Pedidos pendientes"
          value={stats.pedidosPendientes}
          icon={Package}
          description="Requieren atención"
        />
        <StatsCard title="Usuarios" value={stats.totalUsuarios} icon={Users} />
        <StatsCard
          title="Ingresos del mes"
          value={formatPrice(stats.ingresosMes)}
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Pedidos por estado</h2>
          {stats.pedidosPorEstado.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.pedidosPorEstado} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C9B29540" />
                  <XAxis dataKey="estado" tick={{ fontSize: 12, fill: "#6F5443" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6F5443" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#FBF7F2",
                      border: "1px solid #C9B295",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                    {stats.pedidosPorEstado.map((entry) => (
                      <rect key={entry.estado} fill={ESTADO_COLORS[entry.estado] ?? "#D8C3A5"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Productos más vendidos</h2>
          {stats.productosMasVendidos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {stats.productosMasVendidos.map((p, i) => (
                <div key={p.producto} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{p.producto}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.min(
                            (p.cantidad / Math.max(...stats.productosMasVendidos.map((x) => x.cantidad))) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                    {p.cantidad} vendidos
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
