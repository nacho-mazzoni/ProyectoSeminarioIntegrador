"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  idCategoria: z.coerce.number().positive("Seleccioná una categoría"),
  precioBase: z.coerce.number().positive("Debe ser un valor positivo"),
  stockEnvases: z.coerce.number().int().nonnegative("No puede ser negativo"),
  maxSabores: z.coerce.number().int().nonnegative("No puede ser negativo"),
});

type FormData = z.infer<typeof schema>;

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);

  const { data: product, isLoading: prodLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.productos.obtener(productId),
    enabled: !isNaN(productId),
  });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categorias.listar,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    values: product ? {
      nombre: product.nombre,
      idCategoria: product.categoria.idCategoria,
      precioBase: product.precioBase,
      stockEnvases: product.stockEnvases,
      maxSabores: product.maxSabores,
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.admin.productos.actualizar(productId, data),
    onSuccess: () => {
      toast.success("Producto actualizado");
      router.push("/admin/productos");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo actualizar el producto"),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);
  // eslint-disable-next-line react-hooks/incompatible-library
  const idCategoria = form.watch("idCategoria");

  if (prodLoading || catLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-muted-foreground">Producto no encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Editar producto</h2>
        <p className="text-sm text-muted-foreground">Modificá los datos del producto.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" {...form.register("nombre")} className="h-11" />
          {form.formState.errors.nombre && (
            <p className="text-xs text-destructive">{form.formState.errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select
            value={String(idCategoria)}
            onValueChange={(v) => form.setValue("idCategoria", Number(v))}
          >
            <SelectTrigger id="categoria" className="h-11">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.idCategoria} value={String(c.idCategoria)}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.idCategoria && (
            <p className="text-xs text-destructive">{form.formState.errors.idCategoria.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precioBase">Precio base ($)</Label>
            <Input id="precioBase" type="number" step="0.01" min="0" {...form.register("precioBase")} className="h-11" />
            {form.formState.errors.precioBase && (
              <p className="text-xs text-destructive">{form.formState.errors.precioBase.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockEnvases">Stock</Label>
            <Input id="stockEnvases" type="number" min="0" {...form.register("stockEnvases")} className="h-11" />
            {form.formState.errors.stockEnvases && (
              <p className="text-xs text-destructive">{form.formState.errors.stockEnvases.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxSabores">Máximo de sabores</Label>
          <Input id="maxSabores" type="number" min="0" {...form.register("maxSabores")} className="h-11" />
          {form.formState.errors.maxSabores && (
            <p className="text-xs text-destructive">{form.formState.errors.maxSabores.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
