import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const config: Record<string, { label: string; className: string }> = {
  PENDIENTE: { label: "Pendiente", className: "bg-secondary text-secondary-foreground" },
  EN_PREPARACION: { label: "En preparación", className: "bg-accent text-accent-foreground" },
  EN_CAMINO: { label: "En camino", className: "bg-primary/15 text-primary" },
  ENTREGADO: { label: "Entregado", className: "bg-success/15 text-success" },
  CANCELADO: { label: "Cancelado", className: "bg-destructive/15 text-destructive" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const resolved = config[status] ?? { label: status, className: "bg-secondary text-secondary-foreground" };
  return <Badge className={cn("rounded-full border-0 font-semibold", resolved.className)}>{resolved.label}</Badge>;
}
