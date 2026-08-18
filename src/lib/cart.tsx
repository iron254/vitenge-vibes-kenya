import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, size: string) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "kitenge-cart";
const lineKey = (id: string, size: string) => `${id}__${size}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((product: Product, size: string) => {
    setLines((prev) => {
      const key = lineKey(product.id, size);
      const existing = prev.find((l) => l.id === key);
      if (existing) {
        return prev.map((l) => (l.id === key ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        { id: key, name: product.name, price: product.price, image: product.image, size, qty: 1 },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.id !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.id === key ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l])),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, count, subtotal, add, remove, setQty, clear, open, setOpen };
  }, [lines, add, remove, setQty, clear, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
