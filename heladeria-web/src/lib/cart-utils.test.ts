import { describe, expect, it } from "vitest";
import { buildCartItem, computeUnitPrice, lineTotal } from "@/lib/cart-utils";
import type { AdicionalResponse, ProductoResponse } from "@/lib/types";

const product: ProductoResponse = {
  idProducto: 1,
  nombre: "Pote",
  stockEnvases: 10,
  precioBase: 2500,
  maxSabores: 2,
  activo: true,
  categoria: { idCategoria: 1, nombre: "Pote", requiereSabores: true },
};

const extra: AdicionalResponse = {
  idAdicional: 1,
  nombre: "Salsa",
  precioExtra: 250,
  disponible: true,
};

describe("cart pricing", () => {
  it("computes unit and line totals with extras", () => {
    const item = buildCartItem(product, 2, [], [extra]);

    expect(computeUnitPrice(product, [extra])).toBe(2750);
    expect(lineTotal(item)).toBe(5500);
  });

  it("creates different keys for different configurations", () => {
    const first = buildCartItem(product, 1, [], []);
    const second = buildCartItem(product, 1, [], [extra]);

    expect(first.id).not.toBe(second.id);
  });
});
