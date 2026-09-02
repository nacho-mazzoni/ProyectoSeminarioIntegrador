"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Package, IceCreamCone, Users, DollarSign, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import { StatsCard } from "@/components/admin/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "#D8C3A5",
  EN_PREPARACION: "#8B7355",
  LISTO_PARA_RETIRAR: "#A88B68",
  LISTO_PARA_ENVIO: "#967554",
  EN_CAMINO: "#6F5443",
  ENTREGADO: "#7A9E6D",
  FINALIZADO: "#5B8C51",
  CANCELADO: "#8B3A2A",
};

const MESES_OPCIONES = [
  { value: 3, label: "3 meses" },
  { value: 6, label: "6 meses" },
  { value: 9, label: "9 meses" },
  { value: 12, label: "12 meses" },
];

const MESES_ES: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

function formatMesLabel(mes: string): string {
  const [year, month] = mes.split("-");
  return `${MESES_ES[month] ?? month} ${year.slice(2)}`;
}

export default function AdminDashboard() {
  const [meses, setMeses] = useState(6);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: api.admin.dashboard.stats,
  });

  const { data: ingresosMensuales, isLoading: loadingIngresos } = useQuery({
    queryKey: ["admin-ingresos-mensuales", meses],
    queryFn: () => api.admin.dashboard.ingresosMensuales(meses),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
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

  const chartData = ingresosMensuales?.map((ing) => ({
    mes: formatMesLabel(ing.mes),
    total: ing.total,
    cantidad: ing.cantidad,
  })) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          description="Pedidos entregados"
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

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Ingresos por mes</h2>
          <Select value={String(meses)} onValueChange={(v) => setMeses(Number(v))}>
            <SelectTrigger className="h-8 w-32 rounded-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES_OPCIONES.map((op) => (
                <SelectItem key={op.value} value={String(op.value)}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loadingIngresos ? (
          <Skeleton className="h-72 w-full rounded-xl" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos de ingresos</p>
        ) : (
          <>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C9B29540" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#6F5443" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6F5443" }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{
                      background: "#FBF7F2",
                      border: "1px solid #C9B295",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Bar dataKey="total" fill="#4A2E1F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {ingresosMensuales?.map((ing) => (
                <div key={ing.mes} className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-2 text-sm">
                  <span className="font-medium">{formatMesLabel(ing.mes)}</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">{ing.cantidad} pedidos</span>
                    <span className="font-semibold">{formatPrice(ing.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
