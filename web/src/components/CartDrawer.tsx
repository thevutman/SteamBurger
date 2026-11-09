import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { money } from "@/lib/api";
import { useShop } from "@/lib/menu";
import { CloseIcon } from "./Icons";

/** The cart slides in from the right like the 2023 mobile menu, on the same dark background. */
export function CartDrawer() {
  const { cart, subtotal, setQty, cartOpen, setCartOpen } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${cartOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        inert={!cartOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-coal shadow-2xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between bg-wine px-5 py-4">
          <h2 className="script text-[32px]">Tu pedido</h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar" className="p-2 hover:text-gray-400">
            <CloseIcon />
          </button>
        </div>

        {cart.length ? (
          <>
            <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
              {cart.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-4 py-4">
                  <img src={product.image} alt="" className="h-16 w-16 rounded-[5px] object-cover" />
                  <div className="flex-1">
                    <p className="script text-[22px] leading-tight">{product.name}</p>
                    <p className="text-[14px] text-smoke">{money(product.price * qty)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="btn-red !h-8 !w-8 !p-0" onClick={() => setQty(product.id, qty - 1)} aria-label={`Quitar una ${product.name}`}>−</button>
                    <span className="w-6 text-center font-bold" aria-live="polite">{qty}</span>
                    <button type="button" className="btn-red !h-8 !w-8 !p-0" onClick={() => setQty(product.id, qty + 1)} aria-label={`Agregar una ${product.name}`}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 px-5 py-5">
              <p className="flex justify-between text-[18px] font-bold">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </p>
              <button
                type="button"
                className="btn-order mt-4 w-full"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/pedido");
                }}
              >
                Pedir ya!
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="script text-[30px]">Todavía no hay nada aquí</p>
            <p className="text-[15px] text-smoke">Toca el precio de cualquier hamburguesa para agregarla.</p>
            <button type="button" className="btn-red mt-2" onClick={() => { setCartOpen(false); navigate("/menu"); }}>Ver el menú</button>
          </div>
        )}
      </aside>
    </>
  );
}
