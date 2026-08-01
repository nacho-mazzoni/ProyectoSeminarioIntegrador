"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Pencil, Trash2, Droplets, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { getErrorMessage } from "@/lib/error-messages";
import type { SaborResponse } from "@/lib/types";
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
  nombre: z.string().min(1, "El nombre es requerido"),
  stockBaldes: z.coerce.number().int().nonnegative(),
  disponible: z.boolean(),
  capBalde: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function SaborFormDialog({
  open, onOpenChange, sabor, onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sabor?: SaborResponse;
  onSuccess: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: sabor ? {
      nombre: sabor.nombre,
      stockBaldes: sabor.stockBaldes,
      disponible: sabor.disponible,
      capBalde: sabor.capBalde ?? "",
    } : {
      nombre: "", stockBaldes: 0, disponible: true, capBalde: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      sabor
        ? api.admin.sabores.actualizar(sabor.idSabor, data)
        : api.admin.sabores.crear(data),
    onSuccess: () => { toast.success(sabor ? "Sabor actualizado" : "Sabor creado"); onSuccess(); onOpenChange(false); },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo guardar")),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const disponible = form.watch("disponible");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sabor ? "Editar sabor" : "Nuevo sabor"}</DialogTitle>
          <DialogDescription>{sabor ? "Modificá los datos del sabor." : "Agregá un nuevo sabor."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sabor-nombre">Nombre</Label>
            <Input id="sabor-nombre" {...form.register("nombre")} className="h-11" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sabor-stock">Stock baldes</Label>
              <Input id="sabor-stock" type="number" min="0" {...form.register("stockBaldes")} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sabor-cap">Cap. balde</Label>
              <Input id="sabor-cap" {...form.register("capBalde")} placeholder="Ej: 10L" className="h-11" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="sabor-disponible"
              checked={disponible}
              onCheckedChange={(v) => form.setValue("disponible", v)}
            />
            <Label htmlFor="sabor-disponible">Disponible</Label>
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {sabor ? "Guardar cambios" : "Crear sabor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminSaboresPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SaborResponse | undefined>(undefined);

  const { data: sabores = [], isLoading, error } = useQuery({
    queryKey: ["admin-sabores"],
    queryFn: api.admin.sabores.listar,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.sabores.eliminar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-sabores"] }); toast.success("Sabor eliminado"); },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo eliminar")),
  });

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit = (s: SaborResponse) => { setEditing(s); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Sabores</h2>
          <p className="text-sm text-muted-foreground">Gestioná los sabores disponibles.</p>
        </div>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="size-4" /> Agregar sabor
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : error ? (
          <div className="py-12"><EmptyState icon={AlertCircle} title="Error al cargar" description={getErrorMessage(error, "No se pudieron cargar los sabores")} /></div>
        ) : sabores.length === 0 ? (
          <div className="py-12"><EmptyState icon={Droplets} title="Sin sabores" description="Agregá tu primer sabor." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Stock baldes</TableHead>
                <TableHead>Cap. balde</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead className="text-right w-28">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sabores.map((s) => (
                <TableRow key={s.idSabor}>
                  <TableCell className="text-muted-foreground">{s.idSabor}</TableCell>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell className="text-right">{s.stockBaldes}</TableCell>
                  <TableCell>{s.capBalde ?? "—"}</TableCell>
                  <TableCell>
                    <span className={`inline-block size-2.5 rounded-full ${s.disponible ? "bg-success" : "bg-destructive"}`} />
                    <span className="ml-1.5 text-sm">{s.disponible ? "Sí" : "No"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openEdit(s)}><Pencil className="size-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar sabor</AlertDialogTitle>
                          <AlertDialogDescription>¿Eliminar &ldquo;{s.nombre}&rdquo;? Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="rounded-full bg-destructive" onClick={() => deleteMutation.mutate(s.idSabor)}>Eliminar</AlertDialogAction>
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

      <SaborFormDialog open={dialogOpen} onOpenChange={setDialogOpen} sabor={editing} onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-sabores"] })} />
    </div>
  );
}
