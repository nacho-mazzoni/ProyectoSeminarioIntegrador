"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Package, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const emailFirst = (user?.email ?? "U")[0].toUpperCase();

  return (
    <AuthGate>
      <PageContainer className="py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Mi perfil</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
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
              onClick={() => {
                logout();
                router.push("/");
              }}
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
