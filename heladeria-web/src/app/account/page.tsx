"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MapPin, Package, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { getErrorMessage } from "@/lib/error-messages";
import { useAuth } from "@/context/auth-context";
import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  const { user, logout, refreshUser: refresh } = useAuth();
  const router = useRouter();

  const [telefono, setTelefono] = useState(user?.telefono ?? "");
  const [saving, setSaving] = useState(false);

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const emailFirst = (user?.email ?? "U")[0].toUpperCase();

  const handleTelefono = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.clientes.actualizar({ email: user!.email, telefono: telefono || undefined });
      await refresh();
      toast.success("Datos actualizados");
    } catch (err) {
      const msg = getErrorMessage(err, "Error al guardar");
      console.error("Error al actualizar perfil:", msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPass(true);
    try {
      await api.clientes.cambiarPassword({ passwordActual: passActual, passwordNueva: passNueva });
      toast.success("Contraseña actualizada");
      setPassActual("");
      setPassNueva("");
    } catch (err) {
      const msg = getErrorMessage(err, "Error al cambiar contraseña");
      console.error("Error al cambiar contraseña:", msg);
      toast.error(msg);
    } finally {
      setChangingPass(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    try {
      await api.clientes.eliminarCuenta();
      logout();
      router.push("/");
    } catch (err) {
      const msg = getErrorMessage(err, "Error al eliminar cuenta");
      console.error("Error al eliminar cuenta:", msg);
      toast.error(msg);
      setDeleting(false);
    }
  };

  return (
    <AuthGate>
      <PageContainer className="py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Mi perfil</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                    {emailFirst}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-xl font-semibold">{user?.email}</h2>
                  {user?.telefono && (
                    <p className="truncate text-sm text-muted-foreground">Tel: {user.telefono}</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-full"
                onClick={() => { logout(); router.push("/"); }}
              >
                Cerrar sesión
              </Button>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <QuickLink href="/orders" icon={Package} title="Mis pedidos" description="Seguí tus pedidos recientes" />
              <QuickLink href="/addresses" icon={MapPin} title="Direcciones" description="Administrá tus direcciones" />
              <QuickLink href="/catalog" icon={User} title="Pedir de nuevo" description="Explorá el menú completo" />
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Actualizá tus datos de contacto.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTelefono} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email ?? ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 1155551234" />
                  </div>
                  <Button type="submit" className="rounded-full" disabled={saving}>
                    {saving && <Loader2 className="size-4 animate-spin" />}
                    Guardar cambios
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cambiar contraseña</CardTitle>
                <CardDescription>Usá una contraseña segura que no uses en otros sitios.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pass-actual">Contraseña actual</Label>
                    <Input id="pass-actual" type="password" value={passActual} onChange={(e) => setPassActual(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pass-nueva">Nueva contraseña</Label>
                    <Input id="pass-nueva" type="password" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} required minLength={6} />
                  </div>
                  <Button type="submit" className="rounded-full" disabled={changingPass}>
                    {changingPass && <Loader2 className="size-4 animate-spin" />}
                    Actualizar contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de peligro</CardTitle>
                <CardDescription>Eliminá tu cuenta y todos tus datos de forma permanente.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="rounded-full" onClick={handleEliminar} disabled={deleting}>
                  {deleting && <Loader2 className="size-4 animate-spin" />}
                  <Trash2 className="size-4" />
                  Eliminar mi cuenta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AuthGate>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Package;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
