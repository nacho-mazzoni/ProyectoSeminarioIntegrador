"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, Plus, Search, X, IceCreamCone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/cart-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth-context";

export default function AdminProductsPage() {
  const [term, setTerm] = useState("");
  const qc = useQueryClient();
  const { isReady, isAuthenticated } = useAuth();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: api.admin.productos.listar,
    enabled: isReady && isAuthenticated,
  });
  const refreshProducts = () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }); };
  const availability = useMutation({ mutationFn: ({ id, activo }: { id: number; activo: boolean }) => api.admin.productos.cambiarDisponibilidad(id, activo), onSuccess: () => { refreshProducts(); toast.success("Disponibilidad actualizada"); }, onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo actualizar la disponibilidad") });
  const remove = useMutation({ mutationFn: api.admin.productos.eliminar, onSuccess: () => { refreshProducts(); toast.success("Producto dado de baja"); }, onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo dar de baja el producto") });

  const filtered = products.filter((p) =>
    !term.trim() || p.nombre.toLowerCase().includes(term.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Productos</h2>
          <p className="text-sm text-muted-foreground">Gestioná el catálogo de productos.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/productos/new">
            <Plus className="size-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos..."
          className="h-10 rounded-full pl-10 pr-10"
        />
        {term && (
          <button
            type="button"
            onClick={() => setTerm("")}
            className="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">No se pudo cargar el catálogo: {error.message}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={IceCreamCone}
              title={term ? "Sin resultados" : "Sin productos"}
              description={term ? "Probá con otra búsqueda." : "Todavía no hay productos cargados."}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio base</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Max sabores</TableHead>
               <TableHead>Disponibilidad</TableHead><TableHead className="text-right w-48">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.idProducto}>
                  <TableCell className="text-muted-foreground">{p.idProducto}</TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.categoria.nombre}</TableCell>
                  <TableCell className="text-right">{formatPrice(p.precioBase)}</TableCell>
                   <TableCell className={`text-right ${p.stockEnvases === 0 ? "text-destructive" : ""}`}>{p.stockEnvases === 0 ? "Sin stock" : p.stockEnvases}</TableCell>
                   <TableCell className="text-right">{p.maxSabores}</TableCell>
                   <TableCell><span className={`inline-block size-2.5 rounded-full ${p.activo ? "bg-success" : "bg-destructive"}`} /> <span className="ml-1 text-sm">{p.activo ? "Activo" : "Pausado"}</span></TableCell>
                   <TableCell className="text-right">
                     <Button asChild variant="outline" size="sm" className="rounded-full">
                       <Link href={`/admin/productos/${p.idProducto}/edit`}>Editar</Link>
                     </Button>
                     <Button variant="ghost" size="icon" className="rounded-full" title={p.activo ? "Pausar" : "Reactivar"} onClick={() => availability.mutate({ id: p.idProducto, activo: !p.activo })}><AlertTriangle className="size-4" /></Button>
                     <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="rounded-full text-destructive"><Trash2 className="size-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Dar de baja producto</AlertDialogTitle><AlertDialogDescription>Se quitará del catálogo público. Los pedidos históricos conservarán su referencia.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => remove.mutate(p.idProducto)}>Dar de baja</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
