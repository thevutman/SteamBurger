import { useCallback, useEffect, useState, type FormEvent } from "react";
import { API, api, money, statusLabel, type Order, type Status } from "@/lib/api";

const KEY = "steamburger.kitchen";

const readToken = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/** Where orders arrive live, and where the cook moves them along. */
export function Kitchen() {
  const [token, setToken] = useState<string | null>(readToken);
  const save = (t: string | null) => {
    try {
      if (t) sessionStorage.setItem(KEY, t);
      else sessionStorage.removeItem(KEY);
    } catch {
      /* the session just lasts until reload */
    }
    setToken(t);
  };
  return token ? <Board token={token} onExpired={() => save(null)} /> : <Login onToken={save} />;
}

function Login({ onToken }: { onToken: (t: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      onToken((await api.kitchenLogin(password)).token);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 pt-24">
      <div className="w-full max-w-sm text-center">
        <h1 className="script text-[48px]">Cocina</h1>
        <p className="mt-2 text-[15px] text-smoke">Aquí llegan los pedidos en vivo.</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input className="field" type="password" placeholder="Contraseña de la cocina" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} aria-label="Contraseña de la cocina" />
          {error ? <p role="alert" className="text-[14px] text-[#ff8a80]">{error}</p> : null}
          <button type="submit" className="btn-red">Entrar</button>
        </form>
        <button type="button" className="btn-order mt-6 w-full" onClick={async () => onToken((await api.kitchenDemo()).token)}>
          Entrar como demo
        </button>
        <p className="mt-3 text-[12px] text-smoke">El modo demo es para visitantes del portafolio.</p>
      </div>
    </main>
  );
}

const columns: { title: string; statuses: Status[] }[] = [
  { title: "Nuevos", statuses: ["recibido"] },
  { title: "En la plancha", statuses: ["preparando"] },
  { title: "Listos y en camino", statuses: ["listo", "en-camino"] },
  { title: "Entregados", statuses: ["entregado", "cancelado"] },
];

function actions(o: Order): { to: Status; label: string }[] {
  switch (o.status) {
    case "recibido":
      return [{ to: "preparando", label: "A la plancha" }, { to: "cancelado", label: "Cancelar" }];
    case "preparando":
      return o.mode === "domicilio" ? [{ to: "en-camino", label: "Enviar" }] : [{ to: "listo", label: "Listo" }];
    case "listo":
    case "en-camino":
      return [{ to: "entregado", label: "Entregado" }];
    default:
      return [];
  }
}

function Board({ token, onExpired }: { token: string; onExpired: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [live, setLive] = useState(false);
  const [error, setError] = useState("");
  const [fresh, setFresh] = useState<Set<string>>(new Set());

  const upsert = useCallback((o: Order) => {
    setOrders((list) => [o, ...list.filter((x) => x._id !== o._id)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  useEffect(() => {
    api.kitchenOrders(token).then(setOrders, (e: Error & { status?: number }) => (e.status === 401 ? onExpired() : setError(e.message)));
    const source = new EventSource(`${API}/kitchen/stream?token=${encodeURIComponent(token)}`);
    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);
    source.onmessage = (e) => {
      const event = JSON.parse(e.data) as { type: string; order?: Order };
      if (!event.order) return;
      upsert(event.order);
      if (event.type === "created") {
        const id = event.order._id;
        setFresh((s) => new Set(s).add(id));
        window.setTimeout(() => setFresh((s) => { const n = new Set(s); n.delete(id); return n; }), 4000);
      }
    };
    return () => source.close();
  }, [token, onExpired, upsert]);

  const move = async (o: Order, to: Status) => {
    try {
      upsert(await api.setStatus(token, o._id, to));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="px-4 pt-24 pb-12 md:pt-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="script text-[44px]">Cocina</h1>
        <p className="flex items-center gap-2 text-[14px] text-smoke">
          <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-green-500" : "bg-gray-500"}`} />
          {live ? "Recibiendo pedidos en vivo" : "Reconectando…"}
          <button type="button" className="ml-3 underline hover:text-white" onClick={onExpired}>Salir</button>
        </p>
      </div>
      {error ? <p role="alert" className="mb-4 rounded-lg bg-red p-3 font-bold">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const list = orders.filter((o) => col.statuses.includes(o.status));
          return (
            <section key={col.title} className="rounded-lg bg-black/30 p-3" aria-label={col.title}>
              <h2 className="mb-3 flex items-center justify-between px-1 font-bold">
                {col.title} <span className="rounded bg-wine px-2 text-[13px]">{list.length}</span>
              </h2>
              <ul className="flex flex-col gap-3">
                {list.map((o) => (
                  <li key={o._id} className={`rounded-lg bg-coal p-4 shadow transition ${fresh.has(o._id) ? "ring-2 ring-peach" : ""}`}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold">{o.code}</span>
                      <span className="text-[12px] text-smoke">{new Date(o.createdAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="text-[13px] text-smoke">{o.customer.name} · {o.mode === "domicilio" ? "Domicilio" : "Recoge"}</p>
                    <ul className="my-3 text-[14px]">
                      {o.items.map((it) => <li key={it.productId}>{it.qty} × {it.name}</li>)}
                    </ul>
                    <p className="flex items-center justify-between text-[14px]">
                      <span className="text-peach">{statusLabel[o.status]}</span>
                      <span className="font-bold">{money(o.total)}</span>
                    </p>
                    {actions(o).length ? (
                      <div className="mt-3 flex gap-2">
                        {actions(o).map((a) => (
                          <button key={a.to} type="button" onClick={() => move(o, a.to)} className={`btn-red flex-1 !py-1.5 !text-[14px] ${a.to === "cancelado" ? "!border-white/20 !bg-transparent" : ""}`}>
                            {a.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
                {!list.length ? <li className="px-1 py-4 text-[13px] text-smoke">Nada por aquí.</li> : null}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
