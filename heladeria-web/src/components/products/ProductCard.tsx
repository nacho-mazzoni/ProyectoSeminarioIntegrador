"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { ProductoResponse } from "@/lib/types";
import { formatPrice } from "@/lib/cart-utils";
import { getProductImage } from "@/lib/product-images";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductoResponse }) {
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.categoria.requiereSabores || product.maxSabores > 0) {
      toast.info("Seleccioná los sabores en la página del producto");
      return;
    }
    addItem(product, 1, [], []);
    toast.success(`${product.nombre} agregado al carrito`);
  };

  const canAdd = isAuthenticated && user?.rol !== "ADMINISTRADOR";

  return (
    <Link
      href={`/products/${product.idProducto}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={getProductImage(product.nombre)}
          alt={product.nombre}
          width={800}
          height={800}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {product.nombre}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">{product.categoria.nombre}</p>
        {product.maxSabores > 0 && (
          <p className="text-xs text-muted-foreground">Hasta {product.maxSabores} sabor{product.maxSabores > 1 ? "es" : ""}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-foreground">{formatPrice(product.precioBase)}</span>
          <Button
            size="icon"
            onClick={handleAdd}
            disabled={!canAdd}
            aria-label={`Agregar ${product.nombre} al carrito`}
            className={cn(
              "size-10 rounded-full",
              !canAdd && "pointer-events-auto opacity-30 grayscale hover:bg-primary",
            )}
          >
            <Plus className="size-5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
