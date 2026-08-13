"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
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
  const loadedKey = useRef<string | null>(null);
  const { user, isReady } = useAuth();
  const storageKey = `${STORAGE_KEY}:${user?.idUsuario ?? "anonimo"}`;

  useEffect(() => {
    if (!isReady) return;
    loadedKey.current = null;
    try {
      const s = user ? localStorage.getItem(storageKey) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(s ? JSON.parse(s) : []);
      loadedKey.current = storageKey;
    } catch { /* ignore */ }
  }, [isReady, storageKey, user]);

  useEffect(() => {
    if (!isReady || !user || loadedKey.current !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, isReady, storageKey, user]);

  const addItem: CartContextValue["addItem"] = (product, quantity, sabores = [], adicionales = []) => {
    const next = buildCartItem(product, quantity, sabores, adicionales);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === next.id);
      const nextQuantity = Math.min(product.stockEnvases, (existing?.quantity ?? 0) + quantity);
      if (nextQuantity <= 0) return prev;
      if (existing) {
        return prev.map((i) => (i.id === next.id ? { ...i, quantity: nextQuantity } : i));
      }
      return [...prev, { ...next, quantity: Math.min(product.stockEnvases, quantity) }];
    });
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (id, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      return { ...i, quantity: Math.min(i.product.stockEnvases, quantity) };
    }));
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
