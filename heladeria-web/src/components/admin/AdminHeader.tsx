"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/productos": "Productos",
    "/admin/pedidos": "Pedidos",
    "/admin/sabores": "Sabores",
    "/admin/adicionales": "Adicionales",
    "/admin/categorias": "Categorías",
    "/admin/zonas": "Zonas de envío",
    "/admin/usuarios": "Usuarios",
  };

  const title = Object.entries(titles).find(([path]) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path),
  )?.[1] ?? "Admin";

  const emailFirst = (user?.email ?? "A")[0].toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={onMenuClick}>
            <Menu className="size-5" />
          </Button>
        )}
        <h1 className="font-display text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="rounded-full">Admin</Badge>
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {emailFirst}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">{user?.email}</span>
        </div>
      </div>
    </header>
  );
}
