"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Plus, Pencil, Trash2, Tag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { getErrorMessage } from "@/lib/error-messages";
import type { Promocion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const schema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(50, "Máximo 50 caracteres"),
  descripcion: z.string().optional(),
  porcDesc: z.coerce.number().min(0, "Mínimo 0").max(100, "Máximo 100"),
  activa: z.boolean(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function toLocalInputValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toPayload(data: FormData) {
  return {
    codigo: data.codigo,
    descripcion: data.descripcion || undefined,
    porcDesc: data.porcDesc,
    activa: data.activa,
    fechaInicio: data.fechaInicio ? new Date(data.fechaInicio).toISOString() : undefined,
    fechaFin: data.fechaFin ? new Date(data.fechaFin).toISOString() : undefined,
  };
}

function PromocionFormDialog({
  open, onOpenChange, promocion, onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  promocion?: Promocion;
  onSuccess: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: promocion ? {
      codigo: promocion.codigo,
      descripcion: promocion.descripcion ?? "",
      porcDesc: promocion.porcDesc,
      activa: promocion.activa,
      fechaInicio: toLocalInputValue(promocion.fechaInicio),
      fechaFin: toLocalInputValue(promocion.fechaFin),
    } : {
      codigo: "", descripcion: "", porcDesc: 10, activa: true, fechaInicio: "", fechaFin: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      promocion
        ? api.admin.promociones.actualizar(promocion.idPromocion, toPayload(data))
        : api.admin.promociones.crear(toPayload(data)),
    onSuccess: () => { toast.success(promocion ? "Promoción actualizada" : "Promoción creada"); onSuccess(); onOpenChange(false); },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo guardar la promoción")),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const activa = form.watch("activa");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{promocion ? "Editar promoción" : "Nueva promoción"}</DialogTitle>
          <DialogDescription>{promocion ? "Modificá los datos de la promoción." : "Agregá una nueva promoción."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promo-codigo">Código</Label>
            <Input id="promo-codigo" {...form.register("codigo")} placeholder="Ej: VERANO10" className="h-11" />
            {form.formState.errors.codigo && (
              <p className="text-xs text-destructive">{form.formState.errors.codigo.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="promo-descripcion">Descripción</Label>
            <Input id="promo-descripcion" {...form.register("descripcion")} placeholder="Opcional" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="promo-porc">Descuento (%)</Label>
            <Input id="promo-porc" type="number" step="0.01" min="0" max="100" {...form.register("porcDesc")} className="h-11" />
            {form.formState.errors.porcDesc && (
              <p className="text-xs text-destructive">{form.formState.errors.porcDesc.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-inicio">Válida desde</Label>
              <Input id="promo-inicio" type="datetime-local" {...form.register("fechaInicio")} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-fin">Válida hasta</Label>
              <Input id="promo-fin" type="datetime-local" {...form.register("fechaFin")} className="h-11" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="promo-activa"
              checked={activa}
              onCheckedChange={(v) => form.setValue("activa", v)}
            />
            <Label htmlFor="promo-activa">Activa</Label>
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {promocion ? "Guardar cambios" : "Crear promoción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPromocionesPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promocion | undefined>(undefined);

  const { data: promociones = [], isLoading, error } = useQuery({
    queryKey: ["admin-promociones"],
    queryFn: api.admin.promociones.listar,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.promociones.eliminar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-promociones"] }); toast.success("Promoción eliminada"); },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo eliminar la promoción")),
  });

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit = (p: Promocion) => { setEditing(p); setDialogOpen(true); };

  const fmtFecha = (iso?: string) => iso ? format(new Date(iso), "d MMM yyyy HH:mm", { locale: es }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Promociones</h2>
          <p className="text-sm text-muted-foreground">Gestioná los códigos de descuento del sistema.</p>
        </div>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="size-4" /> Agregar promoción
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : error ? (
          <div className="py-12"><EmptyState icon={AlertCircle} title="Error al cargar" description={getErrorMessage(error, "No se pudieron cargar las promociones")} /></div>
        ) : promociones.length === 0 ? (
          <div className="py-12"><EmptyState icon={Tag} title="Sin promociones" description="Agregá tu primera promoción." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">% Desc.</TableHead>
                <TableHead>Activa</TableHead>
                <TableHead>Vigencia</TableHead>
                <TableHead className="text-right w-28">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promociones.map((p) => (
                <TableRow key={p.idPromocion}>
                  <TableCell className="text-muted-foreground">{p.idPromocion}</TableCell>
                  <TableCell className="font-medium">{p.codigo}</TableCell>
                  <TableCell className="max-w-56 truncate">{p.descripcion || "—"}</TableCell>
                  <TableCell className="text-right">{p.porcDesc}%</TableCell>
                  <TableCell>
                    <span className={`inline-block size-2.5 rounded-full ${p.activa ? "bg-success" : "bg-destructive"}`} />
                    <span className="ml-1.5 text-sm">{p.activa ? "Sí" : "No"}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {fmtFecha(p.fechaInicio)} → {fmtFecha(p.fechaFin)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar promoción</AlertDialogTitle>
                          <AlertDialogDescription>¿Eliminar la promoción &ldquo;{p.codigo}&rdquo;? Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="rounded-full bg-destructive" onClick={() => deleteMutation.mutate(p.idPromocion)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <PromocionFormDialog open={dialogOpen} onOpenChange={setDialogOpen} promocion={editing} onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-promociones"] })} />
    </div>
  );
}
