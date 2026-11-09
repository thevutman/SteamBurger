import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BurgerIcon } from "@/components/Icons";
import { API, api, money, statusLabel, type Order, type Status } from "@/lib/api";

/** Live tracking: the page listens to the server and moves forward as the kitchen updates the order. */
export function Tracking() {
  const { id = "" } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    api.order(id).then((o) => alive && setOrder(o), (e: Error) => alive && setError(e.message));
    const source = new EventSource(`${API}/orders/${id}/stream`);
    source.onopen = () => setLive(true);
    source.onmessage = (e) => alive && setOrder(JSON.parse(e.data) as Order);
    source.onerror = () => setLive(false); // EventSource reconnects by itself
    return () => {
      alive = false;
      source.close();
    };
  }, [id]);

  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 pt-24 text-center">
        <p className="script text-[36px]">No encontramos ese pedido</p>
        <Link to="/menu" className="btn-red">Volver al menú</Link>
      </main>
    );
  }
  if (!order) return <p className="pt-40 pb-20 text-center text-smoke">Buscando tu pedido…</p>;

  const steps: Status[] = ["recibido", "preparando", order.mode === "domicilio" ? "en-camino" : "listo", "entregado"];
  const current = steps.indexOf(order.status);
  const cancelled = order.status === "cancelado";

  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 md:pt-28">
      <p className="text-[14px] text-smoke">Pedido {order.code}</p>
      <h1 className="script text-[clamp(40px,7vw,60px)] leading-tight">
        {cancelled ? "Pedido cancelado" : order.status === "entregado" ? "¡Buen provecho!" : `¡Gracias, ${order.customer.name.split(" ")[0]}!`}
      </h1>
      <p className="mt-2 flex items-center gap-2 text-[14px] text-smoke">
        <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-green-500" : "bg-gray-500"}`} />
        {live ? "En vivo: esta página se actualiza sola" : "Reconectando…"}
      </p>

      {!cancelled ? (
        <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Estado del pedido">
          {steps.map((s, i) => {
            const done = i <= current;
            return (
              <li key={s} className="flex flex-col items-center gap-2 text-center" aria-current={i === current ? "step" : undefined}>
                <span className={`grid h-12 w-12 place-items-center rounded-full transition-colors duration-500 ${done ? "bg-red text-white" : "bg-white/10 text-white/40"} ${i === current && order.status !== "entregado" ? "animate-pulse" : ""}`}>
                  <BurgerIcon className="h-5 w-5" />
                </span>
                <span className={`text-[13px] font-bold ${done ? "text-white" : "text-white/40"}`}>{statusLabel[s]}</span>
              </li>
            );
          })}
        </ol>
      ) : null}

      <section className="mt-12 rounded-lg bg-black/30 p-5">
        <h2 className="script mb-3 text-[28px]">Tu pedido</h2>
        <ul className="flex flex-col gap-2 text-[15px]">
          {order.items.map((it) => (
            <li key={it.productId} className="flex justify-between"><span>{it.qty} × {it.name}</span><span>{money(it.price * it.qty)}</span></li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-white/10 pt-4 text-[18px] font-bold"><span>Total</span><span>{money(order.total)}</span></p>
        <p className="mt-3 text-[14px] text-smoke">
          {order.mode === "domicilio" ? `A domicilio: ${order.customer.address}` : "Pasas a recoger a la Calle 57N #10-55"} · Pago en {order.payment === "efectivo" ? "efectivo" : "datáfono"}
        </p>
      </section>

      <p className="mt-8 text-[14px] text-smoke">
        ¿Quieres ver el otro lado? Abre el <Link to="/cocina" className="text-peach underline">panel de la cocina</Link> en otra pestaña y mueve tu pedido: esta página cambia sola.
      </p>
    </main>
  );
}
