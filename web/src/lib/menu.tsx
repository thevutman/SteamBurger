import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type Menu, type Product } from "./api";

type CartLine = { productId: string; qty: number };

interface ShopValue {
  menu: Menu | null;
  error: string | null;
  retry: () => void;
  product: (id: string) => Product | undefined;
  cart: (CartLine & { product: Product })[];
  count: number;
  subtotal: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopValue | null>(null);
const KEY = "steamburger.cart";

function readCart(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartLine[];
  } catch {
    return [];
  }
}

/** The menu (loaded once) and the cart (kept in the browser, so a reload does not empty it). */
export function ShopProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [lines, setLines] = useState<CartLine[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    setError(null);
    api.menu().then(
      (m) => alive && setMenu(m),
      (e: Error) => alive && setError(e.message),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* private mode: the cart lasts until the tab closes */
    }
  }, [lines]);

  const byId = useMemo(() => new Map(menu?.products.map((p) => [p.id, p]) ?? []), [menu]);
  const product = useCallback((id: string) => byId.get(id), [byId]);

  const cart = useMemo(
    () => lines.flatMap((l) => (byId.has(l.productId) ? [{ ...l, product: byId.get(l.productId)! }] : [])),
    [lines, byId],
  );

  const value: ShopValue = {
    menu,
    error,
    retry: () => setAttempt((n) => n + 1),
    product,
    cart,
    count: cart.reduce((n, l) => n + l.qty, 0),
    subtotal: Math.round(cart.reduce((s, l) => s + l.qty * l.product.price, 0) * 100) / 100,
    add: (id) =>
      setLines((ls) =>
        ls.some((l) => l.productId === id)
          ? ls.map((l) => (l.productId === id ? { ...l, qty: Math.min(20, l.qty + 1) } : l))
          : [...ls, { productId: id, qty: 1 }],
      ),
    setQty: (id, qty) =>
      setLines((ls) => (qty <= 0 ? ls.filter((l) => l.productId !== id) : ls.map((l) => (l.productId === id ? { ...l, qty: Math.min(20, qty) } : l)))),
    clear: () => setLines([]),
    cartOpen,
    setCartOpen,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop debe usarse dentro de <ShopProvider>");
  return value;
}
