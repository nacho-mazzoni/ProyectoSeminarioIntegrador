"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { Rol } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  telefono: z.string().optional(),
  idRol: z.string().min(1, "Seleccioná un rol"),
});

type FormData = z.infer<typeof schema>;

function UsuarioFormDialog({
  open, onOpenChange, roles, onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roles: Rol[];
  onSuccess: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", telefono: "", idRol: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.admin.usuarios.crear({
        email: data.email,
        password: data.password,
        telefono: data.telefono?.trim() || undefined,
        idRol: Number(data.idRol),
      }),
    onSuccess: () => { toast.success("Usuario creado"); onSuccess(); onOpenChange(false); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo crear el usuario"),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const idRol = form.watch("idRol");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>Creá un usuario con el rol que necesites.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usuario-email">Email</Label>
            <Input id="usuario-email" type="email" {...form.register("email")} className="h-11" />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usuario-password">Contraseña</Label>
              <Input id="usuario-password" type="password" {...form.register("password")} className="h-11" />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="usuario-telefono">Teléfono</Label>
              <Input id="usuario-telefono" {...form.register("telefono")} placeholder="Opcional" className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="usuario-rol">Rol</Label>
            <Select value={idRol} onValueChange={(v) => form.setValue("idRol", v)}>
              <SelectTrigger id="usuario-rol" className="h-11">
                <SelectValue placeholder="Seleccioná un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.idRol} value={String(r.idRol)}>{r.nombreRol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.idRol && (
              <p className="text-sm text-destructive">{form.formState.errors.idRol.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Crear usuario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsuariosPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: api.admin.usuarios.listar,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: api.admin.roles.listar,
  });

  const rolesDisponibles = roles.filter((r) => r.nombreRol !== "Administrador");

  const rolMutation = useMutation({
    mutationFn: ({ id, idRol }: { id: number; idRol: number }) =>
      api.admin.usuarios.actualizarRol(id, { idRol }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-usuarios"] }); toast.success("Rol actualizado"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo cambiar el rol"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => api.admin.usuarios.toggleActivo(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-usuarios"] }); toast.success("Estado actualizado"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo cambiar el estado"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Usuarios</h2>
          <p className="text-sm text-muted-foreground">Listado de usuarios registrados en el sistema.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="rounded-full">
          <Plus className="size-4" /> Nuevo usuario
        </Button>
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
              {usuarios.map((u) => {
                const rolActual = rolesDisponibles.find((r) => r.nombreRol.toUpperCase() === u.rol);
                return (
                  <TableRow key={u.idUsuario}>
                    <TableCell className="text-muted-foreground">{u.idUsuario}</TableCell>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>
                      {u.rol === "ADMINISTRADOR" ? (
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          ADMINISTRADOR
                        </span>
                      ) : rolActual ? (
                        <Select
                          value={String(rolActual.idRol)}
                          onValueChange={(v) =>
                            rolMutation.mutate({ id: u.idUsuario, idRol: Number(v) })
                          }
                          disabled={rolMutation.isPending}
                        >
                          <SelectTrigger className="h-9 w-36 rounded-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesDisponibles.map((r) => (
                              <SelectItem key={r.idRol} value={String(r.idRol)}>{r.nombreRol}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {u.rol}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={u.activo}
                          disabled={u.idUsuario === user?.idUsuario || toggleMutation.isPending}
                          onCheckedChange={() => toggleMutation.mutate(u.idUsuario)}
                          aria-label={u.activo ? `Desactivar ${u.email}` : `Activar ${u.email}`}
                        />
                        <span className="text-sm text-muted-foreground">{u.activo ? "Sí" : "No"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.telefono ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <UsuarioFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roles={rolesDisponibles}
        onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-usuarios"] })}
      />
    </div>
  );
}
