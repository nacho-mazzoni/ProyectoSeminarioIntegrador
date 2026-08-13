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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "var(--color-secondary)",
  EN_PREPARACION: "var(--color-muted-foreground)",
  EN_CAMINO: "var(--color-muted-foreground)",
  LISTO_PARA_RETIRO: "var(--color-muted-foreground)",
  ENTREGADO: "var(--color-success)",
  CANCELADO: "var(--color-destructive)",
  PAGADO: "var(--color-success)",
  RECHAZADO: "var(--color-destructive)",
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
  const { isReady, isAuthenticated } = useAuth();
  const [meses, setMeses] = useState(6);
  const [desde, setDesde] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [hasta, setHasta] = useState(() => new Date().toISOString().slice(0, 10));
  const setRange = (days: number) => {
    setHasta(new Date().toISOString().slice(0, 10));
    setDesde(new Date(Date.now() - days * 86400000).toISOString().slice(0, 10));
  };

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: api.admin.dashboard.stats,
    enabled: isReady && isAuthenticated,
  });

  const { data: ingresosMensuales, isLoading: loadingIngresos } = useQuery({
    queryKey: ["admin-ingresos-mensuales", meses],
    queryFn: () => api.admin.dashboard.ingresosMensuales(meses),
    enabled: isReady && isAuthenticated,
  });
  const reporteQuery = useQuery({
    queryKey: ["admin-reporte-ingresos", desde, hasta],
    queryFn: () => api.reportes.ingresos(new Date(`${desde}T00:00:00`).toISOString(), new Date(`${hasta}T23:59:59`).toISOString()),
    enabled: isReady && isAuthenticated && !!desde && !!hasta && desde <= hasta,
  });
  const rankingQuery = useQuery({
    queryKey: ["admin-reporte-dashboard"],
    queryFn: api.reportes.dashboard,
    enabled: isReady && isAuthenticated,
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="estado" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                    {stats.pedidosPorEstado.map((entry) => (
                      <rect key={entry.estado} fill={ESTADO_COLORS[entry.estado] ?? "var(--color-secondary)"} />
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
                           Math.max(...stats.productosMasVendidos.map((x) => x.cantidad), 0) === 0 ? 0 :
                             (p.cantidad / Math.max(...stats.productosMasVendidos.map((x) => x.cantidad), 0)) * 100,
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Ranking title="Sabores más vendidos" items={rankingQuery.data?.topSabores ?? []} loading={rankingQuery.isLoading} error={rankingQuery.error} empty="No hubo ventas de sabores." />
        <Ranking title="Productos más vendidos (reporte)" items={rankingQuery.data?.topProductos ?? []} loading={rankingQuery.isLoading} error={rankingQuery.error} empty="No hubo ventas de productos." />
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="font-display text-lg font-semibold">Reporte de ingresos</h2><p className="text-sm text-muted-foreground">Solo contabiliza pedidos entregados.</p></div>
           <div className="flex flex-wrap items-end gap-3"><div className="flex gap-1"><Button type="button" variant="outline" size="sm" onClick={() => setRange(0)}>Hoy</Button><Button type="button" variant="outline" size="sm" onClick={() => setRange(7)}>7 días</Button><Button type="button" variant="outline" size="sm" onClick={() => setRange(30)}>30 días</Button></div><label className="text-xs text-muted-foreground">Desde<input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="mt-1 block h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground">Hasta<input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="mt-1 block h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground" /></label></div>
        </div>
        {desde > hasta ? <p className="mt-5 text-sm text-destructive">El inicio debe ser anterior al fin.</p> : reporteQuery.isLoading ? <Skeleton className="mt-5 h-24 w-full" /> : reporteQuery.error ? <p className="mt-5 text-sm text-destructive">No se pudo cargar el reporte: {reporteQuery.error.message}</p> : reporteQuery.data && reporteQuery.data.cantidadPedidos === 0 ? <p className="mt-5 text-sm text-muted-foreground">No hubo ventas entregadas en este período. Total: {formatPrice(0)}.</p> : reporteQuery.data ? <div className="mt-5 grid gap-3 sm:grid-cols-3"><StatsCard title="Ingresos" value={formatPrice(reporteQuery.data.totalIngresos)} icon={DollarSign} /><StatsCard title="Pedidos entregados" value={reporteQuery.data.cantidadPedidos} icon={Package} /><StatsCard title="Promedio por pedido" value={formatPrice(reporteQuery.data.promedio)} icon={DollarSign} /></div> : null}
      </section>

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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
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

function Ranking({ title, items, loading, error, empty }: { title: string; items: { nombre: string; cantidadVendida: number }[]; loading: boolean; error: Error | null; empty: string }) {
  const chartData = items.slice(0, 8).map((item) => ({ ...item, label: item.nombre.length > 16 ? `${item.nombre.slice(0, 16)}…` : item.nombre }));
  return <section className="rounded-2xl border border-border bg-card p-6 shadow-soft"><h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>{loading ? <Skeleton className="h-48 w-full" /> : error ? <p className="text-sm text-destructive">No se pudo cargar: {error.message}</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">{empty}</p> : <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" /><XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} /><YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} /><Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "0.75rem" }} /><Bar dataKey="cantidadVendida" name="Vendidos" fill="var(--color-primary)" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div>}</section>;
}
