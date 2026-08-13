"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Pencil, Plus, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { ApiError } from "@/services/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const roleLabels: Record<string, string> = { CLIENTE: "Cliente", CAJERO: "Cajero", ADMINISTRADOR: "Administrador" };

export default function AdminUsuariosPage() {
  const qc = useQueryClient();
  const { user, isReady, isAuthenticated } = useAuth();
  const [term, setTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ email: "", password: "", idRol: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { data: usuarios = [], isLoading, error } = useQuery({ queryKey: ["admin-usuarios"], queryFn: api.admin.usuarios.listar, enabled: isReady && isAuthenticated });
  const { data: roles = [] } = useQuery({ queryKey: ["admin-roles"], queryFn: api.admin.usuarios.roles, enabled: isReady && isAuthenticated });

  const roleMutation = useMutation({
    mutationFn: ({ id, idRol }: { id: number; idRol: number }) => api.admin.usuarios.actualizarRol(id, idRol),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-usuarios"] }); toast.success("Rol actualizado"); },
    onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo actualizar el rol"),
  });
  const activeMutation = useMutation({
    mutationFn: api.admin.usuarios.toggleActivo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-usuarios"] }); toast.success("Estado del usuario actualizado"); },
    onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo actualizar el estado"),
  });
  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { email: form.email.trim(), ...(form.password ? { password: form.password } : {}), idRol: Number(form.idRol) };
      return editingId === null ? api.admin.usuarios.crear(payload) : api.admin.usuarios.actualizar(editingId, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-usuarios"] });
      setDialogOpen(false);
      toast.success(editingId === null ? "Usuario creado" : "Usuario actualizado");
    },
    onError: (err) => {
      setFieldErrors(err instanceof ApiError ? err.fieldErrors : {});
      toast.error(err instanceof Error ? err.message : "No se pudo guardar el usuario");
    },
  });

  const openNew = () => {
    setEditingId(null);
    setFieldErrors({});
    setForm({ email: "", password: "", idRol: roles[0] ? String(roles[0].idRol) : "" });
    setDialogOpen(true);
  };
  const openEdit = (usuario: typeof usuarios[number]) => {
    const role = roles.find((item) => item.nombreRol === usuario.rol);
    setEditingId(usuario.idUsuario);
    setFieldErrors({});
    setForm({ email: usuario.email, password: "", idRol: role ? String(role.idRol) : "" });
    setDialogOpen(true);
  };

  const filtered = useMemo(() => usuarios.filter((u) => {
    const matchesTerm = !term.trim() || u.email.toLowerCase().includes(term.toLowerCase()) || (u.telefono ?? "").includes(term);
    return matchesTerm && (roleFilter === "todos" || u.rol === roleFilter);
  }), [usuarios, term, roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-xl font-semibold">Usuarios</h2><p className="text-sm text-muted-foreground">Administrá roles, acceso y contraseñas temporales.</p></div><Button onClick={openNew} className="rounded-full"><Plus className="size-4" /> Nuevo usuario</Button></div>
      <div className="flex flex-wrap gap-3">
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar por email o teléfono" className="max-w-sm" />
        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos los roles</SelectItem>{roles.map((role) => <SelectItem key={role.idRol} value={role.nombreRol}>{roleLabels[role.nombreRol] ?? role.nombreRol}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {isLoading ? <div className="space-y-4 p-6">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div> : error ? <div className="py-12"><EmptyState icon={AlertCircle} title="Error al cargar usuarios" description={error.message} /></div> : filtered.length === 0 ? <div className="py-12"><EmptyState icon={Users} title="Sin usuarios" description="No hay usuarios que coincidan con el filtro." /></div> : (
          <Table><TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Rol</TableHead><TableHead>Estado</TableHead><TableHead>Teléfono</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>
             {filtered.map((u) => <TableRow key={u.idUsuario}><TableCell className="font-medium">{u.email}</TableCell><TableCell><Select value={u.rol} onValueChange={(value) => { const role = roles.find((r) => r.nombreRol === value); if (role) roleMutation.mutate({ id: u.idUsuario, idRol: role.idRol }); }} disabled={roleMutation.isPending || u.idUsuario === user?.idUsuario}><SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role.idRol} value={role.nombreRol}>{roleLabels[role.nombreRol] ?? role.nombreRol}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Badge variant={u.activo ? "secondary" : "outline"}>{u.activo ? "Activo" : "Desactivado"}</Badge></TableCell><TableCell className="text-muted-foreground">{u.telefono ?? "Sin teléfono"}</TableCell><TableCell className="flex justify-end gap-2 text-right"><Button variant="outline" size="sm" className="rounded-full" onClick={() => openEdit(u)}><Pencil className="size-3.5" /> Editar</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="rounded-full" disabled={u.idUsuario === user?.idUsuario || activeMutation.isPending}>{u.activo ? "Desactivar" : "Activar"}</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{u.activo ? "Desactivar usuario" : "Activar usuario"}</AlertDialogTitle><AlertDialogDescription>{u.activo ? `¿Desactivar a ${u.email}? No podrá iniciar sesión.` : `¿Activar a ${u.email}?`}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => activeMutation.mutate(u.idUsuario)}>{u.activo ? "Desactivar" : "Activar"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>)}
          </TableBody></Table>
        )}
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Por seguridad, no podés modificar tu propio rol ni desactivar tu cuenta.</p>
       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editingId === null ? "Nuevo usuario" : "Editar usuario"}</DialogTitle><DialogDescription>La contraseña se envía al servidor y nunca se muestra en texto plano después de guardar.</DialogDescription></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label htmlFor="usuario-email">Email</Label><Input id="usuario-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required aria-invalid={!!fieldErrors.email} />{fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}</div><div className="space-y-2"><Label htmlFor="usuario-password">Contraseña temporal</Label><Input id="usuario-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId === null ? "Mínimo 8 caracteres, letras y números" : "Dejar vacío para conservarla"} required={editingId === null} aria-invalid={!!fieldErrors.password} />{fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}</div><div className="space-y-2"><Label>Rol</Label><Select value={form.idRol} onValueChange={(idRol) => setForm({ ...form, idRol })}><SelectTrigger aria-invalid={!!fieldErrors.idRol}><SelectValue placeholder="Seleccionar rol" /></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role.idRol} value={String(role.idRol)}>{roleLabels[role.nombreRol] ?? role.nombreRol}</SelectItem>)}</SelectContent></Select>{fieldErrors.idRol && <p className="text-xs text-destructive">{fieldErrors.idRol}</p>}</div></div><DialogFooter><Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.email || (editingId === null && !form.password) || !form.idRol} className="rounded-full">{saveMutation.isPending ? "Guardando..." : "Guardar usuario"}</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
