"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, LogIn, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { SaborResponse, AdicionalResponse } from "@/lib/types";
import { computeUnitPrice, formatPrice } from "@/lib/cart-utils";
import { getProductImage } from "@/lib/product-images";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { PageContainer } from "@/components/shared/PageContainer";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [sabores, setSabores] = useState<SaborResponse[]>([]);
  const [adicionales, setAdicionales] = useState<AdicionalResponse[]>([]);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.productos.obtener(Number(productId)),
  });

  const { data: allSabores = [] } = useQuery({
    queryKey: ["sabores"],
    queryFn: api.sabores.listar,
  });

  const { data: allAdicionales = [] } = useQuery({
    queryKey: ["adicionales"],
    queryFn: api.adicionales.listar,
  });

  const productSabores = useMemo(() => {
    if (product?.sabores && product.sabores.length > 0) {
      return product.sabores;
    }
    return allSabores;
  }, [product, allSabores]);

  const disponiblesSabores = productSabores.filter((s) => s.disponible);
  const disponiblesAdicionales = allAdicionales.filter((a) => a.disponible);

  const maxSabores = product?.maxSabores ?? 0;
  const requiereSabores = product?.categoria.requiereSabores ?? false;

  const unitPrice = useMemo(
    () => (product ? computeUnitPrice(product, adicionales) : 0),
    [product, adicionales],
  );

  const toggleSabor = (sabor: SaborResponse) => {
    if (maxSabores === 0) {
      toast.error("Este producto no permite elegir sabores");
      return;
    }
    setSabores((prev) => {
      if (prev.some((s) => s.idSabor === sabor.idSabor)) {
        return prev.filter((s) => s.idSabor !== sabor.idSabor);
      }
      if (prev.length >= maxSabores) {
        toast.error(`Solo podés elegir hasta ${maxSabores} sabor${maxSabores > 1 ? "es" : ""}`);
        return prev;
      }
      return [...prev, sabor];
    });
  };

  const toggleAdicional = (adicional: AdicionalResponse) =>
    setAdicionales((prev) =>
      prev.some((a) => a.idAdicional === adicional.idAdicional)
        ? prev.filter((a) => a.idAdicional !== adicional.idAdicional)
        : [...prev, adicional],
    );

  const handleAdd = () => {
    if (requiereSabores && sabores.length === 0) {
      toast.error("Este producto requiere al menos un sabor");
      return;
    }
    if (maxSabores === 0 && sabores.length > 0) {
      toast.error("Este producto no admite sabores");
      return;
    }
    if (maxSabores > 0 && sabores.length > maxSabores) {
      toast.error(`Solo podés elegir hasta ${maxSabores} sabor${maxSabores > 1 ? "es" : ""}`);
      return;
    }
    addItem(product!, qty, sabores, adicionales);
    toast.success(`${qty} × ${product!.nombre} agregado al carrito`);
  };

  if (isLoading) return <DetailSkeleton />;

  if (!product) {
    return (
      <PageContainer className="py-20 text-center">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
        <Button asChild className="mt-6">
          <Link href="/catalog">Volver al menú</Link>
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 rounded-full">
        <Link href="/catalog">
          <ArrowLeft className="size-4" />
          Volver al menú
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-4xl border border-border shadow-card">
          <Image
            src={getProductImage(product.nombre)}
            alt={product.nombre}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold sm:text-4xl">{product.nombre}</h1>
            <p className="text-sm text-muted-foreground">{product.categoria.nombre}</p>
            <p className="text-base text-muted-foreground">
              Stock: {product.stockEnvases} envases
              {product.maxSabores > 0 && ` · Hasta ${product.maxSabores} sabor${product.maxSabores > 1 ? "es" : ""}`}
            </p>
          </div>

          {maxSabores > 0 && disponiblesSabores.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-foreground">
                {maxSabores === 1 ? "Elegí tu sabor" : `Elegí tus sabores (hasta ${maxSabores})`}
              </legend>
              <div className="flex flex-wrap gap-2">
                {disponiblesSabores.map((s) => {
                  const active = sabores.some((s2) => s2.idSabor === s.idSabor);
                  const disabled = !active && sabores.length >= maxSabores;
                  return (
                    <button
                      key={s.idSabor}
                      type="button"
                      onClick={() => toggleSabor(s)}
                      disabled={disabled}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:bg-secondary",
                        disabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {s.nombre}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {disponiblesAdicionales.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-foreground">Agregar adicionales</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {disponiblesAdicionales.map((adicional) => {
                  const active = adicionales.some((a) => a.idAdicional === adicional.idAdicional);
                  return (
                    <button
                      key={adicional.idAdicional}
                      type="button"
                      onClick={() => toggleAdicional(adicional)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active ? "border-primary bg-secondary" : "border-border bg-card hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {adicional.nombre}
                      </span>
                      <span className="text-muted-foreground">+{formatPrice(adicional.precioExtra)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {isAuthenticated && user?.rol !== "ADMINISTRADOR" ? (
            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <QuantitySelector value={qty} onChange={setQty} />
                <span className="text-2xl font-semibold">{formatPrice(unitPrice * qty)}</span>
              </div>
              <Button size="lg" className="rounded-full sm:w-auto" onClick={handleAdd}>
                <ShoppingBag className="size-4" />
                Agregar al carrito
              </Button>
            </div>
          ) : user?.rol === "ADMINISTRADOR" ? (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft text-center">
              <p className="text-sm text-muted-foreground">
                Los administradores no pueden agregar productos al carrito.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft text-center">
              <p className="text-sm text-muted-foreground">
                Iniciá sesión para agregar productos al carrito
              </p>
              <Button asChild size="lg" className="mt-4 rounded-full">
                <Link href="/login">
                  <LogIn className="size-4" />
                  Iniciar sesión
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function DetailSkeleton() {
  return (
    <PageContainer className="py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-4xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
      </div>
    </PageContainer>
  );
}
