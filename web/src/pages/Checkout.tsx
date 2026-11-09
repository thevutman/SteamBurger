import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, money } from "@/lib/api";
import { useShop } from "@/lib/menu";

export function Checkout() {
  const { cart, subtotal, menu, clear } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [mode, setMode] = useState<"domicilio" | "recoger">("domicilio");
  const [payment, setPayment] = useState<"efectivo" | "tarjeta">("efectivo");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fee = mode === "domicilio" ? (menu?.deliveryFee ?? 0) : 0;

  if (!cart.length) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 pt-24 text-center">
        <p className="script text-[36px]">Tu pedido está vacío</p>
        <Link to="/menu" className="btn-red">Ver el menú</Link>
      </main>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const order = await api.createOrder({
        customer: { name: form.name, phone: form.phone, address: mode === "domicilio" ? form.address : "" },
        mode,
        payment,
        items: cart.map((l) => ({ productId: l.productId, qty: l.qty })),
      });
      clear();
      navigate(`/pedido/${order._id}`, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-4 pt-24 pb-16 md:grid-cols-[1fr_340px] md:pt-28">
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <h1 className="script text-[44px]">Finaliza tu pedido</h1>

        <fieldset className="flex gap-3">
          <legend className="mb-2 font-bold">¿Cómo lo quieres?</legend>
          {(["domicilio", "recoger"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`btn-red flex-1 ${mode === m ? "" : "!border-wine !bg-transparent !text-white"}`}>
              {m === "domicilio" ? "A domicilio" : "Paso a recoger"}
            </button>
          ))}
        </fieldset>

        <label className="flex flex-col gap-2 font-bold">
          Nombre
          <input className="field font-normal" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="flex flex-col gap-2 font-bold">
          Teléfono
          <input className="field font-normal" type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="300 123 4567" />
        </label>
        {mode === "domicilio" ? (
          <label className="flex flex-col gap-2 font-bold">
            Dirección
            <input className="field font-normal" required autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Calle, número, apartamento" />
          </label>
        ) : (
          <p className="rounded-lg bg-wine/40 p-3 text-[14px]">Te esperamos en la Calle 57N #10-55. Te avisamos aquí mismo cuando esté listo.</p>
        )}

        <fieldset className="flex gap-3">
          <legend className="mb-2 font-bold">Pago al recibir</legend>
          {(["efectivo", "tarjeta"] as const).map((p) => (
            <button key={p} type="button" aria-pressed={payment === p} onClick={() => setPayment(p)} className={`btn-red flex-1 ${payment === p ? "" : "!border-wine !bg-transparent !text-white"}`}>
              {p === "efectivo" ? "Efectivo" : "Datáfono"}
            </button>
          ))}
        </fieldset>

        {error ? <p role="alert" className="rounded-lg bg-red p-3 font-bold">{error}</p> : null}
        <button type="submit" className="btn-order self-start" disabled={busy}>
          {busy ? "Enviando a la cocina…" : `Pedir ya! · ${money(subtotal + fee)}`}
        </button>
        <p className="text-[12px] text-smoke">Es una tienda de demostración: tu pedido llega al panel de la cocina, pero no hay hamburguesa al final.</p>
      </form>

      <aside className="h-fit rounded-lg bg-black/30 p-5">
        <h2 className="script mb-3 text-[30px]">Resumen</h2>
        <ul className="flex flex-col gap-2 text-[15px]">
          {cart.map(({ product, qty }) => (
            <li key={product.id} className="flex justify-between gap-3">
              <span>{qty} × {product.name}</span>
              <span>{money(product.price * qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-4 text-[15px]">
          <p className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></p>
          <p className="flex justify-between"><span>Domicilio</span><span>{fee ? money(fee) : "Gratis"}</span></p>
          <p className="mt-2 flex justify-between text-[20px] font-bold"><span>Total</span><span>{money(subtotal + fee)}</span></p>
        </div>
      </aside>
    </main>
  );
}
