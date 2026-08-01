"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Pencil, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { CategoriaResponse } from "@/lib/types";
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
  requiereSabores: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function CategoriaFormDialog({
  open, onOpenChange, categoria, onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categoria?: CategoriaResponse;
  onSuccess: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: categoria ? {
      nombre: categoria.nombre,
      requiereSabores: categoria.requiereSabores,
    } : {
      nombre: "", requiereSabores: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      categoria
        ? api.admin.categorias.actualizar(categoria.idCategoria, data)
        : api.admin.categorias.crear(data),
    onSuccess: () => { toast.success(categoria ? "Categoría actualizada" : "Categoría creada"); onSuccess(); onOpenChange(false); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar"),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const requiereSabores = form.watch("requiereSabores");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categoria ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
          <DialogDescription>{categoria ? "Modificá los datos de la categoría." : "Agregá una nueva categoría."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-nombre">Nombre</Label>
            <Input id="cat-nombre" {...form.register("nombre")} className="h-11" />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="cat-sabores"
              checked={requiereSabores}
              onCheckedChange={(v) => form.setValue("requiereSabores", v)}
            />
            <Label htmlFor="cat-sabores">Requiere selección de sabores</Label>
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {categoria ? "Guardar cambios" : "Crear categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCategoriasPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaResponse | undefined>(undefined);

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ["admin-categorias"],
    queryFn: api.admin.categorias.listar,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.categorias.eliminar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categorias"] }); toast.success("Categoría eliminada"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo eliminar"),
  });

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit = (c: CategoriaResponse) => { setEditing(c); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Categorías</h2>
          <p className="text-sm text-muted-foreground">Gestioná las categorías de productos.</p>
        </div>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="size-4" /> Agregar categoría
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : categorias.length === 0 ? (
          <div className="py-12"><EmptyState icon={Tags} title="Sin categorías" description="Agregá tu primera categoría." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Requiere sabores</TableHead>
                <TableHead className="text-right w-28">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((c) => (
                <TableRow key={c.idCategoria}>
                  <TableCell className="text-muted-foreground">{c.idCategoria}</TableCell>
                  <TableCell className="font-medium">{c.nombre}</TableCell>
                  <TableCell>
                    <span className={`inline-block size-2.5 rounded-full ${c.requiereSabores ? "bg-success" : "bg-secondary"}`} />
                    <span className="ml-1.5 text-sm">{c.requiereSabores ? "Sí" : "No"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openEdit(c)}><Pencil className="size-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
                          <AlertDialogDescription>¿Eliminar &ldquo;{c.nombre}&rdquo;? Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="rounded-full bg-destructive" onClick={() => deleteMutation.mutate(c.idCategoria)}>Eliminar</AlertDialogAction>
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

      <CategoriaFormDialog open={dialogOpen} onOpenChange={setDialogOpen} categoria={editing} onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-categorias"] })} />
    </div>
  );
}
