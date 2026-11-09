import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "@/lib/menu";
import { BarsIcon, CartIcon, CloseIcon } from "./Icons";

/**
 * The 2023 nav: "Steam Burger" in Dancing Script, then menu · cart · contacto (boxed).
 * It hides while you scroll down and comes back on the way up, as main.js did. On a phone the
 * bars open the dark panel from the right with MENU, COMPRAS and CONTACTO.
 */
export function Nav() {
  const { count, setCartOpen } = useShop();
  const [hidden, setHidden] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobile(false), [pathname]);

  const openCart = () => {
    setMobile(false);
    setCartOpen(true);
  };

  return (
    <header>
      <nav
        className={`fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-wine px-2 transition-transform duration-400 sm:h-[72px] sm:px-4 ${
          hidden && !mobile ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <Link to="/" className="script p-2 text-[30px] text-white active:text-gray-400 sm:text-[40px]">
          Steam Burger
        </Link>

        <ul className="hidden items-center gap-2 text-[18px] md:flex">
          <li>
            <Link to="/menu" className="px-4 py-3 hover:text-gray-400">menu</Link>
          </li>
          <li>
            <button type="button" onClick={openCart} className="relative px-4 py-3 hover:text-gray-400" aria-label={`Carrito, ${count} productos`}>
              <CartIcon />
              {count ? <Badge n={count} /> : null}
            </button>
          </li>
          <li>
            <a href="/#contacto" className="mx-3 rounded-lg border-[3px] border-ember px-3 py-2 hover:bg-ember hover:text-gray-400">
              contacto
            </a>
          </li>
        </ul>

        <div className="flex items-center md:hidden">
          <button type="button" onClick={openCart} className="relative p-4" aria-label={`Carrito, ${count} productos`}>
            <CartIcon />
            {count ? <Badge n={count} /> : null}
          </button>
          <button type="button" onClick={() => setMobile((m) => !m)} className="p-4 hover:text-gray-400" aria-expanded={mobile} aria-label="Menú">
            {mobile ? <CloseIcon /> : <BarsIcon />}
          </button>
        </div>
      </nav>

      <ul
        className={`fixed top-16 z-30 flex h-[calc(100%-4rem)] w-full flex-col items-center gap-2 overflow-y-auto bg-coal py-6 text-[18px] transition-[left] duration-300 md:hidden ${
          mobile ? "left-0" : "left-full"
        }`}
        aria-hidden={!mobile}
        inert={!mobile}
      >
        <li><Link to="/menu" className="block p-4 hover:text-gray-400">MENU</Link></li>
        <li><button type="button" onClick={openCart} className="p-4 hover:text-gray-400">COMPRAS</button></li>
        <li><a href="/#contacto" onClick={() => setMobile(false)} className="block p-4 hover:text-gray-400">CONTACTO</a></li>
      </ul>
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-peach px-1 text-[11px] font-bold text-black">
      {n}
    </span>
  );
}
