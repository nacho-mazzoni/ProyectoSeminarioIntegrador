"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, ProductoResponse, SaborResponse, AdicionalResponse } from "@/lib/types";
import { buildCartItem, lineTotal } from "@/lib/cart-utils";
import { useAuth } from "@/context/auth-context";

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

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = user ? `rumba-habana-cart-${user.idUsuario}` : "rumba-habana-cart-guest";

  useEffect(() => {
    if (!isReady) return;
    try {
      const s = localStorage.getItem(storageKey);
      if (s) { 
        setItems(JSON.parse(s)); 
      } else {
        setItems([]);
      }
    } catch { /* ignore */ }
    setIsLoaded(true);
  }, [storageKey, isReady]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, storageKey, isLoaded]);

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
    return {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee: 0,
      total: subtotal,
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
