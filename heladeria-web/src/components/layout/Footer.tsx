import Link from "next/link";
import { IceCream } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <PageContainer className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
                <IceCream className="size-5" />
              </span>
              <span className="font-display text-xl font-semibold">Rumba Habana</span>
            </div>
            <p className="max-w-xs text-sm text-primary-foreground/70">
              Helados artesanales elaborados diariamente con ingredientes naturales. Pedí online y recibilo en tu casa.
            </p>
          </div>

          <nav aria-label="Tienda" className="space-y-3 text-sm">
            <p className="font-semibold text-primary-foreground">Tienda</p>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link href="/catalog" className="transition-colors hover:text-primary-foreground">
                  Menú completo
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-primary-foreground">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition-colors hover:text-primary-foreground">
                  Mis pedidos
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Cuenta" className="space-y-3 text-sm">
            <p className="font-semibold text-primary-foreground">Cuenta</p>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link href="/account" className="transition-colors hover:text-primary-foreground">
                  Perfil
                </Link>
              </li>
              <li>
                <Link href="/addresses" className="transition-colors hover:text-primary-foreground">
                  Direcciones
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-primary-foreground">
                  Ingresar
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/20 pt-6 text-sm text-primary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Rumba Habana. Todos los derechos reservados.</p>
          <p>Hecho con amor ♥</p>
        </div>
      </PageContainer>
    </footer>
  );
}
