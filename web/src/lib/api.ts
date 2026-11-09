export const API = (import.meta.env.VITE_API_URL ?? "http://localhost:3000/api").replace(/\/$/, "");

export type Category = { slug: string; name: string };

export type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
};

export type Menu = { categories: Category[]; products: Product[]; deliveryFee: number };

export type Status = "recibido" | "preparando" | "listo" | "en-camino" | "entregado" | "cancelado";

export type Order = {
  _id: string;
  code: string;
  customer: { name: string; phone: string; address: string };
  mode: "domicilio" | "recoger";
  payment: "efectivo" | "tarjeta";
  items: { productId: string; name: string; price: number; qty: number; notes: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: Status;
  history: { status: Status; at: string }[];
  createdAt: string;
};

export type NewOrder = {
  customer: { name: string; phone: string; address: string };
  mode: Order["mode"];
  payment: Order["payment"];
  items: { productId: string; qty: number; notes?: string }[];
};

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...init, headers });
  } catch {
    throw new Error("No pudimos conectar con la cocina. Revisa tu conexión e inténtalo de nuevo.");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(body?.message ?? "Algo salió mal"), { status: res.status });
  return body as T;
}

export const api = {
  menu: () => request<Menu>("/menu"),
  createOrder: (order: NewOrder) => request<Order>("/orders", { method: "POST", body: JSON.stringify(order) }),
  order: (id: string) => request<Order>(`/orders/${id}`),
  kitchenLogin: (password: string) =>
    request<{ token: string }>("/kitchen/login", { method: "POST", body: JSON.stringify({ password }) }),
  kitchenDemo: () => request<{ token: string }>("/kitchen/demo", { method: "POST" }),
  kitchenOrders: (token: string) => request<Order[]>("/kitchen/orders", {}, token),
  setStatus: (token: string, id: string, status: Status) =>
    request<Order>(`/kitchen/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }, token),
};

export const money = (n: number) => `$${n.toFixed(2)}`;

export const statusLabel: Record<Status, string> = {
  recibido: "Recibido",
  preparando: "En la plancha",
  listo: "Listo para recoger",
  "en-camino": "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
