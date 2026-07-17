"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, ProductoResponse, SaborResponse, AdicionalResponse } from "@/lib/types";
import { buildCartItem, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, lineTotal } from "@/lib/cart-utils";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (product: ProductoResponse, quantity: number, sabores?: SaborResponse[], adicionales?: AdicionalResponse[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rumba-habana-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const addItem: CartContextValue["addItem"] = (product, quantity, sabores = [], adicionales = []) => {
    const next = buildCartItem(product, quantity, sabores, adicionales);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === next.id);
      if (existing) {
        return prev.map((i) => (i.id === next.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, next];
    });
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (id, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem: CartContextValue["removeItem"] = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const clear = () => setItems([]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    return {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
