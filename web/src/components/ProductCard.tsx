import { useState } from "react";
import { money, type Product } from "@/lib/api";
import { useShop } from "@/lib/menu";

/**
 * The 2023 product block: the square photo with 5px corners, the name in Dancing Script, the
 * description in Comfortaa and two red buttons. The price button now adds to the cart.
 */
export function ProductCard({ product }: { product: Product }) {
  const { add, cart } = useShop();
  const [added, setAdded] = useState(false);
  const inCart = cart.find((l) => l.productId === product.id)?.qty ?? 0;

  return (
    <article className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
      <div className="relative shrink-0">
        <img src={product.image} alt={product.name} loading="lazy" className="h-[200px] w-[200px] rounded-[5px] object-cover" />
        {product.tag ? (
          <span className="absolute top-2 left-2 rounded bg-peach px-2 py-0.5 text-[12px] font-bold text-black">{product.tag}</span>
        ) : null}
      </div>
      <div className="max-w-[400px] py-2 text-[18px] sm:pr-6">
        <h3 className="script pb-3 text-[30px]">{product.name}</h3>
        <p className="pb-6 text-[15px] leading-relaxed">{product.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <button
            type="button"
            className="btn-red"
            onClick={() => {
              add(product.id);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1200);
            }}
            aria-label={`Agregar ${product.name} al carrito por ${money(product.price)}`}
          >
            {added ? "¡Agregada!" : money(product.price)}
          </button>
          {inCart ? <span className="text-[14px] text-peach">{inCart} en tu pedido</span> : null}
        </div>
      </div>
    </article>
  );
}
