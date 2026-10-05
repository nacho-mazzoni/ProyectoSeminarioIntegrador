import type { CartItem, ProductoResponse, SaborResponse, AdicionalResponse } from "@/lib/types";

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

export function computeUnitPrice(product: ProductoResponse, adicionales: AdicionalResponse[], saboresCount?: number): number {
  let price = product.precioBase;
  if (product.maxBochas && product.precioPorBocha && saboresCount && saboresCount > 1) {
    price += product.precioPorBocha * (saboresCount - 1);
  }
  return price + adicionales.reduce((sum, a) => sum + a.precioExtra, 0);
}

export function lineTotal(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

export function buildCartItem(
  product: ProductoResponse,
  quantity: number,
  sabores: SaborResponse[],
  adicionales: AdicionalResponse[],
): CartItem {
  const saboresKey = sabores.map((s) => s.idSabor).sort().join("-");
  const adicKey = adicionales.map((a) => a.idAdicional).sort().join("-");
  return {
    id: `${product.idProducto}:${saboresKey}:${adicKey}`,
    product,
    quantity,
    sabores,
    adicionales,
    unitPrice: computeUnitPrice(product, adicionales, sabores.length),
  };
}

