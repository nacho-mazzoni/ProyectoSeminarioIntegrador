"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IceCream,
  LayoutDashboard,
  Package,
  Droplets,
  Sparkles,
  Tags,
  Truck,
  Users,
  LogOut,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: IceCream },
  { href: "/admin/orders", label: "Pedidos", icon: Package },
  { href: "/admin/sabores", label: "Sabores", icon: Droplets },
  { href: "/admin/adicionales", label: "Adicionales", icon: Sparkles },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/zonas", label: "Zonas de envío", icon: Truck },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <aside className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary-foreground/15">
            <IceCream className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">Rumba Habana</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground/70 hover:text-primary-foreground" onClick={onClose}>
            <X className="size-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                )}
              >
                <link.icon className="size-4.5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-primary-foreground/15 p-3 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-xl text-primary-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Volver a la tienda
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-xl text-primary-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          onClick={() => { logout(); router.push("/"); }}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
