"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Pencil, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import type { ZonaEnvioResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  nombreZona: z.string().min(1, "El nombre de la zona es requerido"),
  costoEnvio: z.coerce.number().positive("Debe ser positivo"),
});

type FormData = z.infer<typeof schema>;

function ZonaFormDialog({
  open, onOpenChange, zona, onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  zona?: ZonaEnvioResponse;
  onSuccess: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: zona ? {
      nombreZona: zona.nombreZona,
      costoEnvio: zona.costoEnvio,
    } : {
      nombreZona: "", costoEnvio: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      zona
        ? api.admin.zonas.actualizar(zona.idZona, data)
        : api.admin.zonas.crear(data),
    onSuccess: () => { toast.success(zona ? "Zona actualizada" : "Zona creada"); onSuccess(); onOpenChange(false); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{zona ? "Editar zona" : "Nueva zona"}</DialogTitle>
          <DialogDescription>{zona ? "Modificá los datos de la zona." : "Agregá una nueva zona de envío."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zona-nombre">Nombre de la zona</Label>
            <Input id="zona-nombre" {...form.register("nombreZona")} placeholder="Ej: Centro" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zona-costo">Costo de envío ($)</Label>
            <Input id="zona-costo" type="number" step="0.01" min="0" {...form.register("costoEnvio")} className="h-11" />
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {zona ? "Guardar cambios" : "Crear zona"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminZonasPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ZonaEnvioResponse | undefined>(undefined);
  const { isReady, isAuthenticated } = useAuth();

  const { data: zonas = [], isLoading } = useQuery({
    queryKey: ["admin-zonas"],
    queryFn: api.admin.zonas.listar,
    enabled: isReady && isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.zonas.eliminar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-zonas"] }); toast.success("Zona eliminada"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo eliminar"),
  });

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit = (z: ZonaEnvioResponse) => { setEditing(z); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Zonas de envío</h2>
          <p className="text-sm text-muted-foreground">Gestioná las zonas de cobertura de delivery.</p>
        </div>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="size-4" /> Agregar zona
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : zonas.length === 0 ? (
          <div className="py-12"><EmptyState icon={Truck} title="Sin zonas" description="Agregá tu primera zona de envío." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Costo de envío</TableHead>
                <TableHead className="text-right w-28">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zonas.map((z) => (
                <TableRow key={z.idZona}>
                  <TableCell className="text-muted-foreground">{z.idZona}</TableCell>
                  <TableCell className="font-medium">{z.nombreZona}</TableCell>
                  <TableCell className="text-right">{formatPrice(z.costoEnvio)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openEdit(z)}><Pencil className="size-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar zona</AlertDialogTitle>
                          <AlertDialogDescription>¿Eliminar &ldquo;{z.nombreZona}&rdquo;? Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="rounded-full bg-destructive" onClick={() => deleteMutation.mutate(z.idZona)}>Eliminar</AlertDialogAction>
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

      <ZonaFormDialog open={dialogOpen} onOpenChange={setDialogOpen} zona={editing} onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-zonas"] })} />
    </div>
  );
}
