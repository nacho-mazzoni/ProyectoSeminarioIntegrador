"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import type { AdicionalResponse } from "@/lib/types";
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
  precioExtra: z.coerce.number().positive("Debe ser positivo"),
  disponible: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function AdicionalFormDialog({
  open, onOpenChange, adicional, onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adicional?: AdicionalResponse;
  onSuccess: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: adicional ? {
      nombre: adicional.nombre,
      precioExtra: adicional.precioExtra,
      disponible: adicional.disponible,
    } : {
      nombre: "", precioExtra: 0, disponible: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      adicional
        ? api.admin.adicionales.actualizar(adicional.idAdicional, data)
        : api.admin.adicionales.crear(data),
    onSuccess: () => { toast.success(adicional ? "Adicional actualizado" : "Adicional creado"); onSuccess(); onOpenChange(false); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar"),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const disponible = form.watch("disponible");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adicional ? "Editar adicional" : "Nuevo adicional"}</DialogTitle>
          <DialogDescription>{adicional ? "Modificá los datos del adicional." : "Agregá un nuevo adicional."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adic-nombre">Nombre</Label>
            <Input id="adic-nombre" {...form.register("nombre")} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adic-precio">Precio extra ($)</Label>
            <Input id="adic-precio" type="number" step="0.01" min="0" {...form.register("precioExtra")} className="h-11" />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="adic-disponible"
              checked={disponible}
              onCheckedChange={(v) => form.setValue("disponible", v)}
            />
            <Label htmlFor="adic-disponible">Disponible</Label>
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {adicional ? "Guardar cambios" : "Crear adicional"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminAdicionalesPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdicionalResponse | undefined>(undefined);

  const { data: adicionales = [], isLoading } = useQuery({
    queryKey: ["admin-adicionales"],
    queryFn: api.admin.adicionales.listar,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.adicionales.eliminar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-adicionales"] }); toast.success("Adicional eliminado"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo eliminar"),
  });

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit = (a: AdicionalResponse) => { setEditing(a); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Adicionales</h2>
          <p className="text-sm text-muted-foreground">Gestioná los adicionales para los productos.</p>
        </div>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="size-4" /> Agregar adicional
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : adicionales.length === 0 ? (
          <div className="py-12"><EmptyState icon={Sparkles} title="Sin adicionales" description="Agregá tu primer adicional." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Precio extra</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead className="text-right w-28">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adicionales.map((a) => (
                <TableRow key={a.idAdicional}>
                  <TableCell className="text-muted-foreground">{a.idAdicional}</TableCell>
                  <TableCell className="font-medium">{a.nombre}</TableCell>
                  <TableCell className="text-right">{formatPrice(a.precioExtra)}</TableCell>
                  <TableCell>
                    <span className={`inline-block size-2.5 rounded-full ${a.disponible ? "bg-success" : "bg-destructive"}`} />
                    <span className="ml-1.5 text-sm">{a.disponible ? "Sí" : "No"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openEdit(a)}><Pencil className="size-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar adicional</AlertDialogTitle>
                          <AlertDialogDescription>¿Eliminar &ldquo;{a.nombre}&rdquo;? Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="rounded-full bg-destructive" onClick={() => deleteMutation.mutate(a.idAdicional)}>Eliminar</AlertDialogAction>
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

      <AdicionalFormDialog open={dialogOpen} onOpenChange={setDialogOpen} adicional={editing} onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-adicionales"] })} />
    </div>
  );
}
