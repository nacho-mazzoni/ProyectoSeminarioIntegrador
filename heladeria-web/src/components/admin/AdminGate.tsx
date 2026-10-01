"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isReady } = useAuth();
  const pathname = usePathname();

  if (!isReady) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-md text-center space-y-4">
          <ShieldAlert className="mx-auto size-12 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Acceso denegado</h1>
          <p className="text-muted-foreground">Iniciá sesión para acceder al panel de administración.</p>
          <Button asChild className="rounded-full">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const isStaff = user?.rol === "ADMINISTRADOR" || user?.rol === "CAJERO";
  const cashierAllowed = ["/admin/pedidos", "/admin/productos", "/admin/promociones"];
  const canAccess = user?.rol === "ADMINISTRADOR"
    || (user?.rol === "CAJERO" && cashierAllowed.some((route) => pathname === route || pathname.startsWith(`${route}/`)));

  if (!isStaff || !canAccess) {
    return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-md text-center space-y-4">
          <ShieldAlert className="mx-auto size-12 text-destructive" />
          <h1 className="text-2xl font-semibold">Sin permisos</h1>
           <p className="text-muted-foreground">No tenés permisos para acceder a esta sección.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return <>{children}</>;
}
