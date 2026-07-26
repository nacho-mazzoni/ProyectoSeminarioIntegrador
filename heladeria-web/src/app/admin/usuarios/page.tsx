"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, AlertCircle } from "lucide-react";
import { api } from "@/services/api";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AdminUsuariosPage() {
  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: api.admin.usuarios.listar,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Usuarios</h2>
        <p className="text-sm text-muted-foreground">Listado de usuarios registrados en el sistema.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : error ? (
          <div className="py-12">
            <EmptyState icon={AlertCircle} title="Error al cargar" description={error.message} />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="py-12">
            <EmptyState icon={Users} title="Sin usuarios" description="Todavía no hay usuarios registrados." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Teléfono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.idUsuario}>
                  <TableCell className="text-muted-foreground">{u.idUsuario}</TableCell>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.rol === "ADMINISTRADOR"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {u.rol}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block size-2.5 rounded-full ${u.activo ? "bg-success" : "bg-destructive"}`} />
                    <span className="ml-1.5 text-sm">{u.activo ? "Sí" : "No"}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.telefono ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
}
